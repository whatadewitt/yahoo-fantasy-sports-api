import { YahooFantasyInstance, Callback } from "../types/core";
import {
  Game,
  GameWeek,
  StatCategory,
  PositionType,
  RosterPosition,
} from "../types/api-responses";
import {
  mapWeeks,
  mapStatCategories,
  mapPositionTypes,
  mapRosterPositions,
} from "../helpers/gameHelper";
import { getAndMap, withCallback } from "../helpers/requestHelper";

type GameResult<TName extends string, TValue> = Game & Record<TName, TValue>;

class GameResource {
  constructor(public yf: YahooFantasyInstance) {}

  private gameSubresource<TName extends string, TValue>(
    gameKey: string,
    resource: string,
    propertyName: TName,
    mapper: (resourceData: any) => TValue,
    cb?: Callback<GameResult<TName, TValue>>,
  ): Promise<GameResult<TName, TValue>> | void {
    return getAndMap(
      this.yf,
      `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/${resource}`,
      (data) => {
        const gameData = data.fantasy_content.game;
        return {
          ...(gameData[0] as Game),
          [propertyName]: mapper(gameData[1]),
        } as GameResult<TName, TValue>;
      },
      cb,
    );
  }

  private aliasSubresource<T>(
    promise: Promise<any>,
    propertyName: string,
    cb?: Callback<T>,
  ): Promise<T> | void {
    return withCallback(
      promise.then((result) => result[propertyName] as T),
      cb,
    );
  }

  // Method overloads for meta
  meta(gameKey: string): Promise<Game>;
  meta(gameKey: string, cb: Callback<Game>): void;
  meta(gameKey: string, cb?: Callback<Game>): Promise<Game> | void {
    return getAndMap(
      this.yf,
      `https://fantasysports.yahooapis.com/fantasy/v2/game/${gameKey}/metadata`,
      (data) => {
        const meta = data.fantasy_content.game[0];
        if (!meta) {
          throw new Error("No game data found");
        }
        return meta;
      },
      cb,
    );
  }

  // REMOVED: game.leagues method (deprecated)
  // Use league.meta() instead for retrieving league information

  // REMOVED: game.players method (deprecated)
  // Use player.meta() instead for retrieving player information

  // Method overloads for game_weeks
  game_weeks(gameKey: string): Promise<Game & { weeks: GameWeek[] }>;
  game_weeks(gameKey: string, cb: Callback<Game & { weeks: GameWeek[] }>): void;
  game_weeks(
    gameKey: string,
    cb?: Callback<Game & { weeks: GameWeek[] }>,
  ): Promise<Game & { weeks: GameWeek[] }> | void {
    return this.gameSubresource(
      gameKey,
      "game_weeks",
      "weeks",
      (data) => mapWeeks(data.game_weeks),
      cb,
    );
  }

  // Alias for consistency with interface
  weeks(gameKey: string): Promise<GameWeek[]>;
  weeks(gameKey: string, cb: Callback<GameWeek[]>): void;
  weeks(
    gameKey: string,
    cb?: Callback<GameWeek[]>,
  ): Promise<GameWeek[]> | void {
    const resultPromise = this.game_weeks(gameKey) as Promise<
      Game & { weeks: GameWeek[] }
    >;
    return this.aliasSubresource(resultPromise, "weeks", cb);
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
    return this.gameSubresource(
      gameKey,
      "stat_categories",
      "stat_categories",
      (data) => mapStatCategories(data.stat_categories.stats),
      cb,
    );
  }

  // Alias for consistency with interface
  statCategories(gameKey: string): Promise<StatCategory[]>;
  statCategories(gameKey: string, cb: Callback<StatCategory[]>): void;
  statCategories(
    gameKey: string,
    cb?: Callback<StatCategory[]>,
  ): Promise<StatCategory[]> | void {
    const resultPromise = this.stat_categories(gameKey) as Promise<
      Game & { stat_categories: StatCategory[] }
    >;
    return this.aliasSubresource(resultPromise, "stat_categories", cb);
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
    return this.gameSubresource(
      gameKey,
      "position_types",
      "position_types",
      (data) => mapPositionTypes(data.position_types),
      cb,
    );
  }

  // Alias for consistency with interface
  positionTypes(gameKey: string): Promise<PositionType[]>;
  positionTypes(gameKey: string, cb: Callback<PositionType[]>): void;
  positionTypes(
    gameKey: string,
    cb?: Callback<PositionType[]>,
  ): Promise<PositionType[]> | void {
    const resultPromise = this.position_types(gameKey) as Promise<
      Game & { position_types: PositionType[] }
    >;
    return this.aliasSubresource(resultPromise, "position_types", cb);
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
    return this.gameSubresource(
      gameKey,
      "roster_positions",
      "roster_positions",
      (data) => mapRosterPositions(data.roster_positions),
      cb,
    );
  }

  // Alias for consistency with interface
  rosterPositions(gameKey: string): Promise<RosterPosition[]>;
  rosterPositions(gameKey: string, cb: Callback<RosterPosition[]>): void;
  rosterPositions(
    gameKey: string,
    cb?: Callback<RosterPosition[]>,
  ): Promise<RosterPosition[]> | void {
    const resultPromise = this.roster_positions(gameKey) as Promise<
      Game & { roster_positions: RosterPosition[] }
    >;
    return this.aliasSubresource(resultPromise, "roster_positions", cb);
  }
}

export default GameResource;
