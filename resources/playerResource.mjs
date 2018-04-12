import {
  mapPlayer,
  mapStats,
  mapDraftAnalysis
} from "../helpers/playerHelper.mjs";
import { extractCallback } from "../helpers/argsParser.mjs";

class PlayerResource {
  constructor(yf) {
    this.yf = yf;
  }

  /*
  * Includes player key, id, name, editorial information, image, eligible positions, etc.
  */
  meta(playerKey, cb) {
    return this.yf.api(
      {
        method: this.yf.GET,
        url: `https://fantasysports.yahooapis.com/fantasy/v2/player/${playerKey}/metadata?format=json`,
        responseMapper: data => {
          const meta = mapPlayer(data.fantasy_content.player[0]);
          return meta;
        }
      }, 
      cb);
  }

  /*
  * Player stats and points (if in a league context).
  */
  stats(playerKey, ...args) {
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/player/${playerKey}/stats`;

    const cb = extractCallback(args);

    if (args.length) {
      url += `;type=week;week=${args.pop()}`;
    }

    url += "?format=json";
    console.log(url);
    return this.yf.api(
      {
        method: this.yf.GET, 
        url,
        responseMapper: data => {
          const stats = mapStats(data.fantasy_content.player[1].player_stats);

          const player = mapPlayer(data.fantasy_content.player[0]);

          player.stats = stats;

          return player;
        }
      }, 
      cb);
  }

  /*
  * Data about ownership percentage of the player
  */
  percent_owned(playerKey, cb) {
    return this.yf.api(
      {
        method: this.yf.GET,
        url: `https://fantasysports.yahooapis.com/fantasy/v2/player/${playerKey}/percent_owned?format=json`,
        responseMapper: data => {
          const percent_owned = data.fantasy_content.player[1].percent_owned[1];
          const player = mapPlayer(data.fantasy_content.player[0]);

          // TODO: do we need coverage type and/or delta????
          player.percent_owned = percent_owned.value;

          return player;
        }
      }, 
      cb);
  }

  /*
  * The player ownership status within a league (whether they're owned by a team, on waivers, or free agents). Only relevant within a league.
  */
  ownership(playerKey, leagueKey, cb) {
    return this.yf.api(
      {
        method: this.yf.GET,
        url: `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/players;player_keys=${playerKey}/ownership?format=json`,
        responseMapper: data => {
          const league = data.fantasy_content.league[0];
          const player = mapPlayer(
            data.fantasy_content.league[1].players[0].player[0]
          );
          const status =
            data.fantasy_content.league[1].players[0].player[1].ownership;

          delete status[0];

          player.status = status;
          player.league = league;

          return player;
        }
      }, 
      cb);
  }

  /*
  * Average pick, Average round and Percent Drafted.
  */
  draft_analysis(playerKey, cb) {
    return this.yf.api(
      {
        method: this.yf.GET,
        url: `https://fantasysports.yahooapis.com/fantasy/v2/player/${playerKey}/draft_analysis?format=json`,
        responseMapper: data => {
          const draft_analysis = mapDraftAnalysis(
            data.fantasy_content.player[1].draft_analysis
          );
          const player = mapPlayer(data.fantasy_content.player[0]);

          player.draft_analysis = draft_analysis;

          return player;
        }
      }, 
      cb);
  }
}

export default PlayerResource;
