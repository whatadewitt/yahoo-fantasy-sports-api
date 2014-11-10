var playerHelper = require('../helpers/playerHelper.js');
var leagueHelper = require('../helpers/leagueHelper.js');

/*
 * Includes player key, id, name, editorial information, image, eligible positions, etc.
*/
exports.meta = function(playerKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/player/' + playerKey + '/metadata?format=json')
    .then(function(data) {
      var meta = playerHelper.mapPlayer(data.fantasy_content.player[0]);

      cb(meta);
    });
};

/*
 * Player stats and points (if in a league context).
 */
exports.stats = function(playerKey, cb) {
  // can get this by week and/or by season...
  // { week: [WEEKNUM] }
  //;type=week;week=12

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/player/' + playerKey + '/stats?format=json')
    .then(function(data) {
      var d = {};
      d.fantasy_content = data[0];
      // var stats = data.fantasy_content;
      var stats = playerHelper.mapStats(d.fantasy_content.player[1].player_stats);
      var player = playerHelper.mapPlayer(d.fantasy_content.player[0]);

      stats.player = player;

      cb(stats);
    });
};

/*
 * Data about ownership percentage of the player
 */
exports.percent_owned = function(playerKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/player/' + playerKey + '/percent_owned?format=json')
    .then(function(data) {
      var d = {};
      d.fantasy_content = data[0];
      // var ownership = data.fantasy_content;
      var ownership = d.fantasy_content.player[1].percent_owned[1];
      var player = playerHelper.mapPlayer(d.fantasy_content.player[0]);

      // todo: do we need coverage type and/or delta????
      // wtf are those about?!?

      ownership.player = player;

      cb(ownership);
    });
};

/*
 * The player ownership status within a league (whether they're owned by a team, on waivers, or free agents). Only relevant within a league.
 */
exports.ownership = function(leagueKey, playerKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + leagueKey + '/players;player_keys=' + playerKey + '/ownership?format=json')
    .then(function(data) {
      var d = {};
      d.fantasy_content = data[0];

      // move this to helper? not really re-used...
      var league = d.fantasy_content.league[0];
      var player = playerHelper.mapPlayer(d.fantasy_content.league[1].players[0].player[0]);
      var status = d.fantasy_content.league[1].players[0].player[1].ownership

      delete status[0];

      status.league = league;
      status.player = player;
      // var isOwned = data.fantasy_content;
      // var isOwned = d.fantasy_content.player[1].percent_owned[1];
      // var player = playerHelper.mapPlayer(d.fantasy_content.player[0]);

      // todo: what's the data like when the player isn't owned?
      // todo: worth returning more info of the team

      cb(status);
    });
};

/*
 * Average pick, Average round and Percent Drafted.
 */
exports.draft_analysis = function(playerKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/player/' + playerKey + '/draft_analysis?format=json')
    .then(function(data) {
      var d = {};
      d.fantasy_content = data[0];
      // var draft = data.fantasy_content;
      var draft_analysis = playerHelper.mapDraftAnalysis(d.fantasy_content.player[1].draft_analysis);
      var player = playerHelper.mapPlayer(d.fantasy_content.player[0]);

      draft_analysis.player = player;

      cb(draft_analysis);
    });
};
