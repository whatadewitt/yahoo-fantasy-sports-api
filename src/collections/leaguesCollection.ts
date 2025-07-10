import { YahooFantasyInstance, Callback } from '../types/core';
import { League } from '../types/api-responses';
import { parseCollection } from '../helpers/gameHelper';
import { extractCallback } from '../helpers/argsParser';

class LeaguesCollection {
  constructor(private yf: YahooFantasyInstance) {}

  fetch(leagueKeys: string[]): Promise<League[]>;
  fetch(leagueKeys: string[], cb: Callback<League[]>): void;
  fetch(leagueKeys: string[], cb?: Callback<League[]>): Promise<League[]> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=${leagueKeys.join(',')}`
    ) as Promise<any>;

    const resultPromise = promise.then(data => parseCollection(data.fantasy_content.leagues));

    if (cb) {
      resultPromise.then(leagues => cb(null, leagues)).catch(e => cb(e));
      return;
    }
    return resultPromise;
  }

  user(): Promise<League[]>;
  user(cb: Callback<League[]>): void;
  user(cb?: Callback<League[]>): Promise<League[]> | void {
    const promise = this.yf.api(
      this.yf.GET,
      'https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games/leagues'
    ) as Promise<any>;

    const resultPromise = promise.then(data => parseCollection(data.fantasy_content.users[0].user[1].games));

    if (cb) {
      resultPromise.then(leagues => cb(null, leagues)).catch(e => cb(e));
      return;
    }
    return resultPromise;
  }

  userFetch(leagueKeys: string[]): Promise<League[]>;
  userFetch(leagueKeys: string[], cb: Callback<League[]>): void;
  userFetch(leagueKeys: string[], cb?: Callback<League[]>): Promise<League[]> | void {
    return cb ? this.fetch(leagueKeys, cb) : this.fetch(leagueKeys);
  }
}

export default LeaguesCollection;