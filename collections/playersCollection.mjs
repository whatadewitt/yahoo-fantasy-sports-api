import {
  parseCollection,
  parseLeagueCollection,
  parseTeamCollection,
} from "../helpers/playerHelper.mjs";

import { extractCallback } from "../helpers/argsParser.mjs";

class PlayersCollection {
  constructor(yf) {
    this.yf = yf;
  }

  fetch(...args) {
    const cb = extractCallback(args);
    let playerKeys = args.shift(),
      subresources = args.length ? args.shift() : [];

    if (!Array.isArray(playerKeys)) {
      playerKeys = [playerKeys];
    }

    let url =
      "https://fantasysports.yahooapis.com/fantasy/v2/players;player_keys=";

    url += playerKeys.join(",");

    if ("string" === typeof subresources) {
      subresources = [subresources];
    }

    if (subresources.length) {
      url += `;out=${subresources.join(",")}`;
    }

    return this.yf
      .api(this.yf.GET, url)
      .then((data) => {
        const players = parseCollection(
          data.fantasy_content.players,
          subresources
        );

        cb(null, players);
        return players;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  // ignoring the single b/c filters
  leagues(...args) {
    let leagueKeys = args.shift(),
      filters = false,
      subresources = [];
    const cb = extractCallback(args);

    if (!Array.isArray(leagueKeys)) {
      leagueKeys = [leagueKeys];
    }

    if (args.length > 1) {
      filters = args.shift();
      subresources = args.shift();
    } else if (args.length === 1) {
      if (Array.isArray(args[0])) {
        subresources = args.shift();
      } else {
        filters = args.shift();
      }
    }

    let url =
      "https://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=";

    url += leagueKeys.join(",");
    url += "/players";

    if ("string" === typeof subresources) {
      subresources = [subresources];
    }

    if (subresources.length) {
      url += `;out=${subresources.join(",")}`;
    }

    if (Object.keys(filters).length) {
      Object.keys(filters).forEach((key) => {
        url += `;${key}=${filters[key]}`;
      });
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

  teams(...args) {
    let teamKeys = args.shift(),
      filters = {},
      subresources = [];

    if (!Array.isArray(teamKeys)) {
      teamKeys = [teamKeys];
    }

    const cb = extractCallback(args);

    let url = "https://fantasysports.yahooapis.com/fantasy/v2/teams;team_keys=";

    url += teamKeys.join(",");
    url += "/players";

    if (args.length > 1) {
      // both specified
      filters = args.shift();
      subresources = args.shift();
    } else if (args.length) {
      // only 1... if array, subresources
      let arg = args.shift();
      if (Array.isArray(arg) || "string" === typeof arg) {
        subresources = arg;
      } else {
        filters = arg;
      }
    }

    if ("string" === typeof subresources) {
      subresources = [subresources];
    }

    if (subresources.length) {
      url += `;out=${subresources.join(",")}`;
    }

    Object.keys(filters).forEach((key) => {
      url += `;${key}=${filters[key]}`;
    });

    return this.yf
      .api(this.yf.GET, url)
      .then((data) => {
        const teams = parseTeamCollection(
          data.fantasy_content.teams,
          subresources
        );

        cb(null, teams);
        return teams;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }
}

export default PlayersCollection;
