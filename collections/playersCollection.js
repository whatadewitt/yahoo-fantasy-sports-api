var _ = require('lodash');

exports.fetch = function(playerKeys, resources, filters, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/players;player_keys='

  if ( _.isString(playerKeys) ) {
    playerKeys = [playerKeys];
  }

  url += playerKeys.join(',');

  if ( !( _.isEmpty(resources) )  ) {
    if ( _.isString(resources) ) {
      resources = [resources];
    }

    url += ';out=' + resources.join(',');
  }

  if ( !( _.isEmpty(filters) )  ) {
    _.each(Object.keys(filters), function(key) {
      url += ';' + key + '=' + filters[key];
    });
  }

  url += '?format=json'

  this
  .api(url)
  .then(function(data) {
    var meta = data.fantasy_content;

    cb(meta);
  });
};

// ignoring the single b/c filters
exports.leagueFetch = function(leagueKeys, resources, filters, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys='

  if ( _.isString(leagueKeys) ) {
    leagueKeys = [leagueKeys];
  }

  url += leagueKeys.join(',');
  url += '/players';

  if ( !( _.isEmpty(resources) )  ) {
    if ( _.isString(resources) ) {
      resources = [resources];
    }

    url += ';out=' + resources.join(',');
  }

  if ( !( _.isEmpty(filters) )  ) {
    _.each(Object.keys(filters), function(key) {
      url += ';' + key + '=' + filters[key];
    });
  }

  url += '?format=json';

  this
  .api(url)
  .then(function(data) {
    var meta = data.fantasy_content;

    cb(meta);
  });
};

exports.teamFetch = function(teamKeys, resources, filters, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/teams;team_keys='

  if ( _.isString(teamKeys) ) {
    teamKeys = [teamKeys];
  }

  url += teamKeys.join(',');
  url += '/players';

  if ( !( _.isEmpty(resources) )  ) {
    if ( _.isString(resources) ) {
      resources = [resources];
    }

    url += ';out=' + resources.join(',');
  }

  if ( !( _.isEmpty(filters) )  ) {
    _.each(Object.keys(filters), function(key) {
      url += ';' + key + '=' + filters[key];
    });
  }

  url += '?format=json';

  this
  .api(url)
  .then(function(data) {
    var meta = data.fantasy_content;

    cb(meta);
  });
};
