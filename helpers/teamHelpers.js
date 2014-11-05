var _ = require('_');

/*
 * Helper function to map data to a "team"
 */
exports.teamMap = function(teams) {
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
      return s.stat;
    });

  settings.roster_positions = _.map(
    settings.roster_positions,
    function(p) {
      return p.roster_positions;
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

  var transactions = _.filter(transactions, function(t) { return typeof(t) == 'object'; });
  transactions = _.map(transactions, function(t) { return t.transaction; });

  var transactionPlayerHelper = function(data) {
    var players = _.filter(data, function(t) { return typeof(t) == 'object'; });
    players = _.map(players, function(p) { return p.player; });
    players = _.map(players, function(p) {
      return {
        player_key: p[0][0].player_key,
        player_id: p[0][1].player_id,
        name: p[0][2].name,
        editorial_team_abbr: p[0][3].editorial_team_abbr,
        display_position: p[0][4].display_position,
        position_type: p[0][5].position_type,
        transaction_data: p[1].transaction_data[0]
      }
    });

    return players;
  };

  transactions = _.map(transactions, function(t) {
    t.players = _.isEmpty(t[1]) ? [] : transactionPlayerHelper(t[1].players);
    return t;
  });

  return transactions;
};
