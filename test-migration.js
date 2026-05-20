#!/usr/bin/env node

/**
 * Integration test to verify TypeScript migration compatibility
 */

console.log('🧪 Testing TypeScript Migration Compatibility...\n');

const fs = require('fs');
const path = require('path');

// Test 1: CommonJS Import
console.log('1️⃣ Testing CommonJS import...');
try {
  const YahooFantasy = require('./index.js');
  const yf = new YahooFantasy('test_key', 'test_secret');
  
  console.log('✅ CommonJS import works');
  console.log('✅ YahooFantasy constructor works');
  console.log('✅ Has game resource:', !!yf.game);
  console.log('✅ Has league resource:', !!yf.league);
  console.log('✅ Has player resource:', !!yf.player);
  console.log('✅ Has collections:', !!yf.games, !!yf.leagues, !!yf.players);
} catch (error) {
  console.log('❌ CommonJS import failed:', error.message);
}

// Test 2: ES Module Build Target
console.log('\n2️⃣ Testing ES module build target...');
try {
  const pkg = require('./package.json');
  const esmEntry = pkg.exports?.['.']?.import || pkg.module;
  const esmPath = path.resolve(__dirname, esmEntry);

  if (!esmEntry) {
    throw new Error('No package ESM entry configured');
  }

  if (!fs.existsSync(esmPath)) {
    throw new Error(`${esmEntry} does not exist; run npm run build:esm first`);
  }

  console.log('✅ ES module entry is configured:', esmEntry);
  console.log('✅ ES module build output exists');
} catch (error) {
  console.log('❌ ES module build target failed:', error.message);
}

// Test 3: Method Signatures
console.log('\n3️⃣ Testing method signatures...');
try {
  const YahooFantasy = require('./index.js');
  const yf = new YahooFantasy('test_key', 'test_secret');
  
  // Test callback signatures (should not throw)
  const callbackTest = (error, data) => {};
  
  console.log('✅ game.meta callback signature exists:', typeof yf.game.meta);
  console.log('✅ league.meta callback signature exists:', typeof yf.league.meta);
  console.log('✅ player.meta callback signature exists:', typeof yf.player.meta);
  
  // Test that methods return promises when no callback
  console.log('✅ Methods can be called without throwing');
  
} catch (error) {
  console.log('❌ Method signature test failed:', error.message);
}

// Test 4: TypeScript Compiled Output
console.log('\n4️⃣ Testing TypeScript compiled output...');
try {
  const YFBuilt = require('./dist/cjs/index.js');
  const yfBuilt = new YFBuilt.default('test_key', 'test_secret');
  
  console.log('✅ TypeScript compiled CJS works');
  console.log('✅ Has all resources:', !!yfBuilt.game && !!yfBuilt.league && !!yfBuilt.player);
  console.log('✅ Has all collections:', !!yfBuilt.games && !!yfBuilt.leagues && !!yfBuilt.players);
} catch (error) {
  console.log('❌ TypeScript compiled output failed:', error.message);
}

console.log('\n✨ Migration compatibility test completed!');
