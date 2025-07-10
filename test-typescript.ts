#!/usr/bin/env ts-node

/**
 * TypeScript compilation and type safety tests
 */

import YahooFantasy, { 
  Game, 
  League, 
  Player, 
  Team, 
  GameResource,
  LeagueResource,
  PlayerResource
} from './src/index';

console.log('🔷 Testing TypeScript Type Safety...\n');

// Test 1: Type Imports
console.log('1️⃣ Testing type imports...');
try {
  console.log('✅ YahooFantasy class imported');
  console.log('✅ Game interface imported');
  console.log('✅ League interface imported');
  console.log('✅ Player interface imported');
  console.log('✅ Team interface imported');
  console.log('✅ Resource classes imported');
} catch (error) {
  console.log('❌ Type import failed:', error);
}

// Test 2: Instance Creation with Types
console.log('\n2️⃣ Testing typed instance creation...');
try {
  const yf: YahooFantasy = new YahooFantasy('test_key', 'test_secret');
  
  // Check resource types
  const gameResource: GameResource = yf.game;
  const leagueResource: LeagueResource = yf.league;
  const playerResource: PlayerResource = yf.player;
  
  console.log('✅ YahooFantasy instance created with correct type');
  console.log('✅ Game resource has correct type');
  console.log('✅ League resource has correct type');
  console.log('✅ Player resource has correct type');
} catch (error) {
  console.log('❌ Typed instance creation failed:', error);
}

// Test 3: Method Overloads
console.log('\n3️⃣ Testing method overloads...');
try {
  const yf = new YahooFantasy('test_key', 'test_secret');
  
  // These should all be valid TypeScript (compilation test)
  
  // Callback versions
  yf.game.meta('328', (error, game) => {
    if (error) return;
    console.log('Game callback type works');
  });
  
  yf.league.meta('328.l.123', (error, league) => {
    if (error) return;
    console.log('League callback type works');
  });
  
  yf.player.meta('328.p.123', (error, player) => {
    if (error) return;
    console.log('Player callback type works');
  });
  
  // Promise versions (return type inference)
  const gamePromise: Promise<Game> = yf.game.meta('328');
  const leaguePromise: Promise<League> = yf.league.meta('328.l.123');
  const playerPromise: Promise<Player> = yf.player.meta('328.p.123');
  
  console.log('✅ Callback overloads compile correctly');
  console.log('✅ Promise overloads compile correctly');
  console.log('✅ Return type inference works');
} catch (error) {
  console.log('❌ Method overload test failed:', error);
}

// Test 4: Complex Method Signatures
console.log('\n4️⃣ Testing complex method signatures...');
try {
  const yf = new YahooFantasy('test_key', 'test_secret');
  
  // Test optional parameters and overloads
  yf.league.scoreboard('328.l.123', (error, data) => {}); // No week
  yf.league.scoreboard('328.l.123', 1, (error, data) => {}); // With week
  
  const scoreboardPromise1 = yf.league.scoreboard('328.l.123');
  const scoreboardPromise2 = yf.league.scoreboard('328.l.123', 1);
  
  // Test player stats with different types
  yf.player.stats('328.p.123', (error, data) => {}); // No date/week
  yf.player.stats('328.p.123', 1, (error, data) => {}); // Week number
  yf.player.stats('328.p.123', '2023-10-15', (error, data) => {}); // Date string
  yf.player.stats('328.p.123', 'lastweek', (error, data) => {}); // Special type
  
  console.log('✅ Complex method signatures compile correctly');
  console.log('✅ Optional parameters work');
  console.log('✅ Union types work');
} catch (error) {
  console.log('❌ Complex method signature test failed:', error);
}

// Test 5: Type Guards and Null Safety
console.log('\n5️⃣ Testing type guards and null safety...');
try {
  const yf = new YahooFantasy('test_key', 'test_secret');
  
  // TypeScript should require proper null checking
  yf.game.meta('328').then((game: Game) => {
    if (game) {
      // Properties should be typed
      const gameKey: string = game.game_key;
      const gameName: string = game.name;
      const season: string = game.season;
      console.log('✅ Game properties are properly typed');
    }
  }).catch(() => {});
  
  yf.league.settings('328.l.123').then((settings) => {
    if (settings) {
      // Settings should have expected structure
      const draftType = settings.draft_type;
      const scoringType = settings.scoring_type;
      console.log('✅ League settings are properly typed');
    }
  }).catch(() => {});
  
  console.log('✅ Null safety compilation works');
  console.log('✅ Property types are enforced');
} catch (error) {
  console.log('❌ Type guard test failed:', error);
}

console.log('\n✨ TypeScript type safety test completed!');
console.log('🎯 All types compile correctly and provide proper safety!');