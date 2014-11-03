exports.meta = function(leagueKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + leagueKey + '/metadata?format=json')
    .then(function(data) {
      var meta = data.fantasy_content.league[1].draft_results;

      cb(meta);
    });
};

exports.settings = function(leagueKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + leagueKey + '/metadata?format=json')
    .then(function(data) {
      var settings = data.fantasy_content.league[1].settings;

      cb(settings);
    });
}

exports.standings = function(leagueKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + leagueKey + '/standings?format=json')
    .then(function(data) {
      var standings = self.helperTeamMap(data.fantasy_content.league[1].standings[0].teams);

      cb(standings);
    });
};


exports.scoreboard = function(leagueKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + leagueKey + '/scoreboard?format=json')
    .then(function(data) {
      var scoreboard = data.fantasy_content.league[1].scoreboard;

      cb(scoreboard);
    });
};

exports.teams = function(leagueKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + leagueKey + '/teams?format=json')
    .then(function(data) {
      var teams = self.helperTeamMap(data.fantasy_content.league[1].teams);

      cb(teams);
    });
};

exports.players = function(leagueKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + leagueKey + '/players?format=json')
    .then(function(data) {
      var players = data.fantasy_content.league[1].players;

      cb(players);
    });
};

exports.draft_results = function(leagueKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + leagueKey + '/draftresults?format=json')
    .then(function(data) {
      var draft = data.fantasy_content.league[1].draft_results;

      cb(draft);
    });
};

exports.transactions = function(leagueKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + leagueKey + '/transactions?format=json')
    .then(function(data) {
      var draft = data.fantasy_content.league[1].draft_results;

      cb(draft);
    });
};
