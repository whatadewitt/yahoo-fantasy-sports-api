var _ = require('lodash');
var userHelper = require('../helpers/userHelper.js');

module.exports = function() {
  return new UserResource();
};

function UserResource() {
  return this;
};

UserResource.prototype.games = function(cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games?format=json')
    .then(function(data) {
      var user = data.fantasy_content.users[0].user[0];
      var games = userHelper.mapGames(data.fantasy_content.users[0].user[1].games);

      user.games = games;

      cb(null, user);
    }, function(e) {
      // self.err(e, cb);
      cb(e, null);
    });
};

UserResource.prototype.game_leagues = function(gameKeys, cb) {
  var self = this;
  // todo: get stats from other users...
  if ( !_.isArray(gameKeys) ) {
    gameKeys = [ gameKeys ];
  }

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=' + gameKeys.join(',') + '/leagues?format=json')
    .then(function(data) {
      var user = data.fantasy_content.users[0].user[0];
      var leagues = userHelper.mapUserLeagues(data.fantasy_content.users[0].user[1].games);

      user.leagues = leagues;

      cb(null, user);
    }, function(e) {
      // self.err(e, cb);
      cb(e, null);
    });
};

UserResource.prototype.game_teams = function(gameKeys, cb) {
  var self = this;

  if ( !_.isArray(gameKeys) ) {
    gameKeys = [ gameKeys ];
  }

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=' + gameKeys.join(',') + '/teams?format=json')
    .then(function(data) {
      var user = data.fantasy_content.users[0].user[0];
      var teams = userHelper.mapUserTeams(data.fantasy_content.users[0].user[1].games);

      user.teams = teams;

      cb(null, user);
    }, function(e) {
      // self.err(e, cb);
      cb(e, null);
    });
};
