import { toCallbackOrPromise } from '../helpers/argsParser';
import {
  mapPositionTypes,
  mapRosterPositions,
  mapStatCategories,
  mapWeeks,
} from '../helpers/gameHelper';
import type {
  FantasyContent,
  Game,
  GameDates,
  GameWeek,
  PositionType,
  RosterPosition,
  StatCategory,
} from '../types/api-responses';
import type { Callback, YahooFantasyInstance } from '../types/core';

class GameResource {
  constructor(public yf: YahooFantasyInstance) {}

  // Method overloads for meta
  meta(gameKey: string): Promise<Game>;
  meta(gameKey: string, cb: Callback<Game>): void;
  meta(gameKey: string, cb?: Callback<Game>): Promise<Game> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/metadata`,
    ) as Promise<FantasyContent<{ game: Game[] }>>;

    const resultPromise: Promise<Game> = promise.then((data) => {
      const meta = data.fantasy_content.game[0];
      if (!meta) {
        throw new Error('No game data found');
      }
      return meta;
    });

    return toCallbackOrPromise(resultPromise, cb);
  }

  // REMOVED: game.leagues method (deprecated)
  // Use league.meta() instead for retrieving league information

  // REMOVED: game.players method (deprecated)
  // Use player.meta() instead for retrieving player information

  // Method overloads for dates
  dates(gameKey: string): Promise<Game & { dates: GameDates }>;
  dates(gameKey: string, cb: Callback<Game & { dates: GameDates }>): void;
  dates(
    gameKey: string,
    cb?: Callback<Game & { dates: GameDates }>,
  ): Promise<Game & { dates: GameDates }> | void {
    const promise = (
      this.yf.api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/dates`,
      ) as Promise<FantasyContent<{ game: any[] }>>
    ).then((data) => {
      const dates = data.fantasy_content.game[1].dates as GameDates;
      const game = data.fantasy_content.game[0] as Game;

      return { ...game, dates };
    });

    return toCallbackOrPromise(promise, cb);
  }

  // Method overloads for game_weeks
  game_weeks(gameKey: string): Promise<Game & { weeks: GameWeek[] }>;
  game_weeks(gameKey: string, cb: Callback<Game & { weeks: GameWeek[] }>): void;
  game_weeks(
    gameKey: string,
    cb?: Callback<Game & { weeks: GameWeek[] }>,
  ): Promise<Game & { weeks: GameWeek[] }> | void {
    const promise = (
      this.yf.api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/game_weeks`,
      ) as Promise<FantasyContent<{ game: any[] }>>
    ).then((data) => {
      const weeks = mapWeeks(data.fantasy_content.game[1].game_weeks);
      const game = data.fantasy_content.game[0] as Game;

      return { ...game, weeks };
    });

    return toCallbackOrPromise(promise, cb);
  }

  // Method overloads for stat_categories
  stat_categories(
    gameKey: string,
  ): Promise<Game & { stat_categories: StatCategory[] }>;
  stat_categories(
    gameKey: string,
    cb: Callback<Game & { stat_categories: StatCategory[] }>,
  ): void;
  stat_categories(
    gameKey: string,
    cb?: Callback<Game & { stat_categories: StatCategory[] }>,
  ): Promise<Game & { stat_categories: StatCategory[] }> | void {
    const promise = (
      this.yf.api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/stat_categories`,
      ) as Promise<FantasyContent<{ game: any[] }>>
    ).then((data) => {
      const stat_categories = mapStatCategories(
        data.fantasy_content.game[1].stat_categories.stats,
      );
      const game = data.fantasy_content.game[0] as Game;

      return { ...game, stat_categories };
    });

    return toCallbackOrPromise(promise, cb);
  }

  // Method overloads for position_types
  position_types(
    gameKey: string,
  ): Promise<Game & { position_types: PositionType[] }>;
  position_types(
    gameKey: string,
    cb: Callback<Game & { position_types: PositionType[] }>,
  ): void;
  position_types(
    gameKey: string,
    cb?: Callback<Game & { position_types: PositionType[] }>,
  ): Promise<Game & { position_types: PositionType[] }> | void {
    const promise = (
      this.yf.api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/position_types`,
      ) as Promise<FantasyContent<{ game: any[] }>>
    ).then((data) => {
      const position_types = mapPositionTypes(
        data.fantasy_content.game[1].position_types,
      );
      const game = data.fantasy_content.game[0] as Game;

      return { ...game, position_types };
    });

    return toCallbackOrPromise(promise, cb);
  }

  // Method overloads for roster_positions
  roster_positions(
    gameKey: string,
  ): Promise<Game & { roster_positions: RosterPosition[] }>;
  roster_positions(
    gameKey: string,
    cb: Callback<Game & { roster_positions: RosterPosition[] }>,
  ): void;
  roster_positions(
    gameKey: string,
    cb?: Callback<Game & { roster_positions: RosterPosition[] }>,
  ): Promise<Game & { roster_positions: RosterPosition[] }> | void {
    const promise = (
      this.yf.api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/roster_positions`,
      ) as Promise<FantasyContent<{ game: any[] }>>
    ).then((data) => {
      const roster_positions = mapRosterPositions(
        data.fantasy_content.game[1].roster_positions,
      );
      const game = data.fantasy_content.game[0] as Game;

      return { ...game, roster_positions };
    });

    return toCallbackOrPromise(promise, cb);
  }
}

export default GameResource;
