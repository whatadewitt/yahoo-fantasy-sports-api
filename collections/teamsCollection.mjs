import {
  parseCollection,
  parseLeagueCollection,
  parseGameCollection
} from "../helpers/teamHelper.mjs";
import { extractCallback } from "../helpers/argsParser.mjs";

class TeamsCollection {
  constructor(yf) {
    this.yf = yf;
  }

  fetch(...args) {
    let teamKeys = args.shift().split(","),
      subresources = args.length > 1 ? args.shift() : [];
    const cb = extractCallback(args);

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
    return this.yf.api(
      {
        method: this.yf.GET,
        url, 
        responseMapper: data => parseCollection(data.fantasy_content.teams, subresources)
      }, 
      cb);
  }

  leagues(...args) {
    let leagueKeys = args.shift().split(","),
      subresources = args.length > 1 ? args.shift() : [];
    const cb = extractCallback(args);

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

    return this.yf.api(
      {
        method: this.yf.GET,
        url,
        responseMapper: data => {
          const leagues = parseLeagueCollection(
            data.fantasy_content.leagues,
            subresources
          );
          return leagues;
        }
      }, 
      cb);
  }

  userFetch(...args) {
    let subresources = args.length > 1 ? args.shift() : [];
    const cb = extractCallback(args);

    let url =
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/teams";

    if ("string" === typeof subresources) {
      subresources = [subresources];
    }

    if (subresources.length) {
      url += `;out=${subresources.join(",")}`;
    }

    url += "?format=json";

    return this.yf.api(
      {
        method: this.yf.GET,
        url,
        responseMapper: data => {
          const games = parseGameCollection(
            data.fantasy_content.users[0].user[1].games,
            subresources
          );
          return games;
        }
      }, 
      cb);
  }

  games(...args) {
    let gameKeys = args.shift().split(","),
      subresources = args.length > 1 ? args.shift() : [];
    const cb = extractCallback(args);

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

    return this.yf.api(
      {
        method: this.yf.GET,
        url,
        responseMapper: data => {
          const games = parseGameCollection(
            data.fantasy_content.users[0].user[1].games,
            subresources
          );
          return games;
        }
      }, 
      cb);
  }
}

export default TeamsCollection;
