import { extractCallback, toCallbackOrPromise } from '../helpers/argsParser';
import { parseTransactionCollection } from '../helpers/transactionHelper';
import {
  buildAddDropPayload,
  buildAddPayload,
  buildDropPayload,
  buildProposeTradePayload,
  buildWaiverPayload,
  type ProposeTrade,
  type WaiverOptions,
} from '../helpers/xmlHelper';
import type { Callback, YahooFantasyInstance } from '../types/core';

class TransactionsCollection {
  constructor(private yf: YahooFantasyInstance) {}

  fetch(transactionKeys: string[]): Promise<any>;
  fetch(transactionKeys: string[], cb: Callback<any>): void;
  fetch(transactionKeys: string[], resources: string[]): Promise<any>;
  fetch(
    transactionKeys: string[],
    resources: string[],
    cb: Callback<any>,
  ): void;
  fetch(
    transactionKeys: string[],
    resources: string[],
    filters: any,
  ): Promise<any>;
  fetch(
    transactionKeys: string[],
    resources: string[],
    filters: any,
    cb: Callback<any>,
  ): void;
  fetch(...args: any[]): Promise<any> | void {
    const cb = extractCallback(args);
    let transactionKeys = args.shift();
    let resources = args.length ? args.shift() : [];
    const filters = args.length ? args.shift() : {};

    if (typeof transactionKeys === 'string') {
      transactionKeys = [transactionKeys];
    }

    let url = `https://fantasysports.yahooapis.com/fantasy/v2/transactions;transaction_keys=${transactionKeys.join(
      ',',
    )}`;

    if (resources?.length) {
      if (typeof resources === 'string') {
        resources = [resources];
      }
      url += `;out=${resources.join(',')}`;
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

    return toCallbackOrPromise(resultPromise, cb);
  }

  private postTransaction(
    leagueKey: string,
    body: string,
    cb?: Callback<any>,
  ): Promise<any> | void {
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/transactions`;
    const promise = this.yf.api(this.yf.POST, url, body) as Promise<any>;
    return toCallbackOrPromise(promise, cb);
  }

  add_player(
    leagueKey: string,
    teamKey: string,
    playerKey: string,
  ): Promise<any>;
  add_player(
    leagueKey: string,
    teamKey: string,
    playerKey: string,
    cb: Callback<any>,
  ): void;
  add_player(
    leagueKey: string,
    teamKey: string,
    playerKey: string,
    cb?: Callback<any>,
  ): Promise<any> | void {
    return this.postTransaction(
      leagueKey,
      buildAddPayload(playerKey, teamKey),
      cb,
    );
  }

  drop_player(
    leagueKey: string,
    teamKey: string,
    playerKey: string,
  ): Promise<any>;
  drop_player(
    leagueKey: string,
    teamKey: string,
    playerKey: string,
    cb: Callback<any>,
  ): void;
  drop_player(
    leagueKey: string,
    teamKey: string,
    playerKey: string,
    cb?: Callback<any>,
  ): Promise<any> | void {
    return this.postTransaction(
      leagueKey,
      buildDropPayload(playerKey, teamKey),
      cb,
    );
  }

  add_drop(
    leagueKey: string,
    teamKey: string,
    addPlayerKey: string,
    dropPlayerKey: string,
  ): Promise<any>;
  add_drop(
    leagueKey: string,
    teamKey: string,
    addPlayerKey: string,
    dropPlayerKey: string,
    cb: Callback<any>,
  ): void;
  add_drop(
    leagueKey: string,
    teamKey: string,
    addPlayerKey: string,
    dropPlayerKey: string,
    cb?: Callback<any>,
  ): Promise<any> | void {
    return this.postTransaction(
      leagueKey,
      buildAddDropPayload(addPlayerKey, dropPlayerKey, teamKey),
      cb,
    );
  }

  waiver_claim(
    leagueKey: string,
    teamKey: string,
    addPlayerKey: string,
    opts?: WaiverOptions,
  ): Promise<any>;
  waiver_claim(
    leagueKey: string,
    teamKey: string,
    addPlayerKey: string,
    opts: WaiverOptions,
    cb: Callback<any>,
  ): void;
  waiver_claim(
    leagueKey: string,
    teamKey: string,
    addPlayerKey: string,
    cb: Callback<any>,
  ): void;
  waiver_claim(
    leagueKey: string,
    teamKey: string,
    addPlayerKey: string,
    opts?: WaiverOptions | Callback<any>,
    cb?: Callback<any>,
  ): Promise<any> | void {
    const options = typeof opts === 'function' ? {} : opts || {};
    const callback = typeof opts === 'function' ? opts : cb;
    return this.postTransaction(
      leagueKey,
      buildWaiverPayload(addPlayerKey, teamKey, options),
      callback,
    );
  }

  propose_trade(
    leagueKey: string,
    traderTeamKey: string,
    tradeeTeamKey: string,
    trade: ProposeTrade,
  ): Promise<any>;
  propose_trade(
    leagueKey: string,
    traderTeamKey: string,
    tradeeTeamKey: string,
    trade: ProposeTrade,
    cb: Callback<any>,
  ): void;
  propose_trade(
    leagueKey: string,
    traderTeamKey: string,
    tradeeTeamKey: string,
    trade: ProposeTrade,
    cb?: Callback<any>,
  ): Promise<any> | void {
    return this.postTransaction(
      leagueKey,
      buildProposeTradePayload(traderTeamKey, tradeeTeamKey, trade),
      cb,
    );
  }
}

export default TransactionsCollection;
