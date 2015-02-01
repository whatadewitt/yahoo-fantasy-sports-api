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

  url += '?format=json'

  this
  .api(url)
  .then(function(data) {
    var teams = teamHelper.parseCollection(data.fantasy_content.teams, subresources);

    cb(teams);
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

  url += '?format=json'

  this
  .api(url)
  .then(function(data) {
    var leagues = teamHelper.parseLeagueCollection(data.fantasy_content.leagues, subresources);

    cb(leagues);
  });
};

TeamsCollection.prototype.userFetch = function(resources, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/teams';

  if ( !( _.isEmpty(resources) )  ) {
    if ( _.isString(resources) ) {
      resources = [resources];
    }

    url += ';out=' + resources.join(',');
  }

  url += '?format=json'

  this
  .api(url)
  .then(function(data) {
    var meta = data.fantasy_content;

    cb(meta);
  });
};

TeamsCollection.prototype.games = function(gameKeys, resources, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=';

  if ( _.isString(gameKeys) ) {
    gameKeys = [gameKeys];
  }

  url += gameKeys.join(',');
  url += '/teams';

  if ( !( _.isEmpty(resources) )  ) {
    if ( _.isString(resources) ) {
      resources = [resources];
    }

    url += ';out=' + resources.join(',');
  }

  url += '?format=json'

  this
  .api(url)
  .then(function(data) {
    var meta = data.fantasy_content;

    cb(meta);
  });
};
