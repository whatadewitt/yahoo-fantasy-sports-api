var playerHelper = require('../helpers/playerHelper.js');
var leagueHelper = require('../helpers/leagueHelper.js');

module.exports = function() {
  return new PlayerResource();
};

function PlayerResource() {
  return this;
};

/*
 * Includes player key, id, name, editorial information, image, eligible positions, etc.
*/
PlayerResource.prototype.meta = function(playerKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/player/' + playerKey + '/metadata?format=json')
    .then(function(data) {
      var meta = playerHelper.mapPlayer(data.fantasy_content.player[0]);

      cb(null, meta);
    }, function(e) {
      // self.err(e, cb);
      cb(e, null);
    });
};

/*
 * Player stats and points (if in a league context).
 */
PlayerResource.prototype.stats = function(playerKey, cb) {
  var self = this;

  // todo: can get this by week and/or by season...
  // { week: [WEEKNUM] }
  //;type=week;week=12

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/player/' + playerKey + '/stats?format=json')
    .then(function(data) {
      var stats = playerHelper.mapStats(data.fantasy_content.player[1].player_stats);
      var player = playerHelper.mapPlayer(data.fantasy_content.player[0]);

      player.stats = stats;

      cb(null, player);
    }, function(e) {
      // self.err(e, cb);
      cb(e, null);
    });
};

/*
 * Data about ownership percentage of the player
 */
PlayerResource.prototype.percent_owned = function(playerKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/player/' + playerKey + '/percent_owned?format=json')
    .then(function(data) {
      var percent_owned = data.fantasy_content.player[1].percent_owned[1];
      var player = playerHelper.mapPlayer(data.fantasy_content.player[0]);

      // todo: do we need coverage type and/or delta????
      // wtf are those about?!?

      player.percent_owned = percent_owned;

      cb(null, player);
    }, function(e) {
      // self.err(e, cb);
      cb(e, null);
    });
};

/*
 * The player ownership status within a league (whether they're owned by a team, on waivers, or free agents). Only relevant within a league.
 */
PlayerResource.prototype.ownership = function(playerKey, leagueKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + leagueKey + '/players;player_keys=' + playerKey + '/ownership?format=json')
    .then(function(data) {
      // move this to helper? not really re-used...
      var league = data.fantasy_content.league[0];
      var player = playerHelper.mapPlayer(data.fantasy_content.league[1].players[0].player[0]);
      var status = data.fantasy_content.league[1].players[0].player[1].ownership

      delete status[0];

      player.status = status;
      player.league = league;
      // var isOwned = data.fantasy_content;
      // var isOwned = d.fantasy_content.player[1].percent_owned[1];
      // var player = playerHelper.mapPlayer(d.fantasy_content.player[0]);

      // todo: what's the data like when the player isn't owned?
      // todo: worth returning more info of the team

      cb(null, player);
    }, function(e) {
      // self.err(e, cb);
      cb(e, null);
    });
};

/*
 * Average pick, Average round and Percent Drafted.
 */
PlayerResource.prototype.draft_analysis = function(playerKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/player/' + playerKey + '/draft_analysis?format=json')
    .then(function(data) {
      var draft_analysis = playerHelper.mapDraftAnalysis(data.fantasy_content.player[1].draft_analysis);
      var player = playerHelper.mapPlayer(data.fantasy_content.player[0]);

      player.draft_analysis = draft_analysis;

      cb(null, player);
    }, function(e) {
      // self.err(e, cb);
      cb(e, null);
    });
};
