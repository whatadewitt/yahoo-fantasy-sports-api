import { toCallbackOrPromise } from '../helpers/argsParser';
import { mapTeam } from '../helpers/teamHelper';
import type { MappedTeam, UserGame, UserLeague } from '../types/api-responses';
import type { Callback, YahooFantasyInstance } from '../types/core';

class UserResource {
  constructor(private yf: YahooFantasyInstance) {}

  games(): Promise<UserGame[]>;
  games(cb: Callback<UserGame[]>): void;
  games(cb?: Callback<UserGame[]>): Promise<UserGame[]> | void {
    const promise = this.yf.api(
      this.yf.GET,
      'https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games',
    ) as Promise<any>;

    const resultPromise = promise.then((data) => {
      const games = data.fantasy_content.users[0].user[1].games || {};
      return Object.values(games)
        .filter((g: any) => g.game)
        .map((g: any) => {
          // Handle both array and object formats
          return Array.isArray(g.game) ? g.game[0] : g.game;
        });
    });

    return toCallbackOrPromise(resultPromise, cb);
  }

  game_leagues(gameKey: string): Promise<UserLeague[]>;
  game_leagues(gameKey: string, cb: Callback<UserLeague[]>): void;
  game_leagues(
    gameKey: string,
    cb?: Callback<UserLeague[]>,
  ): Promise<UserLeague[]> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=${gameKey}/leagues`,
    ) as Promise<any>;

    const resultPromise = promise.then((data) => {
      const leagues =
        data.fantasy_content.users[0].user[1].games[0].game[1].leagues || {};
      return Object.values(leagues)
        .filter((l: any) => l.league)
        .map((l: any) => {
          // Handle both array and object formats
          return Array.isArray(l.league) ? l.league[0] : l.league;
        });
    });

    return toCallbackOrPromise(resultPromise, cb);
  }

  game_teams(gameKey: string): Promise<MappedTeam[]>;
  game_teams(gameKey: string, cb: Callback<MappedTeam[]>): void;
  game_teams(
    gameKey: string,
    cb?: Callback<MappedTeam[]>,
  ): Promise<MappedTeam[]> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=${gameKey}/teams`,
    ) as Promise<any>;

    const resultPromise = promise.then((data) => {
      const teams =
        data.fantasy_content.users[0].user[1].games[0].game[1].teams || {};
      return Object.values(teams)
        .filter((t: any) => t.team)
        .map((t: any) => {
          const teamData = t.team;
          // Team data comes as an array where first element is the team info
          const team = mapTeam(
            Array.isArray(teamData) ? teamData[0] : teamData,
          );
          return team;
        });
    });

    return toCallbackOrPromise(resultPromise, cb);
  }
}

export default UserResource;
