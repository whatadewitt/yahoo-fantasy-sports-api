import {
  mapGames,
  mapUserLeagues,
  mapUserTeams
} from "../helpers/userHelper.mjs";

class UserResource {
  constructor(yf) {
    this.yf = yf;
  }

  games(cb) {
    return this.yf.api(
      {
        method: this.yf.GET,
        url: `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games?format=json`,
        responseMapper: data => {
          const user = data.fantasy_content.users[0].user[0];
          const games = mapGames(data.fantasy_content.users[0].user[1].games);

          user.games = games;

          return user;
        }
      }, 
      cb);
  }

  game_leagues(gameKeys, cb) {
    // TODO: get stats from other users...
    if (!Array.isArray(gameKeys)) {
      gameKeys = [gameKeys];
    }

    return this.yf.api(
      {
        method: this.yf.GET,
        url: `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=${gameKeys.join(
          ","
        )}/leagues?format=json`,
        responseMapper: data => {
          const user = data.fantasy_content.users[0].user[0];
          const leagues = mapUserLeagues(
            data.fantasy_content.users[0].user[1].games
          );

          user.games = leagues;

          return user;
        }
      }, 
      cb);
  }

  game_teams(gameKeys, cb) {
    if (!Array.isArray(gameKeys)) {
      gameKeys = [gameKeys];
    }

    return this.yf.api(
      {
        method: this.yf.GET,
        url: `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=${gameKeys.join(
          ","
        )}/teams?format=json`,
        responseMapper: data => {
          const user = data.fantasy_content.users[0].user[0];
          const teams = mapUserTeams(data.fantasy_content.users[0].user[1].games);

          user.teams = teams;

          return user;
        }
      }, 
      cb);
  }
}

export default UserResource;
