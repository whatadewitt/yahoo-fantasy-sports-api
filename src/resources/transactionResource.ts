import { YahooFantasyInstance, Callback } from '../types/core';
import { Transaction, Player } from '../types/api-responses';

class TransactionResource {
  constructor(private yf: YahooFantasyInstance) {}

  meta(transactionKey: string): Promise<Transaction>;
  meta(transactionKey: string, cb: Callback<Transaction>): void;
  meta(transactionKey: string, cb?: Callback<Transaction>): Promise<Transaction> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/transaction/${transactionKey}/metadata`
    ) as Promise<any>;

    const resultPromise = promise.then(data => {
      const meta = data.fantasy_content.transaction[0];
      if (!meta) throw new Error('No transaction data found');
      return meta;
    });

    if (cb) {
      resultPromise.then(meta => cb(null, meta)).catch(e => cb(e));
      return;
    }
    return resultPromise;
  }

  players(transactionKey: string): Promise<Player[]>;
  players(transactionKey: string, cb: Callback<Player[]>): void;
  players(transactionKey: string, cb?: Callback<Player[]>): Promise<Player[]> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/transaction/${transactionKey}/players`
    ) as Promise<any>;

    const resultPromise = promise.then(data => data.fantasy_content.transaction[1].players || []);

    if (cb) {
      resultPromise.then(players => cb(null, players)).catch(e => cb(e));
      return;
    }
    return resultPromise;
  }
}

export default TransactionResource;