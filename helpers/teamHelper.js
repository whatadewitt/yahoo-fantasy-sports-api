var _ = require('lodash');
var leagueHelper = require('./leagueHelper.js');
var playerHelper = require('./playerHelper.js');

// todo: use this where possible...
exports.mapTeam = function(t) {
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

exports.mapRoster = function(roster) {
  var players = roster[0].players;

  players = _.filter(players, function(p) { return typeof(p) === 'object'; });
  players = _.map(players, function(p) { return _.flatten(p.player); });
  players = _.map(players, function(p) { return playerHelper.mapPlayer(p); });

  return players;
};

exports.mapStats = function(stats) {
  stats.stats = _.map(stats.stats, function(s) { return s.stat; });

  return stats;
};

exports.mapDraft = function(draft) {
  draft = _.filter(draft, function(d) { return typeof(d) === 'object'; });
  draft = _.map(draft, function(d) { return d.draft_result; });
  draft = _.sortBy(draft, 'round');

  return draft;
};

exports.mapMatchups = function(matchups) {
  var self = this;

  matchups = _.filter(matchups, function(m) { return typeof(m) === 'object'; });
  matchups = _.map(matchups, function(m) { return m.matchup; });
  matchups = _.map(matchups, function(m) {
    var teams = _.filter(m[0].teams, function(t) { return typeof(t) === 'object'; });

    m.teams = _.map(teams, function(t) {
      var team = self.mapTeam(t.team[0]);

      team.points = t.team[1].team_points;
      team.stats = leagueHelper.mapStats(t.team[1].team_stats.stats);

      return team;
    });

    delete m[0];
    return m;
  });

  return matchups;
}

exports.parseCollection = function(teams, subresources) {
  var self = this;

  teams = _.filter(teams, function(t) { return typeof(t) === 'object'; });
  teams = _.map(teams, function(t) { return t.team; });
  teams = _.map(teams, function(t) {
    // this is only here because user games collection is adding an extra null
    // and I cannot for the life of me figure out why.
    _.remove(t, function(o) { return _.isNull(o); });

    var team = self.mapTeam(t[0]);

    _.forEach(subresources, function(resource, idx) {
      switch (resource) {
        case 'stats':
          team.stats = self.mapStats(t[idx + 1].team_stats);
          break;

        case 'standings':
          team.standings = t[idx + 1].team_standings;
          break;

        case 'roster':
          team.roster = self.mapRoster(t[idx + 1].roster);
          break;

        case 'draftresults':
          team.draftresults = self.mapDraft(t[idx + 1].draft_results);
          break;

        case 'matchups':
          team.matchups = self.mapMatchups(t[idx + 1].matchups);
          break;

        default:
          break;
      }
    });

    return team;
  });

  return teams;
};

exports.parseLeagueCollection = function(leagues, subresources) {
  var self = this;

  leagues = _.filter(leagues, function(l) { return typeof(l) === 'object'; });
  leagues = _.map(leagues, function(l) { return l.league; });
  leagues = _.map(leagues, function(l) {
    var league = l[0];
    league.teams = self.parseCollection(l[1].teams, subresources);

    return league;
  });

  return leagues;
};

exports.parseTeamCollection = function(teams, subresources) {
  var self = this;

  teams = _.filter(teams, function(t) { return typeof(t) === 'object'; });
  teams = _.map(teams, function(t) { return t.team; });
  teams = _.map(teams, function(t) {
    var team = teamHelper.mapTeam(t[0]);
    team.players = self.parseCollection(t[1].players, subresources);

    return team;
  });

  return teams;
};

exports.parseGameCollection = function(games, subresources) {
  var self = this;

  games = _.filter(games, function(g) { return typeof(g) === 'object'; });
  games = _.map(games, function(g) { return g.game; });
  games = _.map(games, function(g) {
    var game = g[0];
    game.teams = self.parseCollection(g[1].teams, subresources);

    return game;
  });

  return games;
};
