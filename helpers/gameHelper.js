var _ = require('lodash');

exports.leaguesMap = function(leagues) {
  leagues = _.filter(leagues, function(l) { return typeof(l) == 'object'; });
  leagues = _.map(leagues, function(l) { return l.league[0]; });

  return leagues;
};

// todo: again, this should be more re-usable
exports.playersMap = function(players) {
  players = _.filter(players, function(p) { return typeof(p) == 'object'; });
  players = _.map(players, function(p) { return p.player[0]; });

  return players;
};

exports.weeksMap = function(weeks) {
  weeks = _.filter(weeks, function(w) { return typeof(w) == 'object'; });
  weeks = _.map(weeks, function(w) { return w.game_week; });

  return weeks;
};

exports.statCategoriesMap = function(statcats) {
  statcats = _.filter(statcats, function(s) { return typeof(s) == 'object'; });
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

exports.positionTypesMap = function(positions) {
  positions = _.filter(positions, function(p) { return typeof(p) == 'object'; });
  positions = _.map(positions, function(p) { return p.position_type; });

  return positions;
};

exports.rosterPositionsMap = function(positions) {
  positions = _.filter(positions, function(p) { return typeof(p) == 'object'; });
  positions = _.map(positions, function(p) { return p.roster_position; });

  return positions;
};
