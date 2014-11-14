var _ = require('lodash');
var transactionHelper = require('./transactionHelper.js');

/*
 * Helper function to map data to a "team"
 */
exports.teamsMap = function(teams) {
  teams = _.filter(teams, function(t) { return typeof(t) == 'object'; });
  teams = _.map(teams, function(t) { return t.team[0]; });
  teams = _.map(teams, function(t) {
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
  });
  return teams;
};

exports.settingsMap = function(settings) {
  settings.stat_categories = _.map(
    settings.stat_categories.stats,
    function(s) {
      s.stat.stat_position_types = _.map(s.stat.stat_position_types, 'stat_position_type');
      return s.stat;
    });

  settings.roster_positions = _.map(
    settings.roster_positions,
    function(p) {
      return p.roster_position;
    });

  return settings;
};

exports.draftMap = function(draft) {
  draft = _.filter(draft, function(d) { return typeof(d) == 'object'; });
  draft = _.map(draft, function(d) { return d.draft_result; })

  return draft;
};

exports.scoreboardMap = function(scoreboard) {
  // is this only for h2h? what about roto, and points?
  var matchups = _.filter(scoreboard, function(s) { return typeof(s) == 'object'; });
  matchups = _.map(matchups, function(m) { return m.matchup; });

  _.each(matchups, function(matchup) {
    // clean this up, but time...
    matchup.teams = [];

    var teams_data = matchup[0].teams;
    teams_data = _.filter(teams_data, function(t) { return typeof(t) == 'object'; });
    var teams = _.map(teams_data, function(t) { return t.team[0]; });
    teams = _.map(teams, function(t) {
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
        managers: _.map(t[13].managers, function(mgr) {
          return mgr.manager;
        })
      };
    }); // good, but ugly (codewise)...

    var scoring_data = _.map(teams_data, function(t) { return t.team[1]; });

    var team_points = _.map(scoring_data, function(s) { return s.team_points; });

    // y so ugly
    var team_stats = _.map(scoring_data, function(s) { return s.team_stats; });
    var stats = _.map(team_stats, function(s) { return s.stats });
    stats[0] = _.map(stats[0], function(stat) { return stat.stat; });
    stats[1] = _.map(stats[1], function(stat) { return stat.stat; });

    team_stats[0].stats = stats[0];
    team_stats[1].stats = stats[1];

    // remove ugly data;
    delete matchup[0];

    // gotta be a better way...
    matchup.teams.push({
      team: teams[0],
      team_points: team_points[0],
      team_stats: team_stats[0]
    });

    matchup.teams.push({
      team: teams[1],
      team_points: team_points[1],
      team_stats: team_stats[1]
    });
  });

  return {
    matchups: matchups,
    week: scoreboard.week
  };
};

// TODO: this map is re-used pretty much everywhere (to start, at least)
exports.transactionMap = function(transactions) {
  // count actually useful here...
  var count = transactions.count;

  debugger;

  var transactions = _.filter(transactions, function(t) { return typeof(t) == 'object'; });
  transactions = _.map(transactions, function(t) { return t.transaction; });

  transactions = _.map(transactions, function(t) {
    t[0].players = _.isEmpty(t[1]) ? [] : transactionHelper.mapTransactionPlayers(t[1].players);
    delete t[1];
    return t[0];
  });

  transactions.count = count;

  return transactions;
};
