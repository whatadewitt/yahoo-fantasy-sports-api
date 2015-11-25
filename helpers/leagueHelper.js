var _ = require('lodash');
var transactionHelper = require('./transactionHelper.js');
var teamHelper = require('./teamHelper.js');

/*
 * Helper function to map data to a "team"
 */
exports.mapTeams = function(teams) {
  teams = _.filter(teams, function(t) { return typeof(t) === 'object'; });
  teams = _.map(teams, function(t) { return teamHelper.mapTeam(t.team[0]); });
  return teams;
};

exports.mapStandings = function(teams) {
  teams = _.filter(teams, function(t) { return typeof(t) === 'object'; });
  teams = _.map(teams, function(t) {
    var team = teamHelper.mapTeam(t.team[0]);
    team.standings = t.team[2].team_standings;
    return team;
  });

  return teams;
}

exports.mapSettings = function(settings) {
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

exports.mapDraft = function(draft) {
  draft = _.filter(draft, function(d) { return typeof(d) === 'object'; });
  draft = _.map(draft, function(d) { return d.draft_result; })

  return draft;
};

exports.mapScoreboard = function(scoreboard) {
  var self = this;
  // is this only for h2h? what about roto, and points?
  var matchups = _.filter(scoreboard, function(s) { return typeof(s) === 'object'; });
  matchups = _.map(matchups, function(m) { return m.matchup; });

  _.each(matchups, function(matchup) {
    var teams = matchup[0].teams;
    teams = _.filter(teams, function(t) { return typeof(t) === 'object'; });
    teams = _.map(teams, function(t) {
      var team = teamHelper.mapTeam(t.team[0]);

      team.points = t.team[1].team_points;
      team.stats = self.mapStats(t.team[1].team_stats.stats);

      return team;
    });

    // remove ugly data;
    delete matchup[0];
    matchup.teams = teams;
  });

  return {
    matchups: matchups,
    week: scoreboard.week
  };
};

exports.mapTransactions = function(transactions) {
  var transactions = _.filter(transactions, function(t) { return typeof(t) === 'object'; });
  transactions = _.map(transactions, function(t) { return t.transaction; });

  transactions = _.map(transactions, function(t) {
    t[0].players = _.isEmpty(t[1]) ? [] : transactionHelper.mapTransactionPlayers(t[1].players);
    delete t[1];
    return t[0];
  });

  return transactions;
};

exports.mapStats = function(stats) {
  stats = _.filter(stats, function(s) { return typeof(s) === 'object'; });
  stats = _.map(stats, function(s) { return s.stat; });

  return stats;
};

exports.parseCollection = function(leagues, subresources) {
  var self = this;

  leagues = _.filter(leagues, function(l) { return typeof(l) === 'object'; });
  leagues = _.map(leagues, function(l) { return l.league; });
  leagues = _.map(leagues, function(l) {
    var league = l[0];

    _.forEach(subresources, function(resource, idx) {
      switch (resource) {
        case 'settings':
          league.settings = self.mapSettings(l[idx + 1].settings[0]);
          break;

        case 'standings':
          league.standings = self.mapStandings(l[idx + 1].standings[0].teams);
          break;

        case 'scoreboard':
          league.scoreboard = self.mapScoreboard(l[idx + 1].scoreboard[0].matchups);
          break;

        case 'teams':
          league.teams = self.mapTeams(l[idx + 1].teams);
          break;

        case 'draftresults':
          league.draftresults = self.mapDraft(l[idx + 1].draft_results);
          break;

        case 'transactions':
          league.transactions = self.mapTransactions(l[idx + 1].transactions);
          break;

        default:
          break;
      }
    });

    return league;
  });

  return leagues;
};
