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
    return this.yf.api(
      {
        method: this.yf.GET,
        url: `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/metadata?format=json`,
        responseMapper: data => data.fantasy_content.game[0]
      }, 
      cb);
  }

  /* league key can be an array of keys */
  leagues(gameKey, leagueKey, cb) {
    // TODO: can this be cleaned up?
    if ("string" === typeof leagueKey) {
      leagueKey = [leagueKey];
    }

    return this.yf.api(
      {
        method: this.yf.GET,
        url: `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/leagues;league_keys=${leagueKey.join(
          ","
        )}?format=json`,
        responseMapper: data => {  
          const leagues = mapLeagues(data.fantasy_content.game[1].leagues);
          const game = data.fantasy_content.game[0];
  
          game.leagues = leagues;
  
          return game;
        }
      }, 
      cb);
  }

  players(gameKey, playerKey, cb) {
    // TODO: can this be cleaned up?
    if ("string" === typeof playerKey) {
      playerKey = [playerKey];
    }

    return this.yf.api(
      {
        method: this.yf.GET,
        url: `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/players;player_keys=${playerKey.join(
          ","
        )}?format=json`,
        responseMapper: data => {  
          const players = mapPlayers(data.fantasy_content.game[1].players);
          const game = data.fantasy_content.game[0];
  
          game.players = players;
          
          return game;
        }
      }, 
      cb);
  }

  game_weeks(gameKey, cb) {
    return this.yf.api(
      {
        method: this.yf.GET,
        url: `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/game_weeks?format=json`,
        responseMapper: data => {  
          const weeks = mapWeeks(data.fantasy_content.game[1].game_weeks);
          const game = data.fantasy_content.game[0];
  
          game.weeks = weeks;
          
          return game;
        }
      }, 
      cb);
  }

  stat_categories(gameKey, cb) {
    return this.yf.api(
      {
        method: this.yf.GET,
        url: `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/stat_categories?format=json`,
        responseMapper: data => {
          const stat_categories = mapStatCategories(
            data.fantasy_content.game[1].stat_categories.stats
          );
          const game = data.fantasy_content.game[0];
  
          game.stat_categories = stat_categories;
          
          return game;
        }
      }, 
      cb);
  }

  position_types(gameKey, cb) {
    return this.yf.api(
      {
        method: this.yf.GET,
        url: `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/position_types?format=json`,
        responseMapper: data => {
          const position_types = mapPositionTypes(
            data.fantasy_content.game[1].position_types
          );
  
          const game = data.fantasy_content.game[0];
  
          game.position_types = position_types;
          
          return game;
        }
      }, 
      cb);
  }

  roster_positions(gameKey, cb) {
    return this.yf.api(
      {
        method: this.yf.GET,
        url: `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/roster_positions?format=json`,
        responseMapper: data => {
          const roster_positions = mapRosterPositions(
            data.fantasy_content.game[1].roster_positions
          );
  
          const game = data.fantasy_content.game[0];
  
          game.roster_positions = roster_positions;
          
          return game;
        }
      }, 
      cb);
  }
}

export default GameResource;
