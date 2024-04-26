import {
  mapLeagues,
  mapPlayers,
  mapWeeks,
  mapStatCategories,
  mapPositionTypes,
  mapRosterPositions,
} from "../helpers/gameHelper.js";

class GameResource {
  constructor(yf) {
    this.yf = yf;
  }

  /* gameKey can be game_key or league (ie/ nfl, mlb) */
  meta(gameKey, cb = () => {}) {
    return this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/metadata`
      )
      .then((data) => {
        const meta = data.fantasy_content.game[0];

        cb(null, meta);
        return meta;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  /* league key can be an array of keys */
  leagues(gameKey, leagueKey, cb = () => {}) {
    throw new Error(
      "game.leagues has been deprecated, please use league.meta for fetching league data"
    );
  }

  players(gameKey, playerKey, cb = () => {}) {
    throw new Error(
      "game.players has been deprecated, please use player.meta for fetching player data"
    );
  }

  game_weeks(gameKey, cb = () => {}) {
    return this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/game_weeks`
      )
      .then((data) => {
        const weeks = mapWeeks(data.fantasy_content.game[1].game_weeks);
        const game = data.fantasy_content.game[0];

        game.weeks = weeks;
        cb(null, game);
        return game;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  stat_categories(gameKey, cb = () => {}) {
    return this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/stat_categories`
      )
      .then((data) => {
        const stat_categories = mapStatCategories(
          data.fantasy_content.game[1].stat_categories.stats
        );
        const game = data.fantasy_content.game[0];

        game.stat_categories = stat_categories;
        cb(null, game);
        return game;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  position_types(gameKey, cb = () => {}) {
    return this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/position_types`
      )
      .then((data) => {
        const position_types = mapPositionTypes(
          data.fantasy_content.game[1].position_types
        );

        const game = data.fantasy_content.game[0];

        game.position_types = position_types;
        cb(null, game);
        return game;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  roster_positions(gameKey, cb = () => {}) {
    return this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/roster_positions`
      )
      .then((data) => {
        const roster_positions = mapRosterPositions(
          data.fantasy_content.game[1].roster_positions
        );

        const game = data.fantasy_content.game[0];

        game.roster_positions = roster_positions;
        cb(null, game);
        return game;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }
}

export default GameResource;
