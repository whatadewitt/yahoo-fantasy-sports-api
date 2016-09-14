var _ = require('lodash');
var leagueHelper = require('./leagueHelper.js');
var playerHelper = require('./playerHelper.js');

// todo: use this where possible...
exports.mapTeam = function(t) {
  // todo: mergeObjects is shared...
  // todo: the combination of numbers and strings here is confusing...
  var mergeObjects = function(arrayOfObjects) {
    var destinationObj = {};
    var key;

    if(arrayOfObjects){
      _.forEach(arrayOfObjects, function(obj) {
        _.forEach(_.keys(obj), function(key) {
          if ( !_.isUndefined(key) ) {
            destinationObj[key] = obj[key];
          }
        });
      });
    }
    
    return destinationObj;
  };
  
  var team = mergeObjects(t);
  
  // clean up team_logos
  team.team_logos = _.map(team.team_logos, function(logo) {
    return logo.team_logo;
  });

  // clean up managers
  team.managers = _.map(team.managers, function(m) {
    return m.manager;
  });

  return team;
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
    // grades seem to be football specific...
    // todo: shared with league helper...
    if ( m.matchup_grades ) {
      m.matchup_grades = _.map(m.matchup_grades, function(grade) {
        return {
          team_key: grade.matchup_grade.team_key,
          grade: grade.matchup_grade.grade
        }
      });
    }

    var teams = _.filter(m[0].teams, function(t) { return typeof(t) === 'object'; });

    m.teams = _.map(teams, function(t) {
      var team = self.mapTeam(t.team[0]);
      team = self.mapTeamPoints(team, t.team[1]);

      return team;
    });

    delete m[0];
    return m;
  });

  return matchups;
};

exports.mapTeamPoints = function(team, points) {
  team.points = points.team_points;

  if ( points.team_stats ) {
    team.stats = self.mapStats(points.team_stats.stats);
  }

  if ( points.team_projected_points ) {
    team.projected_points = points.team_projected_points;
  }

  return team;
};

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
