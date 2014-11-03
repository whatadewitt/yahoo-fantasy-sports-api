var _ = require('lodash');

exports.fetch = function(transactionKeys, resources, filters, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/transactions;transaction_keys='

  if ( _.isString(transactionKeys) ) {
    transactionKeys = [transactionKeys];
  }

  url += transactionKeys.join(',');

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

exports.leagueFetch = function(leagueKeys, resources, filters, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys='

  if ( _.isString(leagueKeys) ) {
    leagueKeys = [leagueKeys];
  }

  url += leagueKeys.join(',');
  url += '/transactions';

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
