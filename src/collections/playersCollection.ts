import { YahooFantasyInstance, Callback } from '../types/core';
import { Player } from '../types/api-responses';
import { PaginationParams, FilterParams } from '../types/utils';
import { parseCollection } from '../helpers/gameHelper';

class PlayersCollection {
  constructor(private yf: YahooFantasyInstance) {}

  fetch(playerKeys: string[]): Promise<Player[]>;
  fetch(playerKeys: string[], cb: Callback<Player[]>): void;
  fetch(playerKeys: string[], cb?: Callback<Player[]>): Promise<Player[]> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/players;player_keys=${playerKeys.join(',')}`
    ) as Promise<any>;

    const resultPromise = promise.then(data => parseCollection(data.fantasy_content.players));

    if (cb) {
      resultPromise.then(players => cb(null, players)).catch(e => cb(e));
      return;
    }
    return resultPromise;
  }

  league(leagueKey: string): Promise<Player[]>;
  league(leagueKey: string, params: PaginationParams & FilterParams): Promise<Player[]>;
  league(leagueKey: string, cb: Callback<Player[]>): void;
  league(leagueKey: string, params: PaginationParams & FilterParams, cb: Callback<Player[]>): void;
  league(leagueKey: string, paramsOrCb?: any, cb?: Callback<Player[]>): Promise<Player[]> | void {
    const actualCb = typeof paramsOrCb === 'function' ? paramsOrCb : cb;
    const params = typeof paramsOrCb === 'object' ? paramsOrCb : {};
    
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/players`;
    
    const queryParams: string[] = [];
    if (params.start) queryParams.push(`start=${params.start}`);
    if (params.count) queryParams.push(`count=${params.count}`);
    if (params.filters) queryParams.push(`filters=${params.filters.join(',')}`);
    
    if (queryParams.length) {
      url += `;${queryParams.join(';')}`;
    }

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;
    const resultPromise = promise.then(data => parseCollection(data.fantasy_content.league[1].players));

    if (actualCb) {
      resultPromise.then(players => actualCb(null, players)).catch(e => actualCb(e));
      return;
    }
    return resultPromise;
  }

  team(teamKey: string): Promise<Player[]>;
  team(teamKey: string, cb: Callback<Player[]>): void;
  team(teamKey: string, cb?: Callback<Player[]>): Promise<Player[]> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/players`
    ) as Promise<any>;

    const resultPromise = promise.then(data => parseCollection(data.fantasy_content.team[1].players));

    if (cb) {
      resultPromise.then(players => cb(null, players)).catch(e => cb(e));
      return;
    }
    return resultPromise;
  }

  freeAgents(leagueKey: string): Promise<Player[]>;
  freeAgents(leagueKey: string, cb: Callback<Player[]>): void;
  freeAgents(leagueKey: string, cb?: Callback<Player[]>): Promise<Player[]> | void {
    return cb ? this.league(leagueKey, { filters: ['FA'] }, cb) : this.league(leagueKey, { filters: ['FA'] });
  }

  ownership(leagueKey: string, playerKeys: string[]): Promise<any[]>;
  ownership(leagueKey: string, playerKeys: string[], cb: Callback<any[]>): void;
  ownership(leagueKey: string, playerKeys: string[], cb?: Callback<any[]>): Promise<any[]> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/players;player_keys=${playerKeys.join(',')}/ownership`
    ) as Promise<any>;

    const resultPromise = promise.then(data => parseCollection(data.fantasy_content.league[1].players));

    if (cb) {
      resultPromise.then(ownership => cb(null, ownership)).catch(e => cb(e));
      return;
    }
    return resultPromise;
  }
}

export default PlayersCollection;