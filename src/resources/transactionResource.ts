import { YahooFantasyInstance, Callback } from '../types/core';
import { Transaction, MappedPlayer } from '../types/api-responses';
import { mapPlayers } from '../helpers/gameHelper';
import {
  buildTradeResponsePayload,
  buildEditWaiverPayload,
  buildEditTradePayload,
  TradeResponseOptions,
  EditWaiverOptions,
  EditTradeOptions,
} from '../helpers/xmlHelper';

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

  players(transactionKey: string): Promise<MappedPlayer[]>;
  players(transactionKey: string, cb: Callback<MappedPlayer[]>): void;
  players(transactionKey: string, cb?: Callback<MappedPlayer[]>): Promise<MappedPlayer[]> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/transaction/${transactionKey}/players`
    ) as Promise<any>;

    const resultPromise = promise.then(data => {
      const transaction = data.fantasy_content.transaction[0];
      const playersData = data.fantasy_content.transaction[1].players || {};
      const mappedPlayers = mapPlayers(playersData);
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

  private putTransaction(
    transactionKey: string,
    body: string,
    cb?: Callback<any>
  ): Promise<any> | void {
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/transaction/${transactionKey}`;
    const promise = this.yf.api(this.yf.PUT, url, body) as Promise<any>;
    if (cb) {
      promise.then((d) => cb(null, d)).catch((e) => cb(e));
      return;
    }
    return promise;
  }

  private deleteTransaction(
    transactionKey: string,
    cb?: Callback<any>
  ): Promise<any> | void {
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/transaction/${transactionKey}`;
    const promise = this.yf.api(this.yf.DELETE, url) as Promise<any>;
    if (cb) {
      promise.then((d) => cb(null, d)).catch((e) => cb(e));
      return;
    }
    return promise;
  }

  private respond(
    transactionKey: string,
    action: 'accept' | 'reject' | 'allow' | 'disallow' | 'vote_against',
    opts: TradeResponseOptions,
    cb?: Callback<any>
  ): Promise<any> | void {
    return this.putTransaction(
      transactionKey,
      buildTradeResponsePayload(transactionKey, action, opts),
      cb
    );
  }

  accept(transactionKey: string, opts?: { trade_note?: string }): Promise<any>;
  accept(transactionKey: string, opts: { trade_note?: string }, cb: Callback<any>): void;
  accept(transactionKey: string, cb: Callback<any>): void;
  accept(transactionKey: string, opts?: { trade_note?: string } | Callback<any>, cb?: Callback<any>): Promise<any> | void {
    const o = typeof opts === 'function' ? {} : opts || {};
    const c = typeof opts === 'function' ? opts : cb;
    return this.respond(transactionKey, 'accept', o, c);
  }

  reject(transactionKey: string, opts?: { trade_note?: string }): Promise<any>;
  reject(transactionKey: string, opts: { trade_note?: string }, cb: Callback<any>): void;
  reject(transactionKey: string, cb: Callback<any>): void;
  reject(transactionKey: string, opts?: { trade_note?: string } | Callback<any>, cb?: Callback<any>): Promise<any> | void {
    const o = typeof opts === 'function' ? {} : opts || {};
    const c = typeof opts === 'function' ? opts : cb;
    return this.respond(transactionKey, 'reject', o, c);
  }

  allow(transactionKey: string): Promise<any>;
  allow(transactionKey: string, cb: Callback<any>): void;
  allow(transactionKey: string, cb?: Callback<any>): Promise<any> | void {
    return this.respond(transactionKey, 'allow', {}, cb);
  }

  disallow(transactionKey: string): Promise<any>;
  disallow(transactionKey: string, cb: Callback<any>): void;
  disallow(transactionKey: string, cb?: Callback<any>): Promise<any> | void {
    return this.respond(transactionKey, 'disallow', {}, cb);
  }

  vote_against(transactionKey: string, voterTeamKey: string): Promise<any>;
  vote_against(transactionKey: string, voterTeamKey: string, cb: Callback<any>): void;
  vote_against(transactionKey: string, voterTeamKey: string, cb?: Callback<any>): Promise<any> | void {
    return this.respond(transactionKey, 'vote_against', { voter_team_key: voterTeamKey }, cb);
  }

  edit_waiver(transactionKey: string, opts: EditWaiverOptions): Promise<any>;
  edit_waiver(transactionKey: string, opts: EditWaiverOptions, cb: Callback<any>): void;
  edit_waiver(transactionKey: string, opts: EditWaiverOptions, cb?: Callback<any>): Promise<any> | void {
    return this.putTransaction(transactionKey, buildEditWaiverPayload(transactionKey, opts), cb);
  }

  edit_trade(transactionKey: string, opts: EditTradeOptions): Promise<any>;
  edit_trade(transactionKey: string, opts: EditTradeOptions, cb: Callback<any>): void;
  edit_trade(transactionKey: string, opts: EditTradeOptions, cb?: Callback<any>): Promise<any> | void {
    return this.putTransaction(transactionKey, buildEditTradePayload(transactionKey, opts), cb);
  }

  cancel(transactionKey: string): Promise<any>;
  cancel(transactionKey: string, cb: Callback<any>): void;
  cancel(transactionKey: string, cb?: Callback<any>): Promise<any> | void {
    return this.deleteTransaction(transactionKey, cb);
  }
}

export default TransactionResource;
