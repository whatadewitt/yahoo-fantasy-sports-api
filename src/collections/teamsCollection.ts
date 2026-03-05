import { YahooFantasyInstance, Callback } from '../types/core';
import { MappedTeam } from '../types/api-responses';
import { 
  parseCollection, 
  parseLeagueCollection, 
  parseGameCollection 
} from '../helpers/teamHelper';
import { extractCallback } from '../helpers/argsParser';

class TeamsCollection {
  constructor(private yf: YahooFantasyInstance) {}

  fetch(teamKeys: string[]): Promise<MappedTeam[]>;
  fetch(teamKeys: string[], cb: Callback<MappedTeam[]>): void;
  fetch(teamKeys: string[], subresources: string[]): Promise<MappedTeam[]>;
  fetch(teamKeys: string[], subresources: string[], cb: Callback<MappedTeam[]>): void;
  fetch(...args: any[]): Promise<MappedTeam[]> | void {
    const cb = extractCallback(args);
    let teamKeys = args.shift();
    let subresources = args.length ? args.shift() : [];

    if (!Array.isArray(teamKeys)) {
      teamKeys = [teamKeys];
    }

    let url = `https://fantasysports.yahooapis.com/fantasy/v2/teams;team_keys=${teamKeys.join(',')}`;

    if (typeof subresources === 'string') {
      subresources = [subresources];
    }

    if (subresources.length) {
      url += `;out=${subresources.join(',')}`;
    }

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;

    const resultPromise = promise.then((data) => {
      return parseCollection(data.fantasy_content.teams, subresources);
    });

    if (cb) {
      resultPromise.then((teams) => cb(null, teams)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
  }

  leagues(leagueKeys: string[]): Promise<any[]>;
  leagues(leagueKeys: string[], cb: Callback<any[]>): void;
  leagues(leagueKeys: string[], subresources: string[]): Promise<any[]>;
  leagues(leagueKeys: string[], subresources: string[], cb: Callback<any[]>): void;
  leagues(...args: any[]): Promise<any[]> | void {
    const cb = extractCallback(args);
    let leagueKeys = args.shift();
    let subresources = args.length ? args.shift() : [];

    if (!Array.isArray(leagueKeys)) {
      leagueKeys = [leagueKeys];
    }

    let url = `https://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=${leagueKeys.join(',')}/teams`;

    if (typeof subresources === 'string') {
      subresources = [subresources];
    }

    if (subresources.length) {
      url += `;out=${subresources.join(',')}`;
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

  userFetch(): Promise<any[]>;
  userFetch(cb: Callback<any[]>): void;
  userFetch(subresources: string[]): Promise<any[]>;
  userFetch(subresources: string[], cb: Callback<any[]>): void;
  userFetch(...args: any[]): Promise<any[]> | void {
    const cb = extractCallback(args);
    let subresources = args.length ? args.shift() : [];

    let url = 'https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/teams';

    if (typeof subresources === 'string') {
      subresources = [subresources];
    }

    if (subresources.length) {
      url += `;out=${subresources.join(',')}`;
    }

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;

    const resultPromise = promise.then((data) => {
      return parseGameCollection(data.fantasy_content.users[0].user[1].games, subresources);
    });

    if (cb) {
      resultPromise.then((games) => cb(null, games)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
  }

  games(gameKeys: string[]): Promise<any[]>;
  games(gameKeys: string[], cb: Callback<any[]>): void;
  games(gameKeys: string[], subresources: string[]): Promise<any[]>;
  games(gameKeys: string[], subresources: string[], cb: Callback<any[]>): void;
  games(...args: any[]): Promise<any[]> | void {
    const cb = extractCallback(args);
    let gameKeys = args.shift();
    let subresources = args.length ? args.shift() : [];

    if (!Array.isArray(gameKeys)) {
      gameKeys = [gameKeys];
    }

    let url = `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=${gameKeys.join(',')}/teams`;

    if (typeof subresources === 'string') {
      subresources = [subresources];
    }

    if (subresources.length) {
      url += `;out=${subresources.join(',')}`;
    }

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;

    const resultPromise = promise.then((data) => {
      return parseGameCollection(data.fantasy_content.users[0].user[1].games, subresources);
    });

    if (cb) {
      resultPromise.then((games) => cb(null, games)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
  }

  // Keep these for backward compatibility with the current TypeScript collection
  league(leagueKey: string): Promise<MappedTeam[]>;
  league(leagueKey: string, cb: Callback<MappedTeam[]>): void;
  league(...args: any[]): Promise<MappedTeam[]> | void {
    const cb = extractCallback(args);
    const leagueKey = args[0];

    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/teams`
    ) as Promise<any>;

    const resultPromise = promise.then((data) => {
      return parseCollection(data.fantasy_content.league[1].teams);
    });

    if (cb) {
      resultPromise.then((teams) => cb(null, teams)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
  }

  user(): Promise<MappedTeam[]>;
  user(cb: Callback<MappedTeam[]>): void;
  user(...args: any[]): Promise<MappedTeam[]> | void {
    const cb = extractCallback(args);

    const promise = this.yf.api(
      this.yf.GET,
      'https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games/teams'
    ) as Promise<any>;

    const resultPromise = promise.then((data) => {
      return parseCollection(data.fantasy_content.users[0].user[1].games);
    });

    if (cb) {
      resultPromise.then((teams) => cb(null, teams)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
  }
}

export default TeamsCollection;