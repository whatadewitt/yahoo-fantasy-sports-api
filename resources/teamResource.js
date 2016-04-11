var teamHelper = require('../helpers/teamHelper.js');

module.exports = function() {
  return new TeamResource();
};

function TeamResource() {
  return this;
};

TeamResource.prototype.meta = function(teamKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/metadata?format=json')
    .then(function(data) {
      var metadata = teamHelper.mapTeam(data.fantasy_content.team[0]);

      cb(null, metadata);
    }, function(e) {
      // self.err(e, cb);
      cb(e, null);
    });
};

TeamResource.prototype.stats = function(teamKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/stats?format=json')
    .then(function(data) {
      var stats = teamHelper.mapStats(data.fantasy_content.team[1]);
      var team = teamHelper.mapTeam(data.fantasy_content.team[0]);

      team.stats = stats;

      cb(null, team);
    }, function(e) {
      // self.err(e, cb);
      cb(e, null);
    });
};

TeamResource.prototype.standings = function(teamKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/standings?format=json')
    .then(function(data) {
      var standings = data.fantasy_content.team[1].team_standings;
      var team = teamHelper.mapTeam(data.fantasy_content.team[0]);

      team.standings = standings;

      cb(null, team);
    }, function(e) {
      // self.err(e, cb);
      cb(e, null);
    });
};

// todo: needs to be tested
TeamResource.prototype.roster = function(teamKey, cb) { // (teamKey, week, cb)
  var self = this;

  // 'http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/roster;weeks=' + weeks.split(',') + '?format=json'

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/roster?format=json')
    .then(function(data) {
      var team = teamHelper.mapTeam(data.fantasy_content.team[0]);
      var roster = teamHelper.mapRoster(data.fantasy_content.team[1].roster);

      team.roster = roster;

      cb(null, team);
    }, function(e) {
      // self.err(e, cb);
      cb(e, null);
    });
};


TeamResource.prototype.draft_results = function(teamKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/draftresults?format=json')
    .then(function(data) {
      var draft_results = teamHelper.mapDraft(data.fantasy_content.team[1].draft_results);
      var team = teamHelper.mapTeam(data.fantasy_content.team[0]);

      team.draft_results = draft_results;

      cb(null, team);
    }, function(e) {
      // self.err(e, cb);
      cb(e, null);
    });
};

// h2h leagues only
// todo: add weeks param
TeamResource.prototype.matchups = function(teamKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/matchups?format=json')
    .then(function(data) {
      var matchups = teamHelper.mapMatchups(data.fantasy_content.team[1].matchups);
      var team = teamHelper.mapTeam(data.fantasy_content.team[0]);

      team.matchups = matchups;

      cb(null, team);
    }, function(e) {
      // self.err(e, cb);
      cb(e, null);
    });
};
