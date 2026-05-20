import { YahooFantasyInstance, Callback } from "../types/core";
import { Transaction } from "../types/api-responses";
import { extractCallback } from "../helpers/argsParser";
import { parseTransactionCollection } from "../helpers/transactionHelper";
import {
  buildAddPayload,
  buildDropPayload,
  buildAddDropPayload,
  buildWaiverPayload,
  buildProposeTradePayload,
  WaiverOptions,
  ProposeTrade,
} from "../helpers/xmlHelper";
import {
  appendSemicolonParams,
  asArray,
  collectionItems,
  getAndMap,
  withCallback,
} from "../helpers/requestHelper";

interface TransactionLeagueFilters {
  types?: string | string[];
  team_key?: string;
  count?: number | string;
  start?: number | string;
}

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
    const cb = extractCallback(args) as Callback<any> | undefined;
    const transactionKeys = asArray(args.shift());
    const resources = asArray<string>(args.length ? args.shift() : []);
    const filters = args.length ? args.shift() || {} : {};
    const base = `https://fantasysports.yahooapis.com/fantasy/v2/transactions;transaction_keys=${transactionKeys.join(
      ",",
    )}`;
    const url = appendSemicolonParams(
      resources.length ? `${base};out=${resources.join(",")}` : base,
      Object.keys(filters || {}).map((key) => [key, filters[key]]),
    );

    return getAndMap(
      this.yf,
      url,
      (data) =>
        data.fantasy_content.transactions
          ? parseTransactionCollection(data.fantasy_content.transactions)
          : [],
      cb,
    );
  }

  leagues(leagueKeys: string | string[]): Promise<Transaction[]>;
  leagues(leagueKeys: string | string[], cb: Callback<Transaction[]>): void;
  leagues(leagueKeys: string | string[], filters: any): Promise<Transaction[]>;
  leagues(
    leagueKeys: string | string[],
    filters: any,
    cb: Callback<Transaction[]>,
  ): void;
  leagues(...args: any[]): Promise<Transaction[]> | void {
    const cb = extractCallback(args) as Callback<Transaction[]> | undefined;
    const leagueKeys = asArray(args.shift());
    const filters = (
      args.length ? args.shift() : {}
    ) as TransactionLeagueFilters;
    const base = `https://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=${leagueKeys.join(
      ",",
    )}/transactions`;
    const types = asArray(filters.types).join(",");
    const url = appendSemicolonParams(base, [
      ["types", types || undefined],
      ["team_key", filters.team_key],
      ["count", filters.count],
      ["start", filters.start],
    ]);

    return getAndMap(
      this.yf,
      url,
      (data) =>
        collectionItems(data.fantasy_content.leagues)
          .map((league) => league?.league?.[1]?.transactions)
          .filter(Boolean)
          .reduce(
            (allTransactions, transactionsData) =>
              allTransactions.concat(
                parseTransactionCollection(transactionsData),
              ),
            [] as Transaction[],
          ),
      cb,
    );
  }

  private postTransaction(
    leagueKey: string,
    body: string,
    cb?: Callback<any>,
  ): Promise<any> | void {
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/transactions`;
    return withCallback(
      this.yf.api(this.yf.POST, url, body) as Promise<any>,
      cb,
    );
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
    const options = typeof opts === "function" ? {} : opts || {};
    const callback = typeof opts === "function" ? opts : cb;
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
