import { YahooFantasyInstance, Callback } from "../types/core";
import { MappedPlayer } from "../types/api-responses";
import { PaginationParams, FilterParams } from "../types/utils";
import {
  parseCollection,
  parseLeagueCollection,
  parseTeamCollection,
} from "../helpers/playerHelper";
import { extractCallback } from "../helpers/argsParser";
import {
  appendSemicolonParams,
  asArray,
  getAndMap,
  getKeyedCollectionFromArgs,
} from "../helpers/requestHelper";

interface PlayersScopeArgs {
  filters: Record<string, any>;
  subresources: string[];
}

function isSubresourceArg(arg: any): boolean {
  return Array.isArray(arg) || typeof arg === "string";
}

function parsePlayersScopeArgs(args: any[]): PlayersScopeArgs {
  if (args.length > 1) {
    return {
      filters: args[0] || {},
      subresources: asArray<string>(args[1]),
    };
  }

  const arg = args[0];
  return {
    filters: isSubresourceArg(arg) ? {} : arg || {},
    subresources: isSubresourceArg(arg) ? asArray<string>(arg) : [],
  };
}

function getPlayersScope<T>(
  yf: YahooFantasyInstance,
  args: any[],
  collection: "leagues" | "teams",
  keyName: "league_keys" | "team_keys",
  select: (data: any) => any,
  parser: (collectionData: any, subresources: string[]) => T,
): Promise<T> | void {
  const keys = asArray(args.shift());
  const cb = extractCallback(args) as Callback<T> | undefined;
  const { filters, subresources } = parsePlayersScopeArgs(args);

  const base = `https://fantasysports.yahooapis.com/fantasy/v2/${collection};${keyName}=${keys.join(
    ",",
  )}/players`;
  const url = appendSemicolonParams(
    subresources.length ? `${base};out=${subresources.join(",")}` : base,
    Object.keys(filters || {}).map((key) => [key, filters[key]]),
  );

  return getAndMap(yf, url, (data) => parser(select(data), subresources), cb);
}

class PlayersCollection {
  constructor(private yf: YahooFantasyInstance) {}

  fetch(playerKeys: string[]): Promise<MappedPlayer[]>;
  fetch(playerKeys: string[], cb: Callback<MappedPlayer[]>): void;
  fetch(playerKeys: string[], subresources: string[]): Promise<MappedPlayer[]>;
  fetch(
    playerKeys: string[],
    subresources: string[],
    cb: Callback<MappedPlayer[]>,
  ): void;
  fetch(...args: any[]): Promise<MappedPlayer[]> | void {
    return getKeyedCollectionFromArgs(this.yf, args, {
      collection: "players",
      keyName: "player_keys",
      suffix: "",
      select: (data) => data.fantasy_content.players,
      parser: parseCollection,
    });
  }

  leagues(leagueKeys: string | string[]): Promise<any[]>;
  leagues(leagueKeys: string | string[], cb: Callback<any[]>): void;
  leagues(leagueKeys: string | string[], filters: any): Promise<any[]>;
  leagues(
    leagueKeys: string | string[],
    filters: any,
    cb: Callback<any[]>,
  ): void;
  leagues(
    leagueKeys: string | string[],
    filters: any,
    subresources: string[],
  ): Promise<any[]>;
  leagues(
    leagueKeys: string | string[],
    filters: any,
    subresources: string[],
    cb: Callback<any[]>,
  ): void;
  leagues(...args: any[]): Promise<any[]> | void {
    return getPlayersScope(
      this.yf,
      args,
      "leagues",
      "league_keys",
      (data) => data.fantasy_content.leagues,
      parseLeagueCollection,
    );
  }

