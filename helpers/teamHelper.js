var _ = require('lodash');
var playerHelper = require('./playerHelper.js');

// todo: use this where possible...
exports.teamMap = function(t) {
  return {
    team_key: t[0].team_key,
    team_id: t[1].team_id,
    name: t[2].name,
    is_owned_by_current_login: t[3].is_owned_by_current_login,
    url: t[4].url,
    team_logo: t[5].team_logos[0].team_logo.url,
    waiver_priority: t[7].waiver_priority,
    number_of_moves: t[9].number_of_moves,
    number_of_trades: t[10].number_of_trades,
    // wtf is "roster adds" object?
    clinched_playoffs: t[12].clinched_playoffs,
    managers: _.map(t[13].managers, function(m) {
      return m.manager;
    })
  };
};

exports.rosterMap = function(roster) {
  var players = roster[0].players;

  delete roster[0];

  // todo: look at chaining in lodash... and/or "reduce"
  players = _.filter(players, function(p) { return typeof(p) == 'object'; });
  players = _.map(players, function(p) { return p.player[0]; });
  players = _.map(players, function(p) { return playerHelper.mapPlayer(p); });

  roster.players = players;

  return roster;
};

exports.statsMap = function(stats) {
  stats.stats = _.map(stats.stats, function(s) { return s.stat; });

  return stats;
};

exports.draftMap = function(draft) {
  draft = _.filter(draft, function(d) { return typeof(d) == 'object'; });
  draft = _.map(draft, function(d) { return d.draft_result; });
  draft = _.sortBy(draft, 'round');

  return draft;
};
