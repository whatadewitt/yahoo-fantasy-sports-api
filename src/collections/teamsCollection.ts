import { YahooFantasyInstance, Callback } from '../types/core';
import { Team } from '../types/api-responses';
import { parseCollection } from '../helpers/gameHelper';

class TeamsCollection {
  constructor(private yf: YahooFantasyInstance) {}

  fetch(teamKeys: string[]): Promise<Team[]>;
  fetch(teamKeys: string[], cb: Callback<Team[]>): void;
  fetch(teamKeys: string[], cb?: Callback<Team[]>): Promise<Team[]> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/teams;team_keys=${teamKeys.join(',')}`
    ) as Promise<any>;

    const resultPromise = promise.then(data => parseCollection(data.fantasy_content.teams));

    if (cb) {
      resultPromise.then(teams => cb(null, teams)).catch(e => cb(e));
      return;
    }
    return resultPromise;
  }

  league(leagueKey: string): Promise<Team[]>;
  league(leagueKey: string, cb: Callback<Team[]>): void;
  league(leagueKey: string, cb?: Callback<Team[]>): Promise<Team[]> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/teams`
    ) as Promise<any>;

    const resultPromise = promise.then(data => parseCollection(data.fantasy_content.league[1].teams));

    if (cb) {
      resultPromise.then(teams => cb(null, teams)).catch(e => cb(e));
      return;
    }
    return resultPromise;
  }

  user(): Promise<Team[]>;
  user(cb: Callback<Team[]>): void;
  user(cb?: Callback<Team[]>): Promise<Team[]> | void {
    const promise = this.yf.api(
      this.yf.GET,
      'https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games/teams'
    ) as Promise<any>;

    const resultPromise = promise.then(data => parseCollection(data.fantasy_content.users[0].user[1].games));

    if (cb) {
      resultPromise.then(teams => cb(null, teams)).catch(e => cb(e));
      return;
    }
    return resultPromise;
  }

  userFetch(teamKeys: string[]): Promise<Team[]>;
  userFetch(teamKeys: string[], cb: Callback<Team[]>): void;
  userFetch(teamKeys: string[], cb?: Callback<Team[]>): Promise<Team[]> | void {
    return cb ? this.fetch(teamKeys, cb) : this.fetch(teamKeys);
  }
}

export default TeamsCollection;