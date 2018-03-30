import {
  parseCollection,
  parseLeagueCollection,
  parseTeamCollection
} from "../helpers/playerHelper.mjs";

class PlayersCollection {
  constructor(yf) {
    this.yf = yf;
  }

  fetch(...args) {
    let playerKeys = args.shift(),
      subresources = args.length > 1 ? args.shift() : [];
    const cb = args.pop();

    var url =
      "https://fantasysports.yahooapis.com/fantasy/v2/players;player_keys=";

    if ("string" === typeof playerKeys) {
      playerKeys = [playerKeys];
    }

    url += playerKeys.join(",");

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

      const players = parseCollection(
        data.fantasy_content.players,
        subresources
      );

      return cb(null, players);
    });
  }

  // ignoring the single b/c filters
  leagues(...args) {
    let leagueKeys = args.shift(),
      filters = false,
      // arguments.length > 1
      //   ? arguments[0]
      //   : arguments.length > 1 && _.isObject(arguments[0]) ? arguments[0] : {},
      subresources = [];
    // arguments.length > 1
    //   ? arguments[1]
    //   : arguments.length > 1 && _.isArray(arguments[0]) ? arguments[0] : []; // ugliest line of code ever?
    const cb = args.pop();

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

    var url =
      "https://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=";

    if ("string" === typeof leagueKeys) {
      leagueKeys = [leagueKeys];
    }

    url += leagueKeys.join(",");
    url += "/players";

    if ("string" === typeof subresources) {
      subresources = [subresources];
    }

    if (subresources.length) {
      url += `;out=${subresources.join(",")}`;
    }

    if (Object.keys(filters).length) {
      Object.keys(filters).forEach(key => {
        url += `;${key}=${filters[key]}`;
      });
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

  // TODO: This is where I am
  teams(...args) {
    let teamKeys = args.shift(),
      filters = {},
      subresources = [];
    // filters =
    //   arguments.length > 3
    //     ? arguments[1]
    //     : arguments.length > 2 && _.isObject(arguments[1])
    //       ? arguments[1]
    //       : {},
    // subresources =
    //   arguments.length > 3
    //     ? arguments[2]
    //     : arguments.length > 2 && _.isArray(arguments[1]) ? arguments[1] : []; // ugliest line of code ever?
    const cb = args.pop();

    var url = "https://fantasysports.yahooapis.com/fantasy/v2/teams;team_keys=";

    if ("string" === typeof teamKeys) {
      teamKeys = [teamKeys];
    }

    url += teamKeys.join(",");
    url += "/players";

    if ("string" === typeof subresources) {
      subresources = [subresources];
    }

    if (subresources.length) {
      url += `;out=${subresources.join(",")}`;
    }

    Object.keys(filters).forEach(key => {
      url += `;${key}=${filters[key]}`;
    });

    url += "?format=json";

    this.yf.api(this.yf.GET, url, (e, data) => {
      if (e) {
        return cb(e);
      }

      const teams = parseTeamCollection(
        data.fantasy_content.teams,
        subresources
      );

      return cb(null, teams);
    });
  }
}

export default PlayersCollection;
