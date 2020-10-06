import {
  parseCollection,
  parseLeagueCollection,
  parseGameCollection,
} from "../helpers/teamHelper.mjs";

import { extractCallback } from "../helpers/argsParser.mjs";

class TeamsCollection {
  constructor(yf) {
    this.yf = yf;
  }

  fetch(...args) {
    const cb = extractCallback(args);
    let teamKeys = args.shift(),
      subresources = args.length ? args.shift() : [];

    if (!Array.isArray(teamKeys)) {
      teamKeys = [teamKeys];
    }

    let url = `https://fantasysports.yahooapis.com/fantasy/v2/teams;team_keys=${teamKeys.join(
      ","
    )}`;

    if ("string" === typeof subresources) {
      subresources = [subresources];
    }

    if (subresources.length) {
      url += `;out=${subresources.join(",")}`;
    }

    return this.yf
      .api(this.yf.GET, url)
      .then((data) => {
        const teams = parseCollection(data.fantasy_content.teams, subresources);
        cb(null, teams);
        return teams;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  leagues(...args) {
    const cb = extractCallback(args);
    let leagueKeys = args.shift(),
      subresources = args.length ? args.shift() : [];

    if (!Array.isArray(leagueKeys)) {
      leagueKeys = [leagueKeys];
    }

    let url = `https://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=${leagueKeys.join(
      ","
    )}/teams`;

    if ("string" === typeof subresources) {
      subresources = [subresources];
    }

    if (subresources.length) {
      url += `;out=${subresources.join(",")}`;
    }

    return this.yf
      .api(this.yf.GET, url)
      .then((data) => {
        const leagues = parseLeagueCollection(
          data.fantasy_content.leagues,
          subresources
        );
        cb(null, leagues);
        return leagues;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  userFetch(...args) {
    const cb = extractCallback(args);
    let subresources = args.length ? args.shift() : [];

    let url =
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/teams";

    if ("string" === typeof subresources) {
      subresources = [subresources];
    }

    if (subresources.length) {
      url += `;out=${subresources.join(",")}`;
    }

    return this.yf
      .api(this.yf.GET, url)
      .then((data) => {
        const games = parseGameCollection(
          data.fantasy_content.users[0].user[1].games,
          subresources
        );
        cb(null, games);
        return games;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  games(...args) {
    const cb = extractCallback(args);
    let gameKeys = args.shift(),
      subresources = args.length ? args.shift() : [];

    if (!Array.isArray(gameKeys)) {
      gameKeys = [gameKeys];
    }

    let url = `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=${gameKeys.join(
      ","
    )}/teams`;

    if ("string" === typeof subresources) {
      subresources = [subresources];
    }

    if (subresources.length) {
      url += `;out=${subresources.join(",")}`;
    }

    return this.yf
      .api(this.yf.GET, url)
      .then((data) => {
        const games = parseGameCollection(
          data.fantasy_content.users[0].user[1].games,
          subresources
        );
        cb(null, games);
        return games;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }
}

export default TeamsCollection;
