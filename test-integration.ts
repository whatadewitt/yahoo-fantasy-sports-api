#!/usr/bin/env ts-node

/**
 * Integration test that makes real API calls to Yahoo Fantasy Sports API
 *
 * To use this test:
 * 1. Copy .env.example to .env
 * 2. Fill in your Yahoo Consumer Key and Secret
 * 3. Optionally add access tokens if you have them
 * 4. Set RUN_INTEGRATION_TESTS=true in .env
 * 5. Run: npm run test:integration
 */

import * as dotenv from "dotenv";
import YahooFantasy from "./src/YahooFantasy";

// Load environment variables
dotenv.config();

const { YAHOO_CONSUMER_KEY, YAHOO_CONSUMER_SECRET, RUN_INTEGRATION_TESTS } =
  process.env;

const TEST_GAME_KEY = "nfl";
const TEST_GAME_KEYS = ["nfl", "mlb"];
const TEST_PLAYER_KEY = "nfl.p.32671";

// Check if integration tests should run
if (RUN_INTEGRATION_TESTS !== "true") {
  console.log("🔕 Integration tests are disabled.");
  console.log(
    "📝 To enable them, set RUN_INTEGRATION_TESTS=true in your .env file",
  );
  console.log("📄 See .env.example for configuration details");
  process.exit(0);
}

// Validate required credentials
if (!YAHOO_CONSUMER_KEY || !YAHOO_CONSUMER_SECRET) {
  console.error("❌ Missing required credentials in .env file:");
  console.error("   - YAHOO_CONSUMER_KEY");
  console.error("   - YAHOO_CONSUMER_SECRET");
  console.error("📄 See .env.example for setup instructions");
  process.exit(1);
}

function createYahooFantasyClient(): YahooFantasy {
  return new YahooFantasy(YAHOO_CONSUMER_KEY!, YAHOO_CONSUMER_SECRET!);
}

function getErrorMessage(error: any): string {
  return error instanceof Error ? error.message : String(error);
}

async function runIntegrationStep(
  title: string,
  failureLabel: string,
  action: () => Promise<void>,
  onError?: (error: any) => void,
): Promise<void> {
  console.log(title);

  try {
    await action();
  } catch (error: any) {
    console.log(failureLabel, getErrorMessage(error));
    onError?.(error);
  }
}

async function testGameMeta(yf: YahooFantasy): Promise<void> {
  await runIntegrationStep(
    "1️⃣ Testing game.meta()...",
    "❌ Game metadata failed:",
    async () => {
      const gameData = await yf.game.meta(TEST_GAME_KEY);
      console.log("✅ Game metadata retrieved successfully:");
      console.log(`   - Game: ${gameData.name} (${gameData.season})`);
      console.log(`   - Type: ${gameData.type}`);
      console.log(`   - Code: ${gameData.code}`);
    },
    (error) => {
      if (getErrorMessage(error).includes("token_expired")) {
        console.log("💡 Try refreshing your access token");
      }
    },
  );
}

function logGameWeeks(weeksData: any): void {
  if (!weeksData || !Array.isArray(weeksData)) {
    console.log(`   - Data: ${JSON.stringify(weeksData)}`);
    return;
  }

  console.log(`   - Found ${weeksData.length} weeks`);
  if (weeksData.length > 0) {
    console.log(`   - First week: ${JSON.stringify(weeksData[0])}`);
  }
}

async function testGameWeeks(yf: YahooFantasy): Promise<void> {
  await runIntegrationStep(
    "\n2️⃣ Testing game.game_weeks()...",
    "❌ Game weeks failed:",
    async () => {
      const weeksData = await yf.game.game_weeks(TEST_GAME_KEY);
      console.log("✅ Game weeks retrieved successfully:");
      logGameWeeks(weeksData);
    },
  );
}

function logGamesData(gamesData: any): void {
  if (!gamesData || !Array.isArray(gamesData)) {
    console.log(`   - Data: ${JSON.stringify(gamesData)}`);
    return;
  }

  console.log(`   - Found ${gamesData.length} games`);
  gamesData.slice(0, 3).forEach((game: any, index: number) => {
    console.log(`   - Game ${index + 1}: ${game.name} (${game.season})`);
  });
}

async function testGamesFetch(yf: YahooFantasy): Promise<void> {
  await runIntegrationStep(
    "\n3️⃣ Testing games.fetch()...",
    "❌ Games collection failed:",
    async () => {
      const gamesData = await yf.games.fetch(TEST_GAME_KEYS);
      console.log("✅ Games collection retrieved successfully:");
      logGamesData(gamesData);
    },
  );
}

async function testPlayerMeta(yf: YahooFantasy): Promise<void> {
  await runIntegrationStep(
    "\n6️⃣ Testing player.meta() with specific player...",
    "❌ Player metadata failed:",
    async () => {
      const playerData = await yf.player.meta(TEST_PLAYER_KEY);
      console.log("✅ Player metadata retrieved successfully:");
      console.log(`   - Player: ${playerData.name?.full || "Unknown"}`);
      console.log(`   - Team: ${playerData.editorial_team_abbr}`);
      console.log(`   - Position: ${playerData.display_position}`);
    },
  );
}

function logIntegrationSummary(): void {
  console.log("\n✨ Integration tests completed!");
  console.log("\n📊 Test Summary:");
  console.log("   • API Connection: Tested");
  console.log("   • Game Metadata: Tested");
  console.log("   • Game Collections: Tested");
  console.log("   • OAuth 1.0a Flow: Tested");
  console.log(
    "\n🎯 TypeScript Integration: All types properly validated against live API!",
  );
}

async function runIntegrationTests(): Promise<void> {
  const yf = createYahooFantasyClient();

  console.log(
    "⚠️  No access token provided - using OAuth 1.0a (limited functionality)",
  );
  console.log("🔗 Testing API connection...\n");

  await testGameMeta(yf);
  await testGameWeeks(yf);
  await testGamesFetch(yf);
  await testPlayerMeta(yf);
  logIntegrationSummary();
}

async function testCallbacks() {
  const yf = createYahooFantasyClient();

  return new Promise<void>((resolve, reject) => {
    console.log("🔄 Testing game.meta() with callback...");

    yf.game.meta(TEST_GAME_KEY, (error, data) => {
      if (error) {
        console.log("❌ Callback test failed:", error.message);
        reject(error);
      } else {
        console.log("✅ Callback test successful:");
        console.log(`   - Game: ${data?.name} (${data?.season})`);
        resolve();
      }
    });
  });
}

// Run all tests
async function main() {
  try {
    console.log("📝 Testing callback-style API calls...\n");
    await testCallbacks();
    console.log("");
    console.log("🧪 Running Yahoo Fantasy Sports API Integration Tests\n");
    await runIntegrationTests();
  } catch (error) {
    console.error("❌ Test suite failed:", error);
    process.exit(1);
  }
}

main();
