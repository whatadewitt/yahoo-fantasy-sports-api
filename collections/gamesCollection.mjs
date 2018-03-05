import { parseCollection } from "../helpers/gameHelper.mjs";

class GamesCollection {
  constructor(yf) {
    this.yf = yf;
  }

  // params: game keys or filters, subresources (optional), callback
  fetch(...args) {
    let gameKeys = [],
      subresources = [],
      filters = {};
    const cb = args.pop();

    if (Array.isArray(args[0])) {
      gameKeys = args.shift();
    } else if ("string" == typeof args[0]) {
      gameKeys = [args.shift()];
    } else {
      filters = args.shift();
    }

    if (args.length) {
      subresources = args[1];

      // needs to be an array
      if ("string" == typeof subresources) {
        subresources = [subresources];
      }
    }

    let url = "https://fantasysports.yahooapis.com/fantasy/v2/games";

    if (gameKeys.length) {
      url += `;game_keys=${gameKeys.join(",")}`;
    }

    if (Object.keys(filters).length) {
      Object.keys(filters).forEach(key => {
        url += `;${key}=${filters[key]}`;
      });
    }

    if (subresources.length) {
      url += `;out=${subresources.join(",")}`;
    }

    url += "?format=json";

    this.yf.api(this.yf.GET, url, (e, data) => {
      if (e) {
        return cb(e);
      }

      const games = parseCollection(data.fantasy_content.games, subresources);
      return cb(null, games);
    });
  }

  user(...args) {
    // no gamekeys...
    let subresources = [],
      filters = false;
    const cb = args.pop();

    switch (args.length) {
      case 1:
        if (Array.isArray(args[0])) {
          subresources = args.shift();
        } else {
          filters = args.shift();
        }

        break;

      case 2:
        filters = args.shift();
        subresources = args.shift();

        break;

      default:
        break;
    }

    let url =
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games";

    if (filters) {
      Object.keys(filters).forEach(key => {
        url += `;${key}=${filters[key]}`;
      });
    }

    if ("string" == typeof subresources) {
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

      const games = gameHelper.parseCollection(
        data.fantasy_content.users[0].user[1].games,
        subresources
      );

      return cb(null, games);
    });
  }

  userFetch(...args) {
    // no filters...
    let gameKeys = args.shift(),
      subresources = [];
    const cb = args.pop();

    if (args.length) {
      subresources = args.pop();
    }

    let url =
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=";

    if ("string" === typeof gameKeys) {
      gameKeys = [gameKeys];
    }

    url += gameKeys.join(",");

    if (subresources.length) {
      url += `;out=${subresources.join(",")}`;
    }

    url += "?format=json";

    this.yf.api(this.yf.GET, url, (e, data) => {
      if (e) {
        return cb(e);
      }

      let user = data.fantasy_content.users[0].user[0];
      user.games = gameHelper.parseCollection(
        data.fantasy_content.users[0].user[1].games,
        subresources
      );

      return cb(null, user);
    });
  }
}

export default GamesCollection;
