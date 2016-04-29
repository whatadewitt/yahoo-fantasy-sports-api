var gameHelper = require('../helpers/gameHelper.js');

module.exports = GameResource;

function GameResource(yf) {
  this.yf = yf;
}

/* gameKey can be game_key or league (ie/ nfl, mlb) */
GameResource.prototype.meta = function(gameKey, cb) {
  var apiCallback = this._meta_callback.bind(this, cb);
  
  this
    .yf
    .api(
      this.yf.GET,
      'http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/metadata?format=json', 
      apiCallback
    );
};

GameResource.prototype._meta_callback = function(cb, e, data) {
  if ( e ) return cb(e);
  
  var meta = data.fantasy_content.game[0];
  return cb(null, meta);
};

/* league key can be an array of keys */
GameResource.prototype.leagues = function(gameKey, leagueKey, cb) {
  var apiCallback = this._leagues_callback.bind(this, cb);
  
  if ( typeof leagueKey === 'string' ) {
    leagueKey = [leagueKey];
  }

  this
    .yf
    .api(
      this.yf.GET,
      'http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/leagues;league_keys=' + leagueKey.join(',') + '?format=json',
      apiCallback
    );
};

GameResource.prototype._leagues_callback = function(cb, e, data) {
  if ( e ) return cb(e);
  
  var leagues = gameHelper.mapLeagues(data.fantasy_content.game[1].leagues);
  var game = data.fantasy_content.game[0];

  game.leagues = leagues;

  return cb(null, game);
};

GameResource.prototype.players = function(gameKey, playerKey, cb) {
  var apiCallback = this._players_callback.bind(this, cb);
  
  if ( typeof playerKey === 'string' ) {
    playerKey = [playerKey];
  }

  this
    .yf
    .api(
      this.yf.GET,
      'http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/players;player_keys=' + playerKey.join(',') + '?format=json',
      apiCallback
    );
};

GameResource.prototype._players_callback = function(cb, e, data) {
  if ( e ) return cb(e);
  
  var players = gameHelper.mapPlayers(data.fantasy_content.game[1].players);
  var game = data.fantasy_content.game[0];

  game.players = players;

  return cb(null, game);
};

GameResource.prototype.game_weeks = function(gameKey, cb) {
  var apiCallback = this._game_weeks_callback.bind(this, cb);
  
  this
    .yf
    .api(
      this.yf.GET,
      'http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/game_weeks?format=json',
      apiCallback
    );
};

GameResource.prototype._game_weeks_callback = function(cb, e, data) {
  if ( e ) return cb(e);
  
  var weeks = gameHelper.mapWeeks(data.fantasy_content.game[1].game_weeks);
  var game = data.fantasy_content.game[0];

  game.weeks = weeks;

  return cb(null, game);
};

GameResource.prototype.stat_categories = function(gameKey, cb) {
  var apiCallback = this._stat_categories_callback.bind(this, cb);
  
  this
    .yf
    .api(
      this.yf.GET,
      'http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/stat_categories?format=json',
      apiCallback
    );
};

GameResource.prototype._stat_categories_callback = function(cb, e, data) {
  if ( e ) return cb(e);
  
  var stat_categories = gameHelper.mapStatCategories(data.fantasy_content.game[1].stat_categories.stats);
  var game = data.fantasy_content.game[0];

  game.stat_categories = stat_categories;

  return cb(null, game);
};

GameResource.prototype.position_types = function(gameKey, cb) {
  var apiCallback = this._position_types_callback.bind(this, cb);
  
  this
    .yf
    .api(
      this.yf.GET,
      'http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/position_types?format=json',
      apiCallback
    );
};

GameResource.prototype._position_types_callback = function(cb, e, data) {
  if ( e ) return cb(e);
  
  var position_types = gameHelper.mapPositionTypes(data.fantasy_content.game[1].position_types);
  var game = data.fantasy_content.game[0];

  game.position_types = position_types;

  return cb(null, game);
};

GameResource.prototype.roster_positions = function(gameKey, cb) {
  var apiCallback = this._position_types_callback.bind(this, cb);
  
  this
    .yf
    .api(
      this.yf.GET,
      'http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/roster_positions?format=json',
      apiCallback
    );
};

GameResource.prototype._roster_positions_callback = function(cb, e, data) {
  if ( e ) return cb(e);
  
  var roster_positions = gameHelper.mapRosterPositions(data.fantasy_content.game[1].roster_positions);
  var game = data.fantasy_content.game[0];

  game.roster_positions = roster_positions;

  return cb(null, game);
};