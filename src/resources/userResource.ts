import { YahooFantasyInstance, Callback } from '../types/core';
import { UserGame, UserLeague, Team } from '../types/api-responses';

class UserResource {
  constructor(private yf: YahooFantasyInstance) {}

  games(): Promise<UserGame[]>;
  games(cb: Callback<UserGame[]>): void;
  games(cb?: Callback<UserGame[]>): Promise<UserGame[]> | void {
    const promise = this.yf.api(
      this.yf.GET,
      'https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games'
    ) as Promise<any>;

    const resultPromise = promise.then(data => {
      const games = data.fantasy_content.users[0].user[1].games || {};
      return Object.values(games).filter((g: any) => g.game).map((g: any) => g.game);
    });

    if (cb) {
      resultPromise.then(games => cb(null, games)).catch(e => cb(e));
      return;
    }
    return resultPromise;
  }

  game_leagues(gameKey: string): Promise<UserLeague[]>;
  game_leagues(gameKey: string, cb: Callback<UserLeague[]>): void;
  game_leagues(gameKey: string, cb?: Callback<UserLeague[]>): Promise<UserLeague[]> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=${gameKey}/leagues`
    ) as Promise<any>;

    const resultPromise = promise.then(data => {
      const leagues = data.fantasy_content.users[0].user[1].games[0].game[1].leagues || {};
      return Object.values(leagues).filter((l: any) => l.league).map((l: any) => l.league);
    });

    if (cb) {
      resultPromise.then(leagues => cb(null, leagues)).catch(e => cb(e));
      return;
    }
    return resultPromise;
  }

  game_teams(gameKey: string): Promise<Team[]>;
  game_teams(gameKey: string, cb: Callback<Team[]>): void;
  game_teams(gameKey: string, cb?: Callback<Team[]>): Promise<Team[]> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=${gameKey}/teams`
    ) as Promise<any>;

    const resultPromise = promise.then(data => {
      const teams = data.fantasy_content.users[0].user[1].games[0].game[1].teams || {};
      return Object.values(teams).filter((t: any) => t.team).map((t: any) => t.team);
    });

    if (cb) {
      resultPromise.then(teams => cb(null, teams)).catch(e => cb(e));
      return;
    }
    return resultPromise;
  }

  leagues(): Promise<UserLeague[]>;
  leagues(cb: Callback<UserLeague[]>): void;
  leagues(cb?: Callback<UserLeague[]>): Promise<UserLeague[]> | void {
    const promise = this.yf.api(
      this.yf.GET,
      'https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games/leagues'
    ) as Promise<any>;

    const resultPromise = promise.then(data => {
      // This is a complex nested structure, simplified for now
      return data.fantasy_content.users[0].user[1].games || [];
    });

    if (cb) {
      resultPromise.then(leagues => cb(null, leagues)).catch(e => cb(e));
      return;
    }
    return resultPromise;
  }

  teams(): Promise<Team[]>;
  teams(cb: Callback<Team[]>): void;
  teams(cb?: Callback<Team[]>): Promise<Team[]> | void {
    const promise = this.yf.api(
      this.yf.GET,
      'https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games/teams'
    ) as Promise<any>;

    const resultPromise = promise.then(data => {
      // This is a complex nested structure, simplified for now
      return data.fantasy_content.users[0].user[1].games || [];
    });

    if (cb) {
      resultPromise.then(teams => cb(null, teams)).catch(e => cb(e));
      return;
    }
    return resultPromise;
  }
}

export default UserResource;