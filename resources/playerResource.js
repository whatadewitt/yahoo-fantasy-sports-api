var playerHelper = require('../helpers/playerHelper.js');
var leagueHelper = require('../helpers/leagueHelper.js');

module.exports = PlayerResource;

function PlayerResource(yf) {
  this.yf = yf;
}

/*
 * Includes player key, id, name, editorial information, image, eligible positions, etc.
*/
PlayerResource.prototype.meta = function(playerKey, cb) {
  var apiCallback = this._meta_callback.bind(this, cb);
  
  this
    .yf
    .api(
      this.yf.GET,
      'http://fantasysports.yahooapis.com/fantasy/v2/player/' + playerKey + '/metadata?format=json',
      apiCallback
    );
};

PlayerResource.prototype._meta_callback = function(cb, e, data) {
  if ( e ) return cb(e);
  
  var meta = playerHelper.mapPlayer(data.fantasy_content.player[0]);
  return cb(null, meta);
};

/*
 * Player stats and points (if in a league context).
 */
PlayerResource.prototype.stats = function(playerKey, week, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/player/' + playerKey + '/stats'; 
  
  if ( 2 == arguments.length ) {
    cb = week;
    week = null;
  } else if ( 3 == arguments.length ) {
    url += ';type=week;week=' + week;
  }
  
  var apiCallback = this._stats_callback.bind(this, cb);
  
  url += '?format=json';
  
  this
    .yf
    .api(
      this.yf.GET,
      url,
      apiCallback
    );
};

PlayerResource.prototype._stats_callback = function(cb, e, data) {
  if ( e ) return cb(e);
  
  var stats = playerHelper.mapStats(data.fantasy_content.player[1].player_stats);
  var player = playerHelper.mapPlayer(data.fantasy_content.player[0]);
  player.stats = stats;

  return cb(null, player);
};

/*
 * Data about ownership percentage of the player
 */
PlayerResource.prototype.percent_owned = function(playerKey, cb) {
  var apiCallback = this._percent_owned_callback.bind(this, cb);
  
  this
    .yf
    .api(
      this.yf.GET,
      'http://fantasysports.yahooapis.com/fantasy/v2/player/' + playerKey + '/percent_owned?format=json',
      apiCallback
    );
};

PlayerResource.prototype._percent_owned_callback = function(cb, e, data) {
  if ( e ) return cb(e);
  
  var percent_owned = data.fantasy_content.player[1].percent_owned[1];
  var player = playerHelper.mapPlayer(data.fantasy_content.player[0]);
  
  // todo: do we need coverage type and/or delta????
  player.percent_owned = percent_owned;

  return cb(null, player);
};

/*
 * The player ownership status within a league (whether they're owned by a team, on waivers, or free agents). Only relevant within a league.
 */
PlayerResource.prototype.ownership = function(playerKey, leagueKey, cb) {
  var apiCallback = this._ownership_callback.bind(this, cb);
  
  this
    .yf
    .api(
      this.yf.GET,
      'http://fantasysports.yahooapis.com/fantasy/v2/league/' + leagueKey + '/players;player_keys=' + playerKey + '/ownership?format=json',
      apiCallback
    );
};

PlayerResource.prototype._ownership_callback = function(cb, e, data) {
  if ( e ) return cb(e);
  
  var league = data.fantasy_content.league[0];
  var player = playerHelper.mapPlayer(data.fantasy_content.league[1].players[0].player[0]);
  var status = data.fantasy_content.league[1].players[0].player[1].ownership

  delete status[0];

  player.status = status;
  player.league = league;
  
  return cb(null, player);
};

/*
 * Average pick, Average round and Percent Drafted.
 */
PlayerResource.prototype.draft_analysis = function(playerKey, cb) {
  var apiCallback = this._draft_analysis_callback.bind(this, cb);
  
  this
    .yf
    .api(
      this.yf.GET,
      'http://fantasysports.yahooapis.com/fantasy/v2/player/' + playerKey + '/draft_analysis?format=json',
      apiCallback
    );
};

PlayerResource.prototype._draft_analysis_callback = function(cb, e, data) {
  if ( e ) return cb(e);
  
  var draft_analysis = playerHelper.mapDraftAnalysis(data.fantasy_content.player[1].draft_analysis);
  var player = playerHelper.mapPlayer(data.fantasy_content.player[0]);

  player.draft_analysis = draft_analysis;

  return cb(null, player);
};
