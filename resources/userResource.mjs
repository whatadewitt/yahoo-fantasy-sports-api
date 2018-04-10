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
    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games?format=json`,
      (err, data) => {
        if (err) {
          return cb(err);
        }

        const user = data.fantasy_content.users[0].user[0];
        const games = mapGames(data.fantasy_content.users[0].user[1].games);

        user.games = games;

        return cb(null, user);
      }
    );
  }

  game_leagues(gameKeys, cb) {
    // TODO: get stats from other users...
    if (!Array.isArray(gameKeys)) {
      gameKeys = [gameKeys];
    }

    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=${gameKeys.join(
        ","
      )}/leagues?format=json`,
      (err, data) => {
        if (err) {
          return cb(err);
        }

        const user = data.fantasy_content.users[0].user[0];
        const leagues = mapUserLeagues(
          data.fantasy_content.users[0].user[1].games
        );

        user.games = leagues;

        return cb(null, user);
      }
    );
  }

  game_teams(gameKeys, cb) {
    if (!Array.isArray(gameKeys)) {
      gameKeys = [gameKeys];
    }

    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=${gameKeys.join(
        ","
      )}/teams?format=json`,
      (err, data) => {
        if (err) {
          return cb(err);
        }

        const user = data.fantasy_content.users[0].user[0];
        const teams = mapUserTeams(data.fantasy_content.users[0].user[1].games);

        user.teams = teams;

        return cb(null, user);
      }
    );
  }
}

export default UserResource;
