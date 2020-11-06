import { mapTransactionPlayers } from "../helpers/transactionHelper.mjs";

import { isEmpty } from "../helpers/isEmpty.mjs";

// TODO: https://fantasysports.yahooapis.com/fantasy/v2/league/{league_key}/transactions;types=waiver,pending_trade;team_key={team_key}
// TODO: fetch multiple front end
class TransactionsCollection {
  constructor(yf) {
    this.yf = yf;
  }

  fetch(transactionKeys, resources, filters, cb = () => {}) {
    let url =
      "https://fantasysports.yahooapis.com/fantasy/v2/transactions;transaction_keys=";

    if ("string" === typeof transactionKeys) {
      transactionKeys = [transactionKeys];
    }

    url += transactionKeys.join(",");

    if (!isEmpty(resources)) {
      if ("string" === typeof resources) {
        resources = [resources];
      }

      url += ";out=" + resources.join(",");
    }

    if (!isEmpty(filters)) {
      Object.keys(filters).forEach(function(key) {
        url += ";" + key + "=" + filters[key];
      });
    }

    return this.yf
      .api(this.yf.GET, url)
      .then((data) => {
        const meta = data.fantasy_content;
        cb(null, meta);
        return meta;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  // leagueFetch = function(leagueKeys, resources, filters, cb = () => {}) {
  //   let url =
  //     "https://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=";

  //   if ("string" === typeof leagueKeys) {
  //     leagueKeys = [leagueKeys];
  //   }

  //   url += leagueKeys.join(",");
  //   url += "/transactions";

  //   if (!isEmpty(resources)) {
  //     if ("string" === typeof resources) {
  //       resources = [resources];
  //     }

  //     url += ";out=" + resources.join(",");
  //   }

  //   if (!isEmpty(filters)) {
  //     Object.keys(filters).forEach(function(key) {
  //       url += ";" + key + "=" + filters[key];
  //     });
  //   }

  //   return this.yf
  //     .api(this.yf.GET, url)
  //     .then((meta) => {
  //       const meta = data.fantasy_content;

  //       cb(null, meta);
  //       return meta;
  //     })
  //     .catch((e) => {
  //       cb(e);
  //       throw e;
  //     });
  // };

  /**
  add_player = function(leagueKey, teamKey, playerKey, cb = () => {}) {
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/transactions`;

    const xmlData = ` \
      <fantasy_content> \
        <transaction> \
          <type>add</type> \
          <player> \
            <player_key>${playerKey}</player_key> \
            <transaction_data> \
              <type>add</type> \
              <destination_team_key>${teamKey}</destination_team_key> \
            </transaction_data> \
          </player> \
        </transaction> \
      </fantasy_content>`;

    return this.yf
      .api(this.yf.POST, url, xmlData)
      .then((data) => {
        const transactions = data.fantasy_content.league[1].transactions
          .filter((p) => typeof p === "object")
          .map(({ transaction }) => transaction);

        const transaction = transactions[0];
        const meta = transaction[0];
        const players = transactionHelper.mapTransactionPlayers(
          transaction[1].players
        );

        meta.players = players;
        cb(null, meta);
        return meta;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  };

  drop_player = function(leagueKey, teamKey, playerKey, cb = () => {}) {
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/transactions`;
    const xmlData = ` \
      <fantasy_content> \
        <transaction> \
          <type>drop</type> \
          <player> \
            <player_key>${playerKey}</player_key> \
            <transaction_data> \
              <type>drop</type> \
              <source_team_key>${teamKey}</source_team_key> \
            </transaction_data> \
          </player> \
        </transaction> \
      </fantasy_content>`;

    return this.yf
      .api(this.yf.POST, url, xmlData)
      .then((data) => {
        const transactions = data.fantasy_content.league[1].transactions
          .filter((p) => typeof p === "object")
          .map(({ transaction }) => transaction);

        const transaction = transactions[0];
        const meta = transaction[0];
        const players = transactionHelper.mapTransactionPlayers(
          transaction[1].players
        );
        meta.players = players;

        cb(null, meta);
        return meta;
      })
      .catch((e) => {
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
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/transactions`;
    const xmlData = ` \
      <fantasy_content> \
        <transaction> \
          <type>add/drop</type> \
          <players> \
            <player> \
              <player_key>${addPlayerKey}</player_key> \
              <transaction_data> \
                <type>add</type> \
                <destination_team_key>${teamKey}</destination_team_key> \
              </transaction_data> \
            </player> \
            <player> \
              <player_key>${dropPlayerKey}</player_key> \
              <transaction_data> \
                <type>drop</type> \
                <source_team_key>${teamKey}</source_team_key> \
              </transaction_data> \
            </player> \
          </players> \
        </transaction> \
      </fantasy_content>`;

    return this.yf
      .api(this.yf.POST, url, xmlData)
      .then((data) => {
        const transactions = data.fantasy_content.league[1].transactions
          .filter((p) => typeof p === "object")
          .map(({ transaction }) => transaction);
        const transaction = transactions[0];
        const meta = transaction[0];
        const players = transactionHelper.mapTransactionPlayers(
          transaction[1].players
        );
        meta.players = players;

        cb(null, meta);
        return meta;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  };
   */
}

export default TransactionsCollection;
