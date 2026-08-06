import { extractCallback, toCallbackOrPromise } from '../helpers/argsParser';
import {
  parseCollection,
  parseLeagueCollection,
  parseTeamCollection,
} from '../helpers/playerHelper';
import type { MappedPlayer } from '../types/api-responses';
import type { Callback, YahooFantasyInstance } from '../types/core';

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
    const cb = extractCallback(args);
    let playerKeys = args.shift();
    let subresources = args.length ? args.shift() : [];

    if (!Array.isArray(playerKeys)) {
      playerKeys = [playerKeys];
    }

    let url = `https://fantasysports.yahooapis.com/fantasy/v2/players;player_keys=${playerKeys.join(
      ',',
    )}`;

    if (typeof subresources === 'string') {
      subresources = [subresources];
    }

    if (subresources.length) {
      url += `;out=${subresources.join(',')}`;
    }

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;

    const resultPromise = promise.then((data) => {
      return parseCollection(data.fantasy_content.players, subresources);
    });

    return toCallbackOrPromise(resultPromise, cb);
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

    return toCallbackOrPromise(resultPromise, cb);
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
      const arg = args.shift();
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

    return toCallbackOrPromise(resultPromise, cb);
  }
}

export default PlayersCollection;