  // Keep this for backward compatibility with single league queries
  league(leagueKey: string): Promise<MappedPlayer[]>;
  league(leagueKey: string, cb: Callback<MappedPlayer[]>): void;
  league(
    leagueKey: string,
    params: PaginationParams & FilterParams,
  ): Promise<MappedPlayer[]>;
  league(
    leagueKey: string,
    params: PaginationParams & FilterParams,
    cb: Callback<MappedPlayer[]>,
  ): void;
  league(...args: any[]): Promise<MappedPlayer[]> | void {
    const cb = extractCallback(args);
    const leagueKey = args[0];
    const params =
      args.length > 1 && typeof args[1] === "object" ? args[1] : {};

    let url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/players`;

    const queryParams: string[] = [];
    if (params.start) queryParams.push(`start=${params.start}`);
    if (params.count) queryParams.push(`count=${params.count}`);
    if (params.filters) queryParams.push(`filters=${params.filters.join(",")}`);

    if (queryParams.length) {
      url += `;${queryParams.join(";")}`;
    }

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;

    const resultPromise = promise.then((data) => {
      return parseCollection(data.fantasy_content.league[1].players);
    });

    if (cb) {
      resultPromise.then((players) => cb(null, players)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
  }

  teams(teamKeys: string | string[]): Promise<any[]>;
  teams(teamKeys: string | string[], cb: Callback<any[]>): void;
  teams(teamKeys: string | string[], filters: any): Promise<any[]>;
  teams(teamKeys: string | string[], filters: any, cb: Callback<any[]>): void;
  teams(
    teamKeys: string | string[],
    filters: any,
    subresources: string[],
  ): Promise<any[]>;
  teams(
    teamKeys: string | string[],
    filters: any,
    subresources: string[],
    cb: Callback<any[]>,
  ): void;
  teams(...args: any[]): Promise<any[]> | void {
    return getPlayersScope(
      this.yf,
      args,
      "teams",
      "team_keys",
      (data) => data.fantasy_content.teams,
      parseTeamCollection,
    );
  }

  // Keep this for backward compatibility with single team queries
  team(teamKey: string): Promise<MappedPlayer[]>;
  team(teamKey: string, cb: Callback<MappedPlayer[]>): void;
  team(teamKey: string, subresources: string[]): Promise<MappedPlayer[]>;
  team(
    teamKey: string,
    subresources: string[],
    cb: Callback<MappedPlayer[]>,
  ): void;
  team(...args: any[]): Promise<MappedPlayer[]> | void {
    const cb = extractCallback(args);
    const teamKey = args.shift();
    let subresources = args.length ? args.shift() : [];

    if (typeof subresources === "string") {
      subresources = [subresources];
    }

    let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/players`;

    if (subresources.length) {
      url += `;out=${subresources.join(",")}`;
    }

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;

    const resultPromise = promise.then((data) => {
      return parseCollection(
        data.fantasy_content.team[1].players,
        subresources,
      );
    });

    if (cb) {
      resultPromise.then((players) => cb(null, players)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
  }

  freeAgents(leagueKey: string): Promise<MappedPlayer[]>;
  freeAgents(leagueKey: string, cb: Callback<MappedPlayer[]>): void;
  freeAgents(
    leagueKey: string,
    cb?: Callback<MappedPlayer[]>,
  ): Promise<MappedPlayer[]> | void {
    return cb
      ? this.leagues(leagueKey, { filters: ["FA"] }, cb)
      : this.leagues(leagueKey, { filters: ["FA"] });
  }

  ownership(leagueKey: string, playerKeys: string[]): Promise<any[]>;
  ownership(leagueKey: string, playerKeys: string[], cb: Callback<any[]>): void;
  ownership(...args: any[]): Promise<any[]> | void {
    const cb = extractCallback(args);
    const leagueKey = args[0];
    const playerKeys = args[1];

    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/players;player_keys=${playerKeys.join(
        ",",
      )}/ownership`,
    ) as Promise<any>;

    const resultPromise = promise.then((data) => {
      return parseCollection(data.fantasy_content.league[1].players);
    });

    if (cb) {
      resultPromise
        .then((ownership) => cb(null, ownership))
        .catch((e) => cb(e));
      return;
    }
    return resultPromise;
  }
}

export default PlayersCollection;
