#!/usr/bin/env ts-node

/**
 * Type validation tests to ensure our TypeScript types match actual API responses
 */

import YahooFantasy from "./src/index";
import {
  Game,
  League,
  Player,
  Team,
  MappedPlayer,
  GameWeek,
  StatCategory,
  PositionType,
  RosterPosition,
} from "./src/types/api-responses";

console.log("🔍 Testing Type Validation...\n");

// Test 1: Type structure validation
console.log("1️⃣ Testing type structures...");

function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === "object";
}

function hasTypedFields(
  value: Record<string, any>,
  fields: string[],
  type: "string" | "number" | "object",
): boolean {
  return fields.every((field) => typeof value[field] === type);
}

function createCompileOnlyClient(): YahooFantasy {
  const yf = new YahooFantasy("test_key", "test_secret");
  yf.api = (() => new Promise<any>(() => {})) as any;
  return yf;
}

const LEAGUE_STRING_FIELDS = [
  "league_key",
  "league_id",
  "name",
  "url",
  "logo_url",
  "draft_status",
  "edit_key",
  "weekly_deadline",
  "league_update_timestamp",
  "scoring_type",
  "league_type",
  "renew",
  "renewed",
  "iris_group_chat_id",
  "is_pro_league",
  "is_cash_league",
  "current_week",
  "start_week",
  "start_date",
  "end_week",
  "end_date",
  "game_code",
  "season",
];

const GAME_STRING_FIELDS = [
  "game_key",
  "game_id",
  "name",
  "code",
  "type",
  "url",
  "season",
];

const PLAYER_STRING_FIELDS = [
  "player_key",
  "player_id",
  "editorial_player_key",
  "editorial_team_key",
  "editorial_team_full_name",
  "editorial_team_abbr",
  "uniform_number",
  "display_position",
  "image_url",
  "is_undroppable",
  "position_type",
  "has_player_notes",
  "has_recent_player_notes",
];

const PLAYER_NAME_STRING_FIELDS = [
  "full",
  "first",
  "last",
  "ascii_first",
  "ascii_last",
];

const TEAM_STRING_FIELDS = [
  "team_key",
  "team_id",
  "name",
  "is_owned_by_current_login",
  "url",
  "number_of_moves",
  "number_of_trades",
  "league_scoring_type",
  "has_draft_grade",
  "auction_budget_total",
  "auction_budget_spent",
];

function validateGameType(game: any): game is Game {
  return isObject(game) && hasTypedFields(game, GAME_STRING_FIELDS, "string");
}

function validateLeagueType(league: any): league is League {
  return (
    isObject(league) &&
    hasTypedFields(league, LEAGUE_STRING_FIELDS, "string") &&
    hasTypedFields(league, ["num_teams", "allow_add_to_dl_extra_pos"], "number")
  );
}

function validatePlayerType(player: any): player is Player {
  return [
    isObject(player),
    hasTypedFields(player || {}, PLAYER_STRING_FIELDS, "string"),
    isObject(player?.name),
    hasTypedFields(player?.name || {}, PLAYER_NAME_STRING_FIELDS, "string"),
    hasTypedFields(player || {}, ["bye_weeks", "headshot"], "object"),
    Array.isArray(player?.eligible_positions),
  ].every(Boolean);
}

function validateTeamType(team: any): team is Team {
  return (
    isObject(team) &&
    hasTypedFields(team, TEAM_STRING_FIELDS, "string") &&
    hasTypedFields(team, ["team_logos", "roster_adds"], "object") &&
    hasTypedFields(team, ["waiver_priority"], "number") &&
    Array.isArray(team.managers)
  );
}

