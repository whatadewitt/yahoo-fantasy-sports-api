var _ = require('lodash');
var teamHelper = require('../helpers/teamHelper.js');

module.exports = function() {
  return new TeamsCollection();
};

function TeamsCollection() {
  return this;
};

TeamsCollection.prototype.fetch = function() {
  var teamKeys = arguments[0],
    subresources = ( arguments.length > 2 ) ? arguments[1] : [],
    cb = arguments[arguments.length - 1];

  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/teams;team_keys=';

  if ( _.isString(teamKeys) ) {
    teamKeys = teamKeys.split(',');
  }

  url += teamKeys.join(',');

  if ( !( _.isEmpty(subresources) )  ) {
    if ( _.isString(subresources) ) {
      subresources = [subresources];
    }

    url += ';out=' + subresources.join(',');
  }

  url += '?format=json';

  this
  .api(url)
  .then(function(data) {
    var teams = teamHelper.parseCollection(data.fantasy_content.teams, subresources);

    cb(null, teams);
  }, function(e) {
    cb(e, null);
  });
};

TeamsCollection.prototype.leagues = function() {
  var leagueKeys = arguments[0],
    subresources = ( arguments.length > 2 ) ? arguments[1] : [],
    cb = arguments[arguments.length - 1];

  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=';

  if ( _.isString(leagueKeys) ) {
    leagueKeys = [leagueKeys];
  }

  url += leagueKeys.join(',');
  url += '/teams';

  if ( !( _.isEmpty(subresources) )  ) {
    if ( _.isString(subresources) ) {
      subresources = [subresources];
    }

    url += ';out=' + subresources.join(',');
  }

  url += '?format=json';

  this
  .api(url)
  .then(function(data) {
    var leagues = teamHelper.parseLeagueCollection(data.fantasy_content.leagues, subresources);

    cb(null, leagues);
  }, function(e) {
    cb(e, null);
  });
};

TeamsCollection.prototype.userFetch = function() {
  var subresources = ( arguments.length > 1 ) ? arguments[1] : [],
    cb = arguments[arguments.length - 1];

  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/teams';

  if ( !( _.isEmpty(subresources) )  ) {
    if ( _.isString(subresources) ) {
      subresources = [subresources];
    }

    url += ';out=' + subresources.join(',');
  }

  url += '?format=json';

  this
  .api(url)
  .then(function(data) {
    var games = teamHelper.parseGameCollection(data.fantasy_content.users[0].user[1].games, subresources);

    cb(null, games);
  }, function(e) {
    cb(e, null);
  });
};

TeamsCollection.prototype.games = function() {
  var gameKeys = arguments[0],
    subresources = ( arguments.length > 2 ) ? arguments[1] : [],
    cb = arguments[arguments.length - 1];

  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=';

  if ( _.isString(gameKeys) ) {
    gameKeys = [gameKeys];
  }

  url += gameKeys.join(',');
  url += '/teams';

  if ( !( _.isEmpty(subresources) )  ) {
    if ( _.isString(subresources) ) {
      subresources = [subresources];
    }

    url += ';out=' + subresources.join(',');
  }

  url += '?format=json';

  this
  .api(url)
  .then(function(data) {
    var games = teamHelper.parseGameCollection(data.fantasy_content.users[0].user[1].games, subresources);

    cb(null, games);
  }, function(e) {
    cb(e, null);
  });
};
