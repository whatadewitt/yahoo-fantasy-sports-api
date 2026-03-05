import { YahooFantasyInstance, Callback } from "../types/core";
import { Transaction } from "../types/api-responses";
import { extractCallback } from "../helpers/argsParser";
import { parseTransactionCollection } from "../helpers/transactionHelper";

class TransactionsCollection {
  constructor(private yf: YahooFantasyInstance) {}

  fetch(transactionKeys: string[]): Promise<any>;
  fetch(transactionKeys: string[], cb: Callback<any>): void;
  fetch(transactionKeys: string[], resources: string[]): Promise<any>;
  fetch(
    transactionKeys: string[],
    resources: string[],
    cb: Callback<any>
  ): void;
  fetch(
    transactionKeys: string[],
    resources: string[],
    filters: any
  ): Promise<any>;
  fetch(
    transactionKeys: string[],
    resources: string[],
    filters: any,
    cb: Callback<any>
  ): void;
  fetch(...args: any[]): Promise<any> | void {
    const cb = extractCallback(args);
    let transactionKeys = args.shift();
    let resources = args.length ? args.shift() : [];
    let filters = args.length ? args.shift() : {};

    if (typeof transactionKeys === "string") {
      transactionKeys = [transactionKeys];
    }

    let url = `https://fantasysports.yahooapis.com/fantasy/v2/transactions;transaction_keys=${transactionKeys.join(
      ","
    )}`;

    if (resources && resources.length) {
      if (typeof resources === "string") {
        resources = [resources];
      }
      url += `;out=${resources.join(",")}`;
    }

    if (filters && Object.keys(filters).length) {
      Object.keys(filters).forEach((key) => {
        url += `;${key}=${filters[key]}`;
      });
    }

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;

    const resultPromise = promise.then((data) => {
      const transactionsData = data.fantasy_content.transactions;

      if (!transactionsData) {
        return [];
      }

      return parseTransactionCollection(transactionsData);
    });

    if (cb) {
      resultPromise.then((transactions) => cb(null, transactions)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
  }

  leagues(leagueKeys: string | string[]): Promise<Transaction[]>;
  leagues(leagueKeys: string | string[], cb: Callback<Transaction[]>): void;
  leagues(leagueKeys: string | string[], filters: any): Promise<Transaction[]>;
  leagues(
    leagueKeys: string | string[],
    filters: any,
    cb: Callback<Transaction[]>
  ): void;
  leagues(...args: any[]): Promise<Transaction[]> | void {
    const cb = extractCallback(args);
    let leagueKeys = args.shift();
    let filters = args.length ? args.shift() : {};

    // Handle single league key
    if (!Array.isArray(leagueKeys)) {
      leagueKeys = [leagueKeys];
    }

    let url = `https://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=${leagueKeys.join(
      ","
    )}/transactions`;

    // Add filters to the URL
    if (filters && Object.keys(filters).length) {
      const filterParams: string[] = [];

      // Handle types filter (can be array or string)
      if (filters.types) {
        const types = Array.isArray(filters.types)
          ? filters.types
          : [filters.types];
        filterParams.push(`types=${types.join(",")}`);
      }

      // Handle team_key filter
      if (filters.team_key) {
        filterParams.push(`team_key=${filters.team_key}`);
      }

      // Handle pagination
      if (filters.count) {
        filterParams.push(`count=${filters.count}`);
      }

      if (filters.start) {
        filterParams.push(`start=${filters.start}`);
      }

      if (filterParams.length) {
        url += `;${filterParams.join(";")}`;
      }
    }

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;

    const resultPromise = promise.then((data) => {
      const leagues = data.fantasy_content.leagues;

      if (!leagues || leagues.count === 0) {
        return [];
      }

      const allTransactions: any[] = [];

      for (let i = 0; i < leagues.count; i++) {
        const league = leagues[i];
        if (
          league &&
          league.league &&
          league.league[1] &&
          league.league[1].transactions
        ) {
          const transactionsData = league.league[1].transactions;
          const transactions = parseTransactionCollection(transactionsData);
          allTransactions.push(...transactions);
        }
      }

      return allTransactions;
    });

    if (cb) {
      resultPromise.then((transactions) => cb(null, transactions)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
  }

  // TODO: Add/Drop player methods (commented out until ready)
  /*
  add_player(leagueKey: string, teamKey: string, playerKey: string): Promise<Transaction>;
  add_player(leagueKey: string, teamKey: string, playerKey: string, cb: Callback<Transaction>): void;
  add_player(leagueKey: string, teamKey: string, playerKey: string, cb?: Callback<Transaction>): Promise<Transaction> | void {
    // Implementation for adding a player
  }

  drop_player(leagueKey: string, teamKey: string, playerKey: string): Promise<Transaction>;
  drop_player(leagueKey: string, teamKey: string, playerKey: string, cb: Callback<Transaction>): void;
  drop_player(leagueKey: string, teamKey: string, playerKey: string, cb?: Callback<Transaction>): Promise<Transaction> | void {
    // Implementation for dropping a player
  }

  add_drop(leagueKey: string, teamKey: string, addPlayerKey: string, dropPlayerKey: string): Promise<Transaction>;
  add_drop(leagueKey: string, teamKey: string, addPlayerKey: string, dropPlayerKey: string, cb: Callback<Transaction>): void;
  add_drop(leagueKey: string, teamKey: string, addPlayerKey: string, dropPlayerKey: string, cb?: Callback<Transaction>): Promise<Transaction> | void {
    // Implementation for add/drop transaction
  }
  */
}

export default TransactionsCollection;
