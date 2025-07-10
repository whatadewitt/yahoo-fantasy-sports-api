import { YahooFantasyInstance, Callback } from '../types/core';
import { Transaction } from '../types/api-responses';
import { parseCollection } from '../helpers/gameHelper';

class TransactionsCollection {
  constructor(private yf: YahooFantasyInstance) {}

  fetch(transactionKeys: string[]): Promise<Transaction[]>;
  fetch(transactionKeys: string[], cb: Callback<Transaction[]>): void;
  fetch(transactionKeys: string[], cb?: Callback<Transaction[]>): Promise<Transaction[]> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/transactions;transaction_keys=${transactionKeys.join(',')}`
    ) as Promise<any>;

    const resultPromise = promise.then(data => parseCollection(data.fantasy_content.transactions));

    if (cb) {
      resultPromise.then(transactions => cb(null, transactions)).catch(e => cb(e));
      return;
    }
    return resultPromise;
  }

  league(leagueKey: string): Promise<Transaction[]>;
  league(leagueKey: string, cb: Callback<Transaction[]>): void;
  league(leagueKey: string, cb?: Callback<Transaction[]>): Promise<Transaction[]> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/transactions`
    ) as Promise<any>;

    const resultPromise = promise.then(data => parseCollection(data.fantasy_content.league[1].transactions));

    if (cb) {
      resultPromise.then(transactions => cb(null, transactions)).catch(e => cb(e));
      return;
    }
    return resultPromise;
  }

  // TODO: Add/Drop player methods (commented out until ready)
  /*
  add_player(teamKey: string, playerKey: string): Promise<Transaction>;
  add_player(teamKey: string, playerKey: string, cb: Callback<Transaction>): void;
  add_player(teamKey: string, playerKey: string, cb?: Callback<Transaction>): Promise<Transaction> | void {
    // Implementation for adding a player
  }

  drop_player(teamKey: string, playerKey: string): Promise<Transaction>;
  drop_player(teamKey: string, playerKey: string, cb: Callback<Transaction>): void;
  drop_player(teamKey: string, playerKey: string, cb?: Callback<Transaction>): Promise<Transaction> | void {
    // Implementation for dropping a player
  }

  add_drop(teamKey: string, addPlayerKey: string, dropPlayerKey: string): Promise<Transaction>;
  add_drop(teamKey: string, addPlayerKey: string, dropPlayerKey: string, cb: Callback<Transaction>): void;
  add_drop(teamKey: string, addPlayerKey: string, dropPlayerKey: string, cb?: Callback<Transaction>): Promise<Transaction> | void {
    // Implementation for add/drop transaction
  }
  */
}

export default TransactionsCollection;