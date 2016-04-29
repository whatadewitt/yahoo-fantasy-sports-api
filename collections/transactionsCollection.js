var _ = require('lodash');

module.exports = TransactionsCollection;

function TransactionsCollection(yf) {
  this.yf = yf;
}

TransactionsCollection.prototype.fetch = function(transactionKeys, resources, filters, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/transactions;transaction_keys=',
    apiCallback = this._fetch_callback.bind(this, cb);

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

  url += '?format=json';

  this
    .yf
    .api(
      this.yf.GET,
      url,
      apiCallback
    );
};

TransactionsCollection.prototype._fetch_callback = function(cb, e, data) {
  if ( e ) return cb(e);
  
  var meta = data.fantasy_content;
  return cb(null, meta);
};

TransactionsCollection.prototype.leagueFetch = function(leagueKeys, resources, filters, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=',
    apiCallback = this._leagueFetch_callback.bind(this, cb);

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
  .api(
    this.yf.GET,
    url,
    apiCallback
  );
};

TransactionsCollection.prototype._leagueFetch_callback = function(cb, e, data) {
  if ( e ) return cb(e);
  
  var meta = data.fantasy_content;
  return cb(null, meta);
};

// todo: http://fantasysports.yahooapis.com/fantasy/v2/league/{league_key}/transactions;types=waiver,pending_trade;team_key={team_key}
