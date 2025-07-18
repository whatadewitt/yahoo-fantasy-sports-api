import { YahooFantasyInstance, Callback } from '../types/core';
import { Transaction, Player } from '../types/api-responses';
import { mapPlayers } from '../helpers/gameHelper';

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
      const transaction = data.fantasy_content.transaction[0];
      if (!transaction) throw new Error('No transaction data found');
      return transaction;
    });

    if (cb) {
      resultPromise.then(transaction => cb(null, transaction)).catch(e => cb(e));
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

    const resultPromise = promise.then(data => {
      // Get transaction metadata
      const transaction = data.fantasy_content.transaction[0];
      
      // Get players data
      const playersData = data.fantasy_content.transaction[1].players || {};
      const mappedPlayers = mapPlayers(playersData);
      
      // Return transaction with players
      return {
        ...transaction,
        players: mappedPlayers
      };
    });

    if (cb) {
      resultPromise.then(players => cb(null, players)).catch(e => cb(e));
      return;
    }
    return resultPromise;
  }
}

export default TransactionResource;