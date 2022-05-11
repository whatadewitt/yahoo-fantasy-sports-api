import {
  mapPlayer,
  mapStats,
  mapDraftAnalysis,
} from "../helpers/playerHelper.mjs";

import { extractCallback } from "../helpers/argsParser.mjs";

class PlayerResource {
  constructor(yf) {
    this.yf = yf;
  }

  /*
   * Includes player key, id, name, editorial information, image, eligible positions, etc.
   */
  meta(playerKey, cb = () => {}) {
    return this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/player/${playerKey}/metadata`
      )
      .then((data) => {
        const meta = mapPlayer(data.fantasy_content.player[0]);
        cb(null, meta);
        return meta;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  /*
   * Player stats and points (if in a league context).
   */
  stats(playerKey, ...args) {
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/player/${playerKey}/stats`;
    const cb = extractCallback(args);

    let dateType;
    if (args.length) {
      const date = args.pop();
      // TODO: I could get more clever here, but need it working first...
      if (date.indexOf("-") > 0) {
        dateType = "date";
        // string is date, of format y-m-d
        url += `;type=date;date=${date}`;
      } else {
        dateType = "week";
        // number is week...
        url += `;type=week;week=${date}`;
      }
    }

    return this.yf
      .api(this.yf.GET, url)
      .then((data) => {
        let stats;
        const player = mapPlayer(data.fantasy_content.player[0]);

        if (data.fantasy_content.player.length > 1) {
          stats = mapStats(data.fantasy_content.player[1].player_stats);
        } else {
          const gameKey = playerKey.split(".")[0];
          stats = `Cannot retrieve player stats of type '${dateType}' for game '${gameKey}'`;
        }

        player.stats = stats;
        cb(null, player);
        return player;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  /*
   * Data about ownership percentage of the player
   */
  percent_owned(playerKey, cb = () => {}) {
    return this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/player/${playerKey}/percent_owned`
      )
      .then((data) => {
        const percent_owned = data.fantasy_content.player[1].percent_owned[1];
        const player = mapPlayer(data.fantasy_content.player[0]);

        // TODO: do we need coverage type and/or delta????
        player.percent_owned = percent_owned.value;
        cb(null, player);
        return player;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  /*
   * The player ownership status within a league (whether they're owned by a team, on waivers, or free agents). Only relevant within a league.
   */
  ownership(playerKey, leagueKey, cb = () => {}) {
    return this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/players;player_keys=${playerKey}/ownership`
      )
      .then((data) => {
        const league = data.fantasy_content.league[0];
        const player = mapPlayer(
          data.fantasy_content.league[1].players[0].player[0]
        );
        const status =
          data.fantasy_content.league[1].players[0].player[1].ownership;

        delete status[0];

        player.status = status;
        player.league = league;
        cb(null, player);
        return player;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  /*
   * Average pick, Average round and Percent Drafted.
   */
  draft_analysis(playerKey, cb = () => {}) {
    return this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/player/${playerKey}/draft_analysis`
      )
      .then((data) => {
        const draft_analysis = mapDraftAnalysis(
          data.fantasy_content.player[1].draft_analysis
        );
        const player = mapPlayer(data.fantasy_content.player[0]);

        player.draft_analysis = draft_analysis;
        cb(null, player);
        return player;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }
}

export default PlayerResource;
