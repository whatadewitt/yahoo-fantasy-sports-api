var _ = require('lodash');
var teamHelper = require('../helpers/teamHelper.js');

exports.games = function(cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games?format=json')
    .then(function(data) {
      var meta = data.fantasy_content;

      cb(meta);
    });
}

exports.leagues = function(gameKeys, cb) {
  // todo: get stats from other users...
  if ( !_.isArray(gameKeys) ) {
    gameKeys = [ gameKeys ];
  }

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=' + gameKeys.join(',') + '/leagues?format=json')
    .then(function(data) {
      var user = data.fantasy_content.users[0].user;

      // this should be mapped cleaner...
      var games = user[1].games;
      games = _.filter(games, function(g) { return typeof(g) == 'object'; });
      games = _.map(games, function(g) { return g.game; });
      games = _.map(games, function(g) {
        var leagues = _.filter(g[1].leagues, function(l) { return typeof(l) == 'object'; });
        leagues = _.map(leagues, function(l) { return l.league[0]; });
        g[0].leagues = leagues;
        return g[0];
      });

      var userdata = {
        guid: user[0].guid,
        games: games
      };

      cb(userdata);
    });
}

exports.teams = function(gameKeys, cb) {

  if ( !_.isArray(gameKeys) ) {
    gameKeys = [ gameKeys ];
  }

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=' + gameKeys.join(',') + '/teams?format=json')
    .then(function(data) {
      var user = data.fantasy_content.users[0].user;

      // this should be mapped cleaner...
      var games = user[1].games;
      games = _.filter(games, function(g) { return typeof(g) == 'object'; });
      games = _.map(games, function(g) { return g.game; });
      games = _.map(games, function(g) {
        var teams = _.filter(g[1].teams, function(t) { return typeof(t) == 'object'; });
        teams = _.map(teams, function(t) { return teamHelper.teamMap(t.team[0]); });
        g[0].teams = teams;
        return g[0];
      });

      var userdata = {
        guid: user[0].guid,
        games: games
      };

      cb(userdata);
    });
}
