import {
  mapLeagues,
  mapPlayers,
  mapWeeks,
  mapStatCategories,
  mapPositionTypes,
  mapRosterPositions
} from "../helpers/gameHelper.mjs";

class GameResource {
  constructor(yf) {
    this.yf = yf;
  }

  /* gameKey can be game_key or league (ie/ nfl, mlb) */
  meta(gameKey, cb) {
    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/metadata?format=json`,
      (e, data) => {
        if (e) {
          return cb(e);
        }

        const meta = data.fantasy_content.game[0];
        return cb(null, meta);
      }
    );
  }

  /* league key can be an array of keys */
  leagues(gameKey, leagueKey, cb) {
    if ("string" === typeof leagueKey) {
      leagueKey = [leagueKey];
    }

    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/leagues;league_keys=${leagueKey.join(
        ","
      )}?format=json`,
      (e, data) => {
        if (e) {
          return cb(e);
        }

        const leagues = mapLeagues(data.fantasy_content.game[1].leagues);
        const game = data.fantasy_content.game[0];

        game.leagues = leagues;

        return cb(null, game);
      }
    );
  }

  players(gameKey, playerKey, cb) {
    if ("string" === typeof playerKey) {
      playerKey = [playerKey];
    }

    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/players;player_keys=${playerKey.join(
        ","
      )}?format=json`,
      (e, data) => {
        if (e) {
          return cb(e);
        }

        const players = mapPlayers(data.fantasy_content.game[1].players);
        const game = data.fantasy_content.game[0];

        game.players = players;

        return cb(null, game);
      }
    );
  }

  game_weeks(gameKey, cb) {
    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/game_weeks?format=json`,
      (e, data) => {
        if (e) {
          return cb(e);
        }

        const weeks = mapWeeks(data.fantasy_content.game[1].game_weeks);
        const game = data.fantasy_content.game[0];

        game.weeks = weeks;

        return cb(null, game);
      }
    );
  }

  stat_categories(gameKey, cb) {
    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/stat_categories?format=json`,
      (e, data) => {
        if (e) {
          return cb(e);
        }

        const stat_categories = mapStatCategories(
          data.fantasy_content.game[1].stat_categories.stats
        );
        const game = data.fantasy_content.game[0];

        game.stat_categories = stat_categories;

        return cb(null, game);
      }
    );
  }

  position_types(gameKey, cb) {
    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/position_types?format=json`,
      (e, data) => {
        if (e) {
          return cb(e);
        }

        const position_types = mapPositionTypes(
          data.fantasy_content.game[1].position_types
        );

        const game = data.fantasy_content.game[0];

        game.position_types = position_types;

        return cb(null, game);
      }
    );
  }

  roster_positions(gameKey, cb) {
    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/roster_positions?format=json`,
      (e, data) => {
        if (e) {
          return cb(e);
        }

        const roster_positions = mapRosterPositions(
          data.fantasy_content.game[1].roster_positions
        );

        const game = data.fantasy_content.game[0];

        game.roster_positions = roster_positions;

        return cb(null, game);
      }
    );
  }
}

export default GameResource;
