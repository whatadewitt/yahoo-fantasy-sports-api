var _ = require('lodash');

module.exports = function() {
  return new TransactionsCollection();
};

function TransactionsCollection() {
  return this;
};

TransactionsCollection.prototype.fetch = function(transactionKeys, resources, filters, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/transactions;transaction_keys=';

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
  .api(url, 'GET', null)
  .then(function(data) {
    var meta = data.fantasy_content;

    cb(meta);
  });
};

TransactionsCollection.prototype.leagueFetch = function(leagueKeys, resources, filters, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=';

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
  .api(url, 'GET', null)
  .then(function(data) {
    var meta = data.fantasy_content;

    cb(meta);
  });
};

// todo: http://fantasysports.yahooapis.com/fantasy/v2/league/{league_key}/transactions;types=waiver,pending_trade;team_key={team_key}

TransactionsCollection.prototype.add_player = function(leagueKey, teamKey, playerKey, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/league/' + leagueKey + '/transactions?format=json';
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
    .api(url, 'POST', xmlData)
    .then(function(data) {
      var meta = data.fantasy_content;

      cb(null, meta);
    }, function(e) {
      cb(e, null);
    });
};

TransactionsCollection.prototype.drop_player = function(leagueKey, teamKey, playerKey, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/league/' + leagueKey + '/transactions?format=json';
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
    .api(url, 'POST', xmlData)
    .then(function(data) {
      var meta = data.fantasy_content;

      cb(null, meta);
    }, function(e) {
      cb(e, null);
    });
};

TransactionsCollection.prototype.adddrop_players = function(leagueKey, teamKey, addPlayerKey, dropPlayerKey, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/league/' + leagueKey + '/transactions?format=json';
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
    .api(url, 'POST', xmlData)
    .then(function(data) {
      var meta = data.fantasy_content;

      cb(null, meta);
    }, function(e) {
      cb(e, null);
    });
};
