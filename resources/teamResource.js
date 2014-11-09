var teamHelper = require('../helpers/teamHelper.js');

exports.meta = function(teamKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/metadata?format=json')
    .then(function(data) {
      var metadata = teamHelper.teamMap(data.team[0]);

      return cb(metadata);
    });
};

exports.stats = function(teamKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/stats?format=json')
    .then(function(data) {
      var stats = teamHelper.statsMap(data.team[1]);
      var team = teamHelper.teamMap(data.team[0]);

      stats.team = team;

      cb(stats);
    });
};

exports.standings = function(teamKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/standings?format=json')
    .then(function(data) {
      var standings = data.team[1].team_standings;
      var team = teamHelper.teamMap(data.team[0]);

      standings.team = team;

      cb(standings);
    });
};

// todo: needs to be tested
exports.roster = function(teamKey, week, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/roster;weeks=' + weeks.split(',') + '?format=json')
    .then(function(data) {
      var roster = data.fantasy_content;

      cb(roster);
    });
};


exports.draft_results = function(teamKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/draftresults?format=json')
    .then(function(data) {
      var draft_results = teamHelper.draftMap(data.team[1].draft_results);
      var team = teamHelper.teamMap(data.team[0]);

      draft_results.team = team;

      cb(draft_results);
    });
};

// todo: this
exports.matchups = function(teamKey, weeks, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/matchups;weeks=' + weeks.split(',') + '?format=json')
    .then(function(data) {
      var matchups = data.fantasy_content;

      cb(matchups);
    });
};
