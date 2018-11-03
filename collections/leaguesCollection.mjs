import { parseCollection } from "../helpers/leagueHelper.mjs";

import { extractCallback } from "../helpers/argsParser.mjs";

class LeaguesCollection {
  constructor(yf) {
    this.yf = yf;
  }

  fetch(...args) {
    let leagueKeys = args.shift(),
      subresources = args.length > 1 ? args.shift() : [];
    const cb = extractCallback(args);

    if (!Array.isArray(leagueKeys)) {
      leagueKeys = [leagueKeys];
    }

    let url =
      "https://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=";

    url += leagueKeys.join(",");

    if ("string" === typeof subresources) {
      subresources = [subresources];
    }

    if (subresources.length > 0) {
      url += `;out=${subresources.join(",")}`;
    }

    url += "?format=json";

    return this.yf.api(this.yf.GET, url)
      .then(data => {
        const leagues = parseCollection(
          data.fantasy_content.leagues,
          subresources
        );

        cb(null, leagues); 
        return leagues; 
      })
      .catch(e => { 
        cb(e);
        throw e;
      });
  }
}

export default LeaguesCollection;
