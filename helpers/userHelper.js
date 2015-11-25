var _ = require('lodash');
var teamHelper = require('../helpers/teamHelper.js');

exports.mapGames = function(games) {
  games = _.filter(games, function(g) { return typeof(g) === 'object'; });
  games = _.map(games, function(g) { return ( _.isArray(g.game) ) ? g.game[0] : g.game; });

  return games;
};

exports.mapUserLeagues = function(games) {
  games = _.filter(games, function(g) { return typeof(g) === 'object'; });
  games = _.map(games, 'game');

  // todo: check to make sure that pick'em requires this isArray check
  games = _.map(games, function(g) {
    var leagues = g[1].leagues;
    leagues = _.filter(leagues, function(l) { return typeof(l) === 'object'; });
    leagues = _.map(leagues, 'league');
    g[0].leagues = _.map(leagues, function(l) { return l[0]; } );
    return g[0];
  });

  return games;
};

exports.mapUserTeams = function(games) {
  games = _.filter(games, function(g) { return typeof(g) === 'object'; });
  games = _.map(games, 'game');

  // todo: check to make sure that pick'em requires this isArray check
  games = _.map(games, function(g) {
    var teams = g[1].teams;
    teams = _.filter(teams, function(t) { return typeof(t) === 'object'; });
    teams = _.map(teams, function(t) { return teamHelper.mapTeam(t.team[0]); });
    g[0].teams = teams;
    return g[0];
  });

  return games;
};

exports.parseCollection = function(user, subresources) {
  var self = this;

  _.forEach(subresources, function(resource, idx) {
    switch (resource) {
      case 'games':
        user.games = self.mapGames(t[idx + 1].games);
        break;

      case 'leagues':
        user.leagues = self.mapUserLeagues(t[idx + 1].leagues);
        break;

      case 'teams':
        user.teams = self.mapUserTeams(t[idx + 1].teams);
        break;

      default:
        break;
    }
  });

  return user;
};
