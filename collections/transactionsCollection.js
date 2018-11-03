var transactionHelper = require("../helpers/transactionHelper.js");

// TODO: https://fantasysports.yahooapis.com/fantasy/v2/league/{league_key}/transactions;types=waiver,pending_trade;team_key={team_key}
// TODO: fetch multiple front end
class TransactionsCollection {
  constructor(yf) {
    this.yf = yf;
  }

  fetch(transactionKeys, resources, filters, cb = () => {}) {
    var url =
        "https://fantasysports.yahooapis.com/fantasy/v2/transactions;transaction_keys=";

    if (_.isString(transactionKeys)) {
      transactionKeys = [transactionKeys];
    }

    url += transactionKeys.join(",");

    if (!_.isEmpty(resources)) {
      if (_.isString(resources)) {
        resources = [resources];
      }

      url += ";out=" + resources.join(",");
    }

    if (!_.isEmpty(filters)) {
      _.each(Object.keys(filters), function(key) {
        url += ";" + key + "=" + filters[key];
      });
    }

    url += "?format=json";

    return this.yf.api(this.yf.GET, url)
      .then(data => {
        const meta = data.fantasy_content;
        cb(null, meta); 
        return meta; 
      })
      .catch(e => { 
        cb(e);
        throw e;
      });
  }

  leagueFetch = function(leagueKeys, resources, filters, cb = () => {}) {
    var url =
        "https://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=";

    if (_.isString(leagueKeys)) {
      leagueKeys = [leagueKeys];
    }

    url += leagueKeys.join(",");
    url += "/transactions";

    if (!_.isEmpty(resources)) {
      if (_.isString(resources)) {
        resources = [resources];
      }

      url += ";out=" + resources.join(",");
    }

    if (!_.isEmpty(filters)) {
      _.each(Object.keys(filters), function(key) {
        url += ";" + key + "=" + filters[key];
      });
    }

    url += "?format=json";

    return this.yf.api(this.yf.GET, url)
      .then(meta => {
        const meta = data.fantasy_content;
        cb(null, meta); 
        return meta; 
      })
      .catch(e => { 
        cb(e);
        throw e;
      });
  };

  add_player = function(leagueKey, teamKey, playerKey, cb = () => {}) {
    var url =
      "https://fantasysports.yahooapis.com/fantasy/v2/league/" +
      leagueKey +
      "/transactions?format=json";
    var xmlData =
      " \
      <fantasy_content> \
        <transaction> \
          <type>add</type> \
          <player> \
            <player_key>" +
      playerKey +
      "</player_key> \
            <transaction_data> \
              <type>add</type> \
              <destination_team_key>" +
      teamKey +
      "</destination_team_key> \
            </transaction_data> \
          </player> \
        </transaction> \
      </fantasy_content>";

    return this.yf.api(this.yf.POST, url, xmlData)
      .then(data => {
        var transactions = data.fantasy_content.league[1].transactions;
        transactions = _.filter(transactions, function(p) {
          return typeof p === "object";
        });
        transactions = _.map(transactions, function(p) {
          return p.transaction;
        });
        var transaction = transactions[0];
        var meta = transaction[0];
        var players = transactionHelper.mapTransactionPlayers(
          transaction[1].players
        );
        meta.players = players;
        cb(null, meta);
        return meta;
      })
      .catch(e => { 
        cb(e);
        throw e;
      });
  };

  drop_player = function(leagueKey, teamKey, playerKey, cb = () => {}) {
    var url =
      "https://fantasysports.yahooapis.com/fantasy/v2/league/" +
      leagueKey +
      "/transactions?format=json";
    var xmlData =
      " \
      <fantasy_content> \
        <transaction> \
          <type>drop</type> \
          <player> \
            <player_key>" +
      playerKey +
      "</player_key> \
            <transaction_data> \
              <type>drop</type> \
              <source_team_key>" +
      teamKey +
      "</source_team_key> \
            </transaction_data> \
          </player> \
        </transaction> \
      </fantasy_content>";

    return this.yf.api(this.yf.POST, url, xmlData)
      .then(data => {
        var transactions = data.fantasy_content.league[1].transactions;
        transactions = _.filter(transactions, function(p) {
          return typeof p === "object";
        });
        transactions = _.map(transactions, function(p) {
          return p.transaction;
        });
        var transaction = transactions[0];
        var meta = transaction[0];
        var players = transactionHelper.mapTransactionPlayers(
          transaction[1].players
        );
        meta.players = players;

        cb(null, meta);
        return meta;
      })
      .catch(e => {
        cb(e);
        throw e;
      });
  };

  adddrop_players = function(
    leagueKey,
    teamKey,
    addPlayerKey,
    dropPlayerKey,
    cb = () => {}
  ) {
    var url =
      "https://fantasysports.yahooapis.com/fantasy/v2/league/" +
      leagueKey +
      "/transactions?format=json";
    var xmlData =
      " \
      <fantasy_content> \
        <transaction> \
          <type>add/drop</type> \
          <players> \
            <player> \
              <player_key>" +
      addPlayerKey +
      "</player_key> \
              <transaction_data> \
                <type>add</type> \
                <destination_team_key>" +
      teamKey +
      "</destination_team_key> \
              </transaction_data> \
            </player> \
            <player> \
              <player_key>" +
      dropPlayerKey +
      "</player_key> \
              <transaction_data> \
                <type>drop</type> \
                <source_team_key>" +
      teamKey +
      "</source_team_key> \
              </transaction_data> \
            </player> \
          </players> \
        </transaction> \
      </fantasy_content>";

    return this.yf.api(this.yf.POST, url, xmlData)
      .then(data => {
        var transactions = data.fantasy_content.league[1].transactions;
        transactions = _.filter(transactions, function(p) {
          return typeof p === "object";
        });
        transactions = _.map(transactions, function(p) {
          return p.transaction;
        });
        var transaction = transactions[0];
        var meta = transaction[0];
        var players = transactionHelper.mapTransactionPlayers(
          transaction[1].players
        );
        meta.players = players;

        cb(null, meta);
        return meta;
      })
      .catch(e => {
        cb(e);
        throw e;
      });
  };
}

export default TransactionsCollection;
