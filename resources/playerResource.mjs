import {
  mapPlayer,
  mapStats,
  mapDraftAnalysis
} from "../helpers/playerHelper.mjs";

class PlayerResource {
  constructor(yf) {
    this.yf = yf;
  }

  /*
  * Includes player key, id, name, editorial information, image, eligible positions, etc.
  */
  meta(playerKey, cb) {
    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/player/${
        playerKey
      }/metadata?format=json`,
      (err, data) => {
        if (err) {
          return cb(err);
        }

        const meta = mapPlayer(data.fantasy_content.player[0]);
        return cb(null, meta);
      }
    );
  }

  /*
  * Player stats and points (if in a league context).
  */
  stats(playerKey, ...args) {
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/player/${
      playerKey
    }/stats`;

    const cb = args.pop();

    if (args.length) {
      url += `;type=week;week=${args.pop()}`;
    }

    url += "?format=json";
    console.log(url);
    this.yf.api(this.yf.GET, url, (err, data) => {
      if (err) {
        return cb(err);
      }

      const stats = mapStats(data.fantasy_content.player[1].player_stats);

      const player = mapPlayer(data.fantasy_content.player[0]);

      player.stats = stats;

      return cb(null, player);
    });
  }

  /*
  * Data about ownership percentage of the player
  */
  percent_owned(playerKey, cb) {
    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/player/${
        playerKey
      }/percent_owned?format=json`,
      (err, data) => {
        if (err) {
          return cb(err);
        }

        const percent_owned = data.fantasy_content.player[1].percent_owned[1];
        const player = mapPlayer(data.fantasy_content.player[0]);

        // TODO: do we need coverage type and/or delta????
        player.percent_owned = percent_owned.value;

        return cb(null, player);
      }
    );
  }

  /*
  * The player ownership status within a league (whether they're owned by a team, on waivers, or free agents). Only relevant within a league.
  */
  ownership(playerKey, leagueKey, cb) {
    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${
        leagueKey
      }/players;player_keys=${playerKey}/ownership?format=json`,
      (err, data) => {
        if (err) {
          return cb(err);
        }

        const league = data.fantasy_content.league[0];
        const player = mapPlayer(
          data.fantasy_content.league[1].players[0].player[0]
        );
        const status =
          data.fantasy_content.league[1].players[0].player[1].ownership;

        delete status[0];

        player.status = status;
        player.league = league;

        return cb(null, player);
      }
    );
  }

  /*
  * Average pick, Average round and Percent Drafted.
  */
  draft_analysis(playerKey, cb) {
    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/player/${
        playerKey
      }/draft_analysis?format=json`,
      (err, data) => {
        if (err) {
          return cb(err);
        }

        const draft_analysis = mapDraftAnalysis(
          data.fantasy_content.player[1].draft_analysis
        );
        const player = mapPlayer(data.fantasy_content.player[0]);

        player.draft_analysis = draft_analysis;

        return cb(null, player);
      }
    );
  }
}

export default PlayerResource;
