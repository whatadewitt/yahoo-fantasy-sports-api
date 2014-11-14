var leagueHelper = require('../helpers/leagueHelper.js');

exports.meta = function(leagueKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + leagueKey + '/metadata?format=json')
    .then(function(data) {
      var meta = data.fantasy_content.league[0];

      cb(meta);
    });
};

exports.settings = function(leagueKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + leagueKey + '/settings?format=json')
    .then(function(data) {
      var settings = leagueHelper.settingsMap(data.fantasy_content.league[1].settings[0]);
      var league = data.fantasy_content.league[0];

      settings.league = league;

      cb(settings);
    });
}

exports.standings = function(leagueKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + leagueKey + '/standings?format=json')
    .then(function(data) {
      var standings = leagueHelper.teamsMap(data.fantasy_content.league[1].standings[0].teams);
      var league = data.fantasy_content.league[0];

      league.standings = standings;

      cb(league);
    });
};


exports.scoreboard = function(leagueKey, cb) {
  // h2h only?
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + leagueKey + '/scoreboard?format=json')
    .then(function(data) {
      var week = data.fantasy_content.league[1].scoreboard.week;
      var scoreboard = leagueHelper.scoreboardMap(data.fantasy_content.league[1].scoreboard[0].matchups);
      var league = data.fantasy_content.league[0];

      scoreboard.week = week;
      scoreboard.league = league;

      // make sense to bring back 1 scoreboard, with all the matchups?
      // could mess up the consolation thing

      // scoreboard
        // matchups[]
          // teams[]
          // ??? -- seems better

      cb(scoreboard);
    });
};

exports.teams = function(leagueKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + leagueKey + '/teams?format=json')
    .then(function(data) {
      var teams = leagueHelper.teamsMap(data.fantasy_content.league[1].teams);
      var league = data.fantasy_content.league[0];

      league.teams = teams;

      cb(league);
    });
};

// not quite sure how to wrap this yet...
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
      var draft = leagueHelper.draftMap(data.fantasy_content.league[1].draft_results);
      var league = data.fantasy_content.league[0];

      league.draft_results = draft;

      cb(league);
    });
};

exports.transactions = function(leagueKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + leagueKey + '/transactions?format=json')
    .then(function(data) {
      var transactions = leagueHelper.transactionMap(data.fantasy_content.league[1].transactions);
      var league = data.fantasy_content.league[0];

      league.transactions = transactions;

      cb(league);
    });
};
