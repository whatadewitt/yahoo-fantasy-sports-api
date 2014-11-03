exports.meta = function(teamKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/metadata?format=json')
    .then(function(data) {
      var metadata = data.fantasy_content;

      return cb(metadata);
    });
};

exports.stats = function(teamKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/stats?format=json')
    .then(function(data) {
      var stats = data.fantasy_content;

      cb(stats);
    });
};

exports.standings = function(teamKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/standings?format=json')
    .then(function(data) {
      var standings = data.fantasy_content;

      cb(standings);
    });
};

exports.roster = function(teamKey, week, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/roster;weeks?format=json')
    .then(function(data) {
      var roster = data.fantasy_content;

      cb(roster);
    });
};

exports.draft_results = function(teamKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/draftresults?format=json')
    .then(function(data) {
      var draft_results = data.fantasy_content;

      cb(draft_results);
    });
};

exports.matchups = function(teamKey, weeks, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/matchups;weeks=' + weeks.split(',') + '?format=json')
    .then(function(data) {
      var matchups = data.fantasy_content;

      cb(matchups);
    });
};
