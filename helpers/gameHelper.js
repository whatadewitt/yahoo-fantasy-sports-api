var _ = require('lodash');
var playerHelper = require('./playerHelper.js');
var teamHelper = require('./teamHelper.js');

exports.mapLeagues = function(leagues) {
  leagues = _.filter(leagues, function(l) { return typeof(l) === 'object'; });
  leagues = _.map(leagues, function(l) { return l.league[0]; });

  return leagues;
};

// todo: again, this should be more re-usable
exports.mapPlayers = function(players) {
  players = _.filter(players, function(p) { return typeof(p) === 'object'; });
  players = _.map(players, function(p) { return playerHelper.mapPlayer(p.player[0]); });

  return players;
};

exports.mapWeeks = function(weeks) {
  weeks = _.filter(weeks, function(w) { return typeof(w) === 'object'; });
  weeks = _.map(weeks, function(w) { return w.game_week; });

  return weeks;
};

exports.mapStatCategories = function(statcats) {
  statcats = _.filter(statcats, function(s) { return typeof(s) === 'object'; });
  statcats = _.map(statcats, function(s) { return s.stat; });

  // additional cleanup...
  _.each(statcats, function(statcat) {
    if (_.has(statcat, 'position_types')) {
      statcat.position_types = _.map(statcat.position_types, 'position_type');
    }

    if (_.has(statcat, 'base_stats')) {
      statcat.base_stats = _.map(statcat.base_stats, 'base_stat');
      statcat.base_stats = _.map(statcat.base_stats, 'stat_id');
    }
  });

  return statcats;
};

exports.mapPositionTypes = function(positions) {
  positions = _.filter(positions, function(p) { return typeof(p) === 'object'; });
  positions = _.map(positions, function(p) { return p.position_type; });

  return positions;
};

exports.mapRosterPositions = function(positions) {
  positions = _.filter(positions, function(p) { return typeof(p) === 'object'; });
  positions = _.map(positions, function(p) { return p.roster_position; });

  return positions;
};

exports.mapTeams = function(teams) {
  teams = _.filter(teams, function(t) { return typeof(t) === 'object'; });
  teams = _.map(teams, function(t) { return teamHelper.mapTeam(t.team[0]); });

  return teams;
};

exports.parseCollection = function(games, subresources) {
  var self = this;

  games = _.filter(games, function(g) { return typeof(g) === 'object'; });
  games = _.map(games, function(g) { return g.game; });
  games = _.map(games, function(g) {
    var game = g[0];

    _.forEach(subresources, function(resource, idx) {
      switch (resource) {
        case 'leagues':
          game.leagues = self.mapLeagues(g[idx + 1].leagues);
          break;

        case 'players':
          game.players = self.mapPlayers(g[idx + 1].players);
          break;

        case 'game_weeks':
          game.game_weeks = self.mapWeeks(g[idx + 1].game_weeks);
          break;

        case 'stat_categories':
          game.stat_categories = self.mapStatCategories(g[idx + 1].stat_categories.stats);
          break;

        case 'position_types':
          game.position_types = self.mapPositionTypes(g[idx + 1].position_types);
          break;

        case 'roster_positions':
          game.roster_positions = self.mapRosterPositions(g[idx + 1].roster_positions);
          break;

        case 'teams':
          game.teams = self.mapTeams(g[idx + 1].teams);
          break;

        default:
          break;
      }
    });

    return game;
  });

  return games;
};