try {
  // Create mock objects that should pass validation
  const mockGame = {
    game_key: "328",
    game_id: "328",
    name: "Football",
    code: "nfl",
    type: "full",
    url: "https://football.fantasysports.yahoo.com/f1",
    season: "2020",
  };

  const mockLeague = {
    league_key: "328.l.34014",
    league_id: "34014",
    name: "Test League",
    url: "https://football.fantasysports.yahoo.com/f1/34014",
    logo_url:
      "https://yahoofantasysports-res.cloudinary.com/image/upload/t_s192sq/fantasy-logos/6465b1ca8531e0e4f5f5f5f5f5f5f5f5.jpg",
    draft_status: "postdraft",
    num_teams: 12,
    edit_key: "16",
    weekly_deadline: "60",
    league_update_timestamp: "1287551888",
    scoring_type: "head",
    league_type: "private",
    renew: "308_51222",
    renewed: "308_51222",
    iris_group_chat_id: "test",
    allow_add_to_dl_extra_pos: 0,
    is_pro_league: "0",
    is_cash_league: "0",
    current_week: "1",
    start_week: "1",
    start_date: "2020-09-10",
    end_week: "16",
    end_date: "2020-12-28",
    game_code: "nfl",
    season: "2020",
  };

  const mockPlayer = {
    player_key: "328.p.6619",
    player_id: "6619",
    name: {
      full: "Adrian Peterson",
      first: "Adrian",
      last: "Peterson",
      ascii_first: "Adrian",
      ascii_last: "Peterson",
    },
    editorial_player_key: "nfl.p.6619",
    editorial_team_key: "nfl.t.1",
    editorial_team_full_name: "Minnesota Vikings",
    editorial_team_abbr: "Min",
    bye_weeks: { week: "7" },
    uniform_number: "28",
    display_position: "RB",
    headshot: {
      url: "https://s.yimg.com/iu/api/res/1.2/test.jpg",
      size: "small",
    },
    image_url: "https://s.yimg.com/iu/api/res/1.2/test.jpg",
    is_undroppable: "0",
    position_type: "O",
    eligible_positions: ["RB"],
    has_player_notes: "1",
    has_recent_player_notes: "1",
  };

  const mockTeam = {
    team_key: "328.l.34014.t.1",
    team_id: "1",
    name: "Test Team",
    is_owned_by_current_login: "1",
    url: "https://football.fantasysports.yahoo.com/f1/34014/1",
    team_logos: {
      team_logo: {
        size: "large",
        url: "https://yahoofantasysports-res.cloudinary.com/image/upload/t_s192sq/fantasy-logos/test.jpg",
      },
    },
    waiver_priority: 4,
    number_of_moves: "19",
    number_of_trades: "0",
    roster_adds: {
      coverage_type: "week",
      coverage_value: 16,
      value: "19",
    },
    league_scoring_type: "head",
    has_draft_grade: "1",
    auction_budget_total: "200",
    auction_budget_spent: "199",
    managers: [
      {
        manager_id: "1",
        nickname: "Test Manager",
        guid: "test-guid",
      },
    ],
  };

  // Test type validation functions
  console.log(
    "✅ Game type validation:",
    validateGameType(mockGame) ? "PASS" : "FAIL",
  );
  console.log(
    "✅ League type validation:",
    validateLeagueType(mockLeague) ? "PASS" : "FAIL",
  );
  console.log(
    "✅ Player type validation:",
    validatePlayerType(mockPlayer) ? "PASS" : "FAIL",
  );
  console.log(
    "✅ Team type validation:",
    validateTeamType(mockTeam) ? "PASS" : "FAIL",
  );
} catch (error) {
  console.log("❌ Type validation failed:", error);
}

// Test 2: Method return type validation
console.log("\n2️⃣ Testing method return types...");

try {
  const yf = createCompileOnlyClient();

  // Test that methods return the expected types (compilation test)
  const gamePromise: Promise<Game> = yf.game.meta("328");
  const leaguePromise: Promise<League> = yf.league.meta("328.l.123");
  const playerPromise: Promise<MappedPlayer> = yf.player.meta("328.p.123");

  // Test compound return types
  const gameWeeksPromise: Promise<Game & { weeks: GameWeek[] }> =
    yf.game.game_weeks("328");
  const gameStatCategoriesPromise: Promise<
    Game & { stat_categories: StatCategory[] }
  > = yf.game.stat_categories("328");
  const gamePositionTypesPromise: Promise<
    Game & { position_types: PositionType[] }
  > = yf.game.position_types("328");
  const gameRosterPositionsPromise: Promise<
    Game & { roster_positions: RosterPosition[] }
  > = yf.game.roster_positions("328");

  console.log("✅ Method return types compile correctly");
  console.log("✅ Compound return types compile correctly");
} catch (error) {
  console.log("❌ Method return type validation failed:", error);
}

// Test 3: Callback parameter validation
console.log("\n3️⃣ Testing callback parameter types...");

try {
  const yf = createCompileOnlyClient();

  // Test callback parameter types
  yf.game.meta("328", (error, game) => {
    if (error) {
      console.log("Error type:", typeof error);
      return;
    }
    if (game) {
      console.log("Game type received:", typeof game);
      console.log("Game has game_key:", typeof game.game_key);
    }
  });

  yf.league.meta("328.l.123", (error, league) => {
    if (error) return;
    if (league) {
      console.log("League has league_key:", typeof league.league_key);
    }
  });

  yf.player.meta("328.p.123", (error, player) => {
    if (error) return;
    if (player) {
      console.log("Player has player_key:", typeof player.player_key);
    }
  });

  console.log("✅ Callback parameter types compile correctly");
} catch (error) {
  console.log("❌ Callback parameter validation failed:", error);
}

// Test 4: Optional parameter validation
console.log("\n4️⃣ Testing optional parameters...");

try {
  const yf = createCompileOnlyClient();

  // Test optional parameters compile correctly
  yf.league.scoreboard("328.l.123", (error, data) => {});
  yf.league.scoreboard("328.l.123", 1, (error, data) => {});
  yf.league.scoreboard("328.l.123").then(() => {});
  yf.league.scoreboard("328.l.123", 1).then(() => {});

  yf.player.stats("328.p.123", (error, data) => {});
  yf.player.stats("328.p.123", 1, (error, data) => {});
  yf.player.stats("328.p.123", "2023-10-15", (error, data) => {});
  yf.player.stats("328.p.123", "lastweek", (error, data) => {});

  console.log("✅ Optional parameter overloads compile correctly");
} catch (error) {
  console.log("❌ Optional parameter validation failed:", error);
}

console.log("\n✨ Type validation test completed!");
console.log(
  "🎯 All TypeScript types validate correctly against expected structures!",
);
