import { YahooFantasyInstance, Callback } from "../types/core";
import { UserGame, UserLeague, MappedTeam } from "../types/api-responses";
import { mapTeam } from "../helpers/teamHelper";
import { collectionItems, getAndMap } from "../helpers/requestHelper";

function userGames(data: any): any {
  return data.fantasy_content.users[0].user[1].games || {};
}

function firstYahooNode(value: any): any {
  return Array.isArray(value) ? value[0] : value;
}

function mapUserGamesWithLeagues(data: any): any[] {
  return collectionItems(userGames(data)).map((gameEntry) => {
    const gameData = gameEntry.game;
    const game = firstYahooNode(gameData);
    const leagues = collectionItems(gameData[1]?.leagues).map((leagueData) =>
      firstYahooNode(leagueData.league),
    );

    return leagues.length ? { ...game, leagues } : game;
  });
}

function mapUserTeams(data: any): MappedTeam[] {
  return collectionItems(userGames(data)).reduce((teams, gameEntry) => {
    const gameData = gameEntry.game;
    const teamsData = Array.isArray(gameData) ? gameData[1]?.teams : undefined;
    const gameTeams = collectionItems(teamsData)
      .map((teamData) => firstYahooNode(teamData.team))
      .map(mapTeam);

    return teams.concat(gameTeams);
  }, [] as MappedTeam[]);
}

class UserResource {
  constructor(private yf: YahooFantasyInstance) {}

  games(): Promise<UserGame[]>;
  games(cb: Callback<UserGame[]>): void;
  games(cb?: Callback<UserGame[]>): Promise<UserGame[]> | void {
    const promise = this.yf.api(
      this.yf.GET,
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games",
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

    if (cb) {
      resultPromise.then((games) => cb(null, games)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
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

    if (cb) {
      resultPromise.then((leagues) => cb(null, leagues)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
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

    if (cb) {
      resultPromise.then((teams) => cb(null, teams)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
  }

  leagues(): Promise<any[]>;
  leagues(cb: Callback<any[]>): void;
  leagues(cb?: Callback<any[]>): Promise<any[]> | void {
    return getAndMap(
      this.yf,
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games/leagues",
      mapUserGamesWithLeagues,
      cb,
    );
  }

  teams(): Promise<any[]>;
  teams(cb: Callback<any[]>): void;
  teams(cb?: Callback<any[]>): Promise<any[]> | void {
    return getAndMap(
      this.yf,
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games/teams",
      mapUserTeams,
      cb,
    );
  }
}

export default UserResource;
