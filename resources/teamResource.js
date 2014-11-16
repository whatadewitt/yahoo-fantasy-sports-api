var teamHelper = require('../helpers/teamHelper.js');

exports.meta = function(teamKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/metadata?format=json')
    .then(function(data) {
      var metadata = teamHelper.mapTeam(data.fantasy_content.team[0]);

      cb(metadata);
    }, function(e) {
      self.err(e, cb);
    });
};

exports.stats = function(teamKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/stats?format=json')
    .then(function(data) {
      console.log(data);
      var stats = teamHelper.statsMap(data.fantasy_content.team[1]);
      var team = teamHelper.mapTeam(data.fantasy_content.team[0]);

      team.stats = stats;

      cb(team);
    }, function(e) {
      self.err(e, cb);
    });
};

exports.standings = function(teamKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/standings?format=json')
    .then(function(data) {
      var standings = data.fantasy_content.team[1].team_standings;
      var team = teamHelper.mapTeam(data.fantasy_content.team[0]);

      team.standings = standings;

      cb(team);
    }, function(e) {
      self.err(e, cb);
    });
};

// todo: needs to be tested
exports.roster = function(teamKey, cb) { // (teamKey, week, cb)
  var self = this;

  // 'http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/roster;weeks=' + weeks.split(',') + '?format=json'

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/roster?format=json')
    .then(function(data) {
      var team = teamHelper.mapTeam(data.fantasy_content.team[0]);
      var roster = teamHelper.mapRoster(data.fantasy_content.team[1].roster);

      team.roster = roster;
      console.log(team);

      cb(team);
    }, function(e) {
      self.err(e, cb);
    });
};


exports.draft_results = function(teamKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/draftresults?format=json')
    .then(function(data) {
      var draft_results = teamHelper.draftMap(data.fantasy_content.team[1].draft_results);
      var team = teamHelper.mapTeam(data.fantasy_content.team[0]);

      team.draft_results = draft_results;

      cb(team);
    }, function(e) {
      self.err(e, cb);
    });
};

// todo: this
exports.matchups = function(teamKey, weeks, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/matchups;weeks=' + weeks.split(',') + '?format=json')
    .then(function(data) {
      var matchups = data.fantasy_content;

      cb(matchups);
    }, function(e) {
      self.err(e, cb);
    });
};
