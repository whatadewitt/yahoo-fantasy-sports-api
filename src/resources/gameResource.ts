import { YahooFantasyInstance, Callback } from '../types/core';
import { 
  Game, 
  GameWeek, 
  StatCategory, 
  PositionType, 
  RosterPosition,
  League,
  Player,
  FantasyContent 
} from '../types/api-responses';
import {
  mapLeagues,
  mapPlayers,
  mapWeeks,
  mapStatCategories,
  mapPositionTypes,
  mapRosterPositions,
} from '../helpers/gameHelper';

class GameResource {
  constructor(private yf: YahooFantasyInstance) {}

  // Method overloads for meta
  meta(gameKey: string): Promise<Game>;
  meta(gameKey: string, cb: Callback<Game>): void;
  meta(gameKey: string, cb?: Callback<Game>): Promise<Game> | void {
    const promise = this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/metadata`
      ) as Promise<FantasyContent<{ game: Game[] }>>;
    
    const resultPromise: Promise<Game> = promise.then((data) => {
      const meta = data.fantasy_content.game[0];
      if (!meta) {
        throw new Error('No game data found');
      }
      return meta;
    });

    if (cb) {
      resultPromise
        .then((meta) => cb(null, meta))
        .catch((e) => cb(e));
      return;
    } else {
      return resultPromise;
    }
  }

  // Method overloads for leagues (deprecated)
  leagues(gameKey: string, leagueKeys: string[]): Promise<Game & { leagues: League[] }>;
  leagues(gameKey: string, leagueKeys: string[], cb: Callback<Game & { leagues: League[] }>): void;
  leagues(gameKey: string, leagueKeys: string | string[], cb?: Callback<Game & { leagues: League[] }>): Promise<Game & { leagues: League[] }> | void {
    console.warn(
      "WARNING: game.leagues will be DEPRECATED in an upcoming release, you can use league.meta to retrieve the same information (or more) with less params."
    );
    
    // Normalize to array
    const keys = typeof leagueKeys === 'string' ? [leagueKeys] : leagueKeys;

    const promise = (this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/leagues;league_keys=${keys.join(",")}`
      ) as Promise<FantasyContent<{ game: any[] }>>)
      .then((data) => {
        const leagues = mapLeagues(data.fantasy_content.game[1].leagues);
        const game = data.fantasy_content.game[0] as Game;

        return { ...game, leagues };
      });

    if (cb) {
      promise
        .then(result => cb(null, result))
        .catch(e => cb(e));
      return;
    } else {
      return promise;
    }
  }

  // Method overloads for players (deprecated)
  players(gameKey: string, playerKeys: string[]): Promise<Game & { players: Player[] }>;
  players(gameKey: string, playerKeys: string[], cb: Callback<Game & { players: Player[] }>): void;
  players(gameKey: string, playerKeys: string | string[], cb?: Callback<Game & { players: Player[] }>): Promise<Game & { players: Player[] }> | void {
    console.warn(
      "WARNING: game.players will be DEPRECATED in an upcoming release, you can use player.meta to retrieve the same information (or more) with less params."
    );
    
    // Normalize to array
    const keys = typeof playerKeys === 'string' ? [playerKeys] : playerKeys;

    const promise = (this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/players;player_keys=${keys.join(",")}`
      ) as Promise<FantasyContent<{ game: any[] }>>)
      .then((data) => {
        const players = mapPlayers(data.fantasy_content.game[1].players);
        const game = data.fantasy_content.game[0] as Game;

        return { ...game, players };
      });

    if (cb) {
      promise
        .then(result => cb(null, result))
        .catch(e => cb(e));
      return;
    } else {
      return promise;
    }
  }

  // Method overloads for game_weeks
  game_weeks(gameKey: string): Promise<Game & { weeks: GameWeek[] }>;
  game_weeks(gameKey: string, cb: Callback<Game & { weeks: GameWeek[] }>): void;
  game_weeks(gameKey: string, cb?: Callback<Game & { weeks: GameWeek[] }>): Promise<Game & { weeks: GameWeek[] }> | void {
    const promise = (this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/game_weeks`
      ) as Promise<FantasyContent<{ game: any[] }>>)
      .then((data) => {
        const weeks = mapWeeks(data.fantasy_content.game[1].game_weeks);
        const game = data.fantasy_content.game[0] as Game;

        return { ...game, weeks };
      });

    if (cb) {
      promise
        .then(result => cb(null, result))
        .catch(e => cb(e));
      return;
    } else {
      return promise;
    }
  }

  // Alias for consistency with interface
  weeks(gameKey: string): Promise<GameWeek[]>;
  weeks(gameKey: string, cb: Callback<GameWeek[]>): void;
  weeks(gameKey: string, cb?: Callback<GameWeek[]>): Promise<GameWeek[]> | void {
    const resultPromise = this.game_weeks(gameKey) as Promise<Game & { weeks: GameWeek[] }>;
    const promise = resultPromise.then(result => result.weeks);

    if (cb) {
      promise
        .then(weeks => cb(null, weeks))
        .catch(e => cb(e));
      return;
    } else {
      return promise;
    }
  }

  // Method overloads for stat_categories
  stat_categories(gameKey: string): Promise<Game & { stat_categories: StatCategory[] }>;
  stat_categories(gameKey: string, cb: Callback<Game & { stat_categories: StatCategory[] }>): void;
  stat_categories(gameKey: string, cb?: Callback<Game & { stat_categories: StatCategory[] }>): Promise<Game & { stat_categories: StatCategory[] }> | void {
    const promise = (this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/stat_categories`
      ) as Promise<FantasyContent<{ game: any[] }>>)
      .then((data) => {
        const stat_categories = mapStatCategories(
          data.fantasy_content.game[1].stat_categories.stats
        );
        const game = data.fantasy_content.game[0] as Game;

        return { ...game, stat_categories };
      });

    if (cb) {
      promise
        .then(result => cb(null, result))
        .catch(e => cb(e));
      return;
    } else {
      return promise;
    }
  }

  // Alias for consistency with interface
  statCategories(gameKey: string): Promise<StatCategory[]>;
  statCategories(gameKey: string, cb: Callback<StatCategory[]>): void;
  statCategories(gameKey: string, cb?: Callback<StatCategory[]>): Promise<StatCategory[]> | void {
    const resultPromise = this.stat_categories(gameKey) as Promise<Game & { stat_categories: StatCategory[] }>;
    const promise = resultPromise.then(result => result.stat_categories);

    if (cb) {
      promise
        .then(categories => cb(null, categories))
        .catch(e => cb(e));
      return;
    } else {
      return promise;
    }
  }

  // Method overloads for position_types
  position_types(gameKey: string): Promise<Game & { position_types: PositionType[] }>;
  position_types(gameKey: string, cb: Callback<Game & { position_types: PositionType[] }>): void;
  position_types(gameKey: string, cb?: Callback<Game & { position_types: PositionType[] }>): Promise<Game & { position_types: PositionType[] }> | void {
    const promise = (this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/position_types`
      ) as Promise<FantasyContent<{ game: any[] }>>)
      .then((data) => {
        const position_types = mapPositionTypes(
          data.fantasy_content.game[1].position_types
        );
        const game = data.fantasy_content.game[0] as Game;

        return { ...game, position_types };
      });

    if (cb) {
      promise
        .then(result => cb(null, result))
        .catch(e => cb(e));
      return;
    } else {
      return promise;
    }
  }

  // Alias for consistency with interface
  positionTypes(gameKey: string): Promise<PositionType[]>;
  positionTypes(gameKey: string, cb: Callback<PositionType[]>): void;
  positionTypes(gameKey: string, cb?: Callback<PositionType[]>): Promise<PositionType[]> | void {
    const resultPromise = this.position_types(gameKey) as Promise<Game & { position_types: PositionType[] }>;
    const promise = resultPromise.then(result => result.position_types);

    if (cb) {
      promise
        .then(types => cb(null, types))
        .catch(e => cb(e));
      return;
    } else {
      return promise;
    }
  }

  // Method overloads for roster_positions
  roster_positions(gameKey: string): Promise<Game & { roster_positions: RosterPosition[] }>;
  roster_positions(gameKey: string, cb: Callback<Game & { roster_positions: RosterPosition[] }>): void;
  roster_positions(gameKey: string, cb?: Callback<Game & { roster_positions: RosterPosition[] }>): Promise<Game & { roster_positions: RosterPosition[] }> | void {
    const promise = (this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/roster_positions`
      ) as Promise<FantasyContent<{ game: any[] }>>)
      .then((data) => {
        const roster_positions = mapRosterPositions(
          data.fantasy_content.game[1].roster_positions
        );
        const game = data.fantasy_content.game[0] as Game;

        return { ...game, roster_positions };
      });

    if (cb) {
      promise
        .then(result => cb(null, result))
        .catch(e => cb(e));
      return;
    } else {
      return promise;
    }
  }

  // Alias for consistency with interface
  rosterPositions(gameKey: string): Promise<RosterPosition[]>;
  rosterPositions(gameKey: string, cb: Callback<RosterPosition[]>): void;
  rosterPositions(gameKey: string, cb?: Callback<RosterPosition[]>): Promise<RosterPosition[]> | void {
    const resultPromise = this.roster_positions(gameKey) as Promise<Game & { roster_positions: RosterPosition[] }>;
    const promise = resultPromise.then(result => result.roster_positions);

    if (cb) {
      promise
        .then(positions => cb(null, positions))
        .catch(e => cb(e));
      return;
    } else {
      return promise;
    }
  }
}

export default GameResource;