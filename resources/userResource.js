var userHelper = require('../helpers/userHelper.js');

module.exports = UserResource;

function UserResource(yf) {
  this.yf = yf;
}

UserResource.prototype.games = function(cb) {
  var apiCallback = this._games_callback.bind(this, cb);
  
  this
    .yf
    .api(
      this.yf.GET,
      'http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games?format=json',
      apiCallback
    );
};

UserResource.prototype._games_callback = function(cb, e, data) {
  if ( e ) return cb(e);
  
  var user = data.fantasy_content.users[0].user[0];
  var games = userHelper.mapGames(data.fantasy_content.users[0].user[1].games);
  user.games = games;

  return cb(null, user);
};

UserResource.prototype.game_leagues = function(gameKeys, cb) {
  var apiCallback = this._game_leagues_callback.bind(this, cb);
  
  // todo: get stats from other users...
  if ( !Array.isArray(gameKeys) ) {
    gameKeys = [ gameKeys ];
  }

  this
    .yf
    .api(
      this.yf.GET,
      'http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=' + gameKeys.join(',') + '/leagues?format=json',
      apiCallback
    );
};

UserResource.prototype._game_leagues_callback = function(cb, e, data) {
  if ( e ) return cb(e);
  
  var user = data.fantasy_content.users[0].user[0];
  var leagues = userHelper.mapUserLeagues(data.fantasy_content.users[0].user[1].games);
  user.leagues = leagues;

  return cb(null, user);
};

UserResource.prototype.game_teams = function(gameKeys, cb) {
  var apiCallback = this._game_teams_callback.bind(this, cb);
  
  if ( !Array.isArray(gameKeys) ) {
    gameKeys = [ gameKeys ];
  }

  this
    .yf
    .api(
      this.yf.GET,
      'http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=' + gameKeys.join(',') + '/teams?format=json',
      apiCallback
    );
};

UserResource.prototype._game_teams_callback = function(cb, e, data) {
  if ( e ) return cb(e);
  
  var user = data.fantasy_content.users[0].user[0];
  var teams = userHelper.mapUserTeams(data.fantasy_content.users[0].user[1].games);
  user.teams = teams;

  return cb(null, user);
};