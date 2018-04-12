import { parseCollection } from "../helpers/gameHelper.mjs";
import { extractCallback } from "../helpers/argsParser.mjs";

class GamesCollection {
  constructor(yf) {
    this.yf = yf;
  }

  // params: game keys or filters, subresources (optional), callback
  fetch(...args) {
    let gameKeys = [],
      subresources = [],
      filters = {};
    const cb = extractCallback(args);

    if ("string" === typeof args[0]) {
      gameKeys = args.shift().split(",");
    } else {
      filters = args.shift();
    }

    if (args.length) {
      subresources = args.pop();

      // needs to be an array
      if ("string" === typeof subresources) {
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

    return this.yf.api(
      {
        method: this.yf.GET,
        url,
        responseMapper: data => parseCollection(data.fantasy_content.games, subresources)
      }, 
      cb);
  }

  user(...args) {
    // no gamekeys...
    let subresources = [],
      filters = false;
    const cb = extractCallback(args);

    switch (args.length) {
      case 1:
        if (Array.isArray(args[0])) {
          subresources = args.shift().split(",");
        } else {
          filters = args.shift();
        }

        break;

      case 2:
        filters = args.shift();
        subresources = args.shift().split(",");

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

    if (subresources.length) {
      url += `;out=${subresources.join(",")}`;
    }

    url += "?format=json";

    return this.yf.api(
      {
        method: this.yf.GET,
        url,
        responseMapper: data => parseCollection(
          data.fantasy_content.users[0].user[1].games,
          subresources
        )
      }, 
      cb);
  }

  userFetch(...args) {
    // no filters...
    let gameKeys = args.shift().split(","),
      subresources = [];
    const cb = extractCallback(args);

    if (args.length) {
      subresources = args.pop();
    }

    let url =
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=";

    url += gameKeys.join(",");

    if (subresources.length) {
      url += `;out=${subresources.join(",")}`;
    }

    url += "?format=json";

    return this.yf.api(
      {
        method: this.yf.GET,
        url,
        responseMapper: data => {
          let user = data.fantasy_content.users[0].user[0];
          user.games = parseCollection(
            data.fantasy_content.users[0].user[1].games,
            subresources
          );

          return user;
        }
      }, 
      cb);
  }
}

export default GamesCollection;
