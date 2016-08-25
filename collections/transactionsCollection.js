var _ = require('lodash');
var transactionHelper = require('../helpers/transactionHelper.js');

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
  .yf
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

TransactionsCollection.prototype.add_player = function(leagueKey, teamKey, playerKey, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/league/' + leagueKey + '/transactions?format=json';
  var apiCallback = this._add_player_callback.bind(this, cb);
  var xmlData = ' \
    <fantasy_content> \
      <transaction> \
        <type>add</type> \
        <player> \
          <player_key>' + playerKey + '</player_key> \
          <transaction_data> \
            <type>add</type> \
            <destination_team_key>' + teamKey + '</destination_team_key> \
          </transaction_data> \
        </player> \
      </transaction> \
    </fantasy_content>';

  this
    .yf
    .api(
      this.yf.POST,
      url,
      xmlData,
      apiCallback
    );
};

TransactionsCollection.prototype._add_player_callback = function(cb, e, data) {
  if ( e ) return cb(e);

  var transactions = data.fantasy_content.league[1].transactions;
  transactions = _.filter(transactions, function(p) { return typeof(p) === 'object'; });
  transactions = _.map(transactions, function(p) { return p.transaction; });
  var transaction = transactions[0];
  var meta = transaction[0];
  var players = transactionHelper.mapTransactionPlayers(transaction[1].players);
  meta.players = players;

  return cb(null, meta);
};

TransactionsCollection.prototype.drop_player = function(leagueKey, teamKey, playerKey, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/league/' + leagueKey + '/transactions?format=json';
  var apiCallback = this._drop_player_callback.bind(this, cb);
  var xmlData = ' \
    <fantasy_content> \
      <transaction> \
        <type>drop</type> \
        <player> \
          <player_key>' + playerKey + '</player_key> \
          <transaction_data> \
            <type>drop</type> \
            <source_team_key>' + teamKey + '</source_team_key> \
          </transaction_data> \
        </player> \
      </transaction> \
    </fantasy_content>';

  this
    .yf
    .api(
      this.yf.POST,
      url,
      xmlData,
      apiCallback
    );
};

TransactionsCollection.prototype._drop_player_callback = function(cb, e, data) {
  if ( e ) return cb(e);

  var transactions = data.fantasy_content.league[1].transactions;
  transactions = _.filter(transactions, function(p) { return typeof(p) === 'object'; });
  transactions = _.map(transactions, function(p) { return p.transaction; });
  var transaction = transactions[0];
  var meta = transaction[0];
  var players = transactionHelper.mapTransactionPlayers(transaction[1].players);
  meta.players = players;

  return cb(null, meta);
};

TransactionsCollection.prototype.adddrop_players = function(leagueKey, teamKey, addPlayerKey, dropPlayerKey, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/league/' + leagueKey + '/transactions?format=json';
  var apiCallback = this._adddrop_players_callback.bind(this, cb);
  var xmlData = ' \
    <fantasy_content> \
      <transaction> \
        <type>add/drop</type> \
        <players> \
          <player> \
            <player_key>' + addPlayerKey + '</player_key> \
            <transaction_data> \
              <type>add</type> \
              <destination_team_key>' + teamKey + '</destination_team_key> \
            </transaction_data> \
          </player> \
          <player> \
            <player_key>' + dropPlayerKey + '</player_key> \
            <transaction_data> \
              <type>drop</type> \
              <source_team_key>' + teamKey + '</source_team_key> \
            </transaction_data> \
          </player> \
        </players> \
      </transaction> \
    </fantasy_content>';

  this
    .yf
    .api(
      this.yf.POST,
      url,
      xmlData,
      apiCallback
    );
};

TransactionsCollection.prototype._adddrop_players_callback = function(cb, e, data) {
  if ( e ) return cb(e);

  var transactions = data.fantasy_content.league[1].transactions;
  transactions = _.filter(transactions, function(p) { return typeof(p) === 'object'; });
  transactions = _.map(transactions, function(p) { return p.transaction; });
  var transaction = transactions[0];
  var meta = transaction[0];
  var players = transactionHelper.mapTransactionPlayers(transaction[1].players);
  meta.players = players;

  return cb(null, meta);
};
