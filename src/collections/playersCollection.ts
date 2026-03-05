import { YahooFantasyInstance, Callback } from "../types/core";
import { MappedPlayer } from "../types/api-responses";
import { PaginationParams, FilterParams } from "../types/utils";
import { parseCollection, parseLeagueCollection, parseTeamCollection } from "../helpers/playerHelper";
import { extractCallback } from "../helpers/argsParser";

class PlayersCollection {
  constructor(private yf: YahooFantasyInstance) {}

  fetch(playerKeys: string[]): Promise<MappedPlayer[]>;
  fetch(playerKeys: string[], cb: Callback<MappedPlayer[]>): void;
  fetch(playerKeys: string[], subresources: string[]): Promise<MappedPlayer[]>;
  fetch(
    playerKeys: string[],
    subresources: string[],
    cb: Callback<MappedPlayer[]>
  ): void;
  fetch(...args: any[]): Promise<MappedPlayer[]> | void {
    const cb = extractCallback(args);
    let playerKeys = args.shift();
    let subresources = args.length ? args.shift() : [];

    if (!Array.isArray(playerKeys)) {
      playerKeys = [playerKeys];
    }

    let url = `https://fantasysports.yahooapis.com/fantasy/v2/players;player_keys=${playerKeys.join(
      ","
    )}`;

    if (typeof subresources === "string") {
      subresources = [subresources];
    }

    if (subresources.length) {
      url += `;out=${subresources.join(",")}`;
    }

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;

    const resultPromise = promise.then((data) => {
      return parseCollection(data.fantasy_content.players, subresources);
    });

    if (cb) {
      resultPromise.then((players) => cb(null, players)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
  }

  leagues(leagueKeys: string | string[]): Promise<any[]>;
  leagues(leagueKeys: string | string[], cb: Callback<any[]>): void;
  leagues(leagueKeys: string | string[], filters: any): Promise<any[]>;
  leagues(leagueKeys: string | string[], filters: any, cb: Callback<any[]>): void;
  leagues(leagueKeys: string | string[], filters: any, subresources: string[]): Promise<any[]>;
  leagues(leagueKeys: string | string[], filters: any, subresources: string[], cb: Callback<any[]>): void;
  leagues(...args: any[]): Promise<any[]> | void {
    let leagueKeys = args.shift();
    let filters: any = {};
    let subresources: string[] = [];
    const cb = extractCallback(args);

    if (!Array.isArray(leagueKeys)) {
      leagueKeys = [leagueKeys];
    }

    if (args.length > 1) {
      filters = args.shift();
      subresources = args.shift();
    } else if (args.length === 1) {
      if (Array.isArray(args[0])) {
        subresources = args.shift();
      } else {
        filters = args.shift();
      }
    }

    let url = `https://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=${leagueKeys.join(',')}/players`;

    if (typeof subresources === 'string') {
      subresources = [subresources];
    }

    if (subresources.length) {
      url += `;out=${subresources.join(',')}`;
    }

    if (filters && Object.keys(filters).length) {
      Object.keys(filters).forEach((key) => {
        url += `;${key}=${filters[key]}`;
      });
    }

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;

    const resultPromise = promise.then((data) => {
      return parseLeagueCollection(data.fantasy_content.leagues, subresources);
    });

    if (cb) {
      resultPromise.then((leagues) => cb(null, leagues)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
  }

  // Keep this for backward compatibility with single league queries
  league(leagueKey: string): Promise<MappedPlayer[]>;
  league(leagueKey: string, cb: Callback<MappedPlayer[]>): void;
  league(leagueKey: string, params: PaginationParams & FilterParams): Promise<MappedPlayer[]>;
  league(leagueKey: string, params: PaginationParams & FilterParams, cb: Callback<MappedPlayer[]>): void;
  league(...args: any[]): Promise<MappedPlayer[]> | void {
    const cb = extractCallback(args);
    const leagueKey = args[0];
    const params = args.length > 1 && typeof args[1] === "object" ? args[1] : {};

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
  teams(teamKeys: string | string[], filters: any, subresources: string[]): Promise<any[]>;
  teams(teamKeys: string | string[], filters: any, subresources: string[], cb: Callback<any[]>): void;
  teams(...args: any[]): Promise<any[]> | void {
    let teamKeys = args.shift();
    let filters: any = {};
    let subresources: string[] = [];

    if (!Array.isArray(teamKeys)) {
      teamKeys = [teamKeys];
    }

    const cb = extractCallback(args);

    let url = `https://fantasysports.yahooapis.com/fantasy/v2/teams;team_keys=${teamKeys.join(',')}/players`;

    if (args.length > 1) {
      // both specified
      filters = args.shift();
      subresources = args.shift();
    } else if (args.length) {
      // only 1... if array, subresources
      let arg = args.shift();
      if (Array.isArray(arg)) {
        subresources = arg;
      } else if (typeof arg === 'string') {
        subresources = [arg];
      } else {
        filters = arg;
      }
    }

    if (typeof subresources === 'string') {
      subresources = [subresources];
    }

    if (subresources.length) {
      url += `;out=${subresources.join(',')}`;
    }

    if (filters && Object.keys(filters).length) {
      Object.keys(filters).forEach((key) => {
        url += `;${key}=${filters[key]}`;
      });
    }

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;

    const resultPromise = promise.then((data) => {
      return parseTeamCollection(data.fantasy_content.teams, subresources);
    });

    if (cb) {
      resultPromise.then((teams) => cb(null, teams)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
  }

  // Keep this for backward compatibility with single team queries
  team(teamKey: string): Promise<MappedPlayer[]>;
  team(teamKey: string, cb: Callback<MappedPlayer[]>): void;
  team(teamKey: string, subresources: string[]): Promise<MappedPlayer[]>;
  team(teamKey: string, subresources: string[], cb: Callback<MappedPlayer[]>): void;
  team(...args: any[]): Promise<MappedPlayer[]> | void {
    const cb = extractCallback(args);
    const teamKey = args.shift();
    let subresources = args.length ? args.shift() : [];

    if (typeof subresources === 'string') {
      subresources = [subresources];
    }

    let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/players`;

    if (subresources.length) {
      url += `;out=${subresources.join(',')}`;
    }

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;

    const resultPromise = promise.then((data) => {
      return parseCollection(data.fantasy_content.team[1].players, subresources);
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
    cb?: Callback<MappedPlayer[]>
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
        ","
      )}/ownership`
    ) as Promise<any>;

    const resultPromise = promise.then((data) => {
      return parseCollection(data.fantasy_content.league[1].players);
    });

    if (cb) {
      resultPromise.then((ownership) => cb(null, ownership)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
  }
}

export default PlayersCollection;
