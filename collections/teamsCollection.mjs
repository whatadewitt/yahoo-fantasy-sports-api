import {
  parseCollection,
  parseLeagueCollection,
  parseGameCollection
} from "../helpers/teamHelper.mjs";

class TeamsCollection {
  constructor(yf) {
    this.yf = yf;
  }

  fetch(...args) {
    let teamKeys = args.shift().split(","),
      subresources = args.length > 1 ? args.shift() : [];
    const cb = args.pop();

    let url = `https://fantasysports.yahooapis.com/fantasy/v2/teams;team_keys=${teamKeys.join(
      ","
    )}`;

    if ("string" === typeof subresources) {
      subresources = [subresources];
    }

    if (subresources.length) {
      url += `;out=${subresources.join(",")}`;
    }

    url += "?format=json";

    console.log(url);
    this.yf.api(this.yf.GET, url, (e, data) => {
      if (e) {
        return cb(e);
      }

      const teams = parseCollection(data.fantasy_content.teams, subresources);
      return cb(null, teams);
    });
  }

  leagues(...args) {
    let leagueKeys = args.shift().split(","),
      subresources = args.length > 1 ? args.shift() : [];
    const cb = args.pop();

    let url = `https://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=${leagueKeys.join(
      ","
    )}/teams`;

    if ("string" === typeof subresources) {
      subresources = [subresources];
    }

    if (subresources.length) {
      url += `;out=${subresources.join(",")}`;
    }

    url += "?format=json";

    this.yf.api(this.yf.GET, url, (e, data) => {
      if (e) {
        return cb(e);
      }

      const leagues = parseLeagueCollection(
        data.fantasy_content.leagues,
        subresources
      );
      return cb(null, leagues);
    });
  }

  userFetch(...args) {
    let subresources = args.length > 1 ? args.shift() : [];
    const cb = args.pop();

    let url =
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/teams";

    if ("string" === typeof subresources) {
      subresources = [subresources];
    }

    if (subresources.length) {
      url += `;out=${subresources.join(",")}`;
    }

    url += "?format=json";

    this.yf.api(this.yf.GET, url, (e, data) => {
      if (e) {
        return cb(e);
      }

      const games = parseGameCollection(
        data.fantasy_content.users[0].user[1].games,
        subresources
      );
      return cb(null, games);
    });
  }

  games(...args) {
    let gameKeys = args.shift().split(","),
      subresources = args.length > 1 ? args.shift() : [];
    const cb = args.pop();

    let url = `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=${gameKeys.join(
      ","
    )}/teams`;

    if ("string" === typeof subresources) {
      subresources = [subresources];
    }

    if (subresources.length) {
      url += `;out=${subresources.join(",")}`;
    }

    url += "?format=json";

    this.yf.api(this.yf.GET, url, (e, data) => {
      if (e) {
        return cb(e);
      }

      const games = parseGameCollection(
        data.fantasy_content.users[0].user[1].games,
        subresources
      );
      return cb(null, games);
    });
  }
}

export default TeamsCollection;
