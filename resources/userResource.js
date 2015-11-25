var userHelper = require('../helpers/userHelper.js');

module.exports = UserResource;

function UserResource(yf) {
  this.yf = yf;
}

UserResource.prototype.games = function(cb) {
  this
    .yf
    .api('http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games?format=json')
    .then(function(data) {
      var user = data.fantasy_content.users[0].user[0];
      var games = userHelper.mapGames(data.fantasy_content.users[0].user[1].games);

      user.games = games;

      cb(null, user);
    }, function(e) {
      cb(e, null);
    });
};

UserResource.prototype.game_leagues = function(gameKeys, cb) {
  var self = this;
  // todo: get stats from other users...
  if ( !Array.isArray(gameKeys) ) {
    gameKeys = [ gameKeys ];
  }

  this
    .yf
    .api('http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=' + gameKeys.join(',') + '/leagues?format=json')
    .then(function(data) {
      var user = data.fantasy_content.users[0].user[0];
      var leagues = userHelper.mapUserLeagues(data.fantasy_content.users[0].user[1].games);

      user.leagues = leagues;

      cb(null, user);
    }, function(e) {
      cb(e, null);
    });
};

UserResource.prototype.game_teams = function(gameKeys, cb) {
  if ( !Array.isArray(gameKeys) ) {
    gameKeys = [ gameKeys ];
  }

  this
    .yf
    .api('http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=' + gameKeys.join(',') + '/teams?format=json')
    .then(function(data) {
      var user = data.fantasy_content.users[0].user[0];
      var teams = userHelper.mapUserTeams(data.fantasy_content.users[0].user[1].games);

      user.teams = teams;

      cb(null, user);
    }, function(e) {
      cb(e, null);
    });
};
