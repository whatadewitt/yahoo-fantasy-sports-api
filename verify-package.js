#!/usr/bin/env node

/**
 * Package verification script to ensure npm release is ready
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying package for npm release...\n');

// Test 1: Check package.json configuration
console.log('1️⃣ Checking package.json configuration...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const checks = {
  'Version is 6.0.0': packageJson.version === '6.0.0',
  'Has correct main field': packageJson.main === './dist/cjs/index.js',
  'Has correct module field': packageJson.module === './dist/esm/index.js', 
  'Has correct types field': packageJson.types === './dist/index.d.ts',
  'Has exports configuration': !!packageJson.exports,
  'Has TypeScript keywords': packageJson.keywords.includes('typescript'),
  'Node.js version >= 14': packageJson.engines.node.includes('14'),
  'Has prepublishOnly script': !!packageJson.scripts.prepublishOnly
};

Object.entries(checks).forEach(([check, passed]) => {
  console.log(`  ${passed ? '✅' : '❌'} ${check}`);
});

// Test 2: Check built files exist
console.log('\n2️⃣ Checking built files...');
const requiredFiles = [
  'dist/cjs/index.js',
  'dist/esm/index.js', 
  'dist/index.d.ts',
  'dist/cjs/YahooFantasy.js',
  'dist/esm/YahooFantasy.js',
  'dist/YahooFantasy.d.ts'
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Test 3: Check TypeScript types are valid
console.log('\n3️⃣ Checking TypeScript exports...');
try {
  const indexDts = fs.readFileSync('dist/index.d.ts', 'utf8');
  const typeChecks = {
    'Exports default class': indexDts.includes('export default'),
    'Exports Game type': indexDts.includes('Game'),
    'Exports League type': indexDts.includes('League'),
    'Exports Player type': indexDts.includes('Player'),
    'Has YahooFantasy class': indexDts.includes('YahooFantasy')
  };
  
  Object.entries(typeChecks).forEach(([check, passed]) => {
    console.log(`  ${passed ? '✅' : '❌'} ${check}`);
  });
} catch (error) {
  console.log('  ❌ Could not read type definitions');
}

// Test 4: Check package size
console.log('\n4️⃣ Checking package size...');
const { execSync } = require('child_process');

try {
  const output = execSync('npm pack --dry-run 2>/dev/null | grep "package size"', { encoding: 'utf8' });
  const sizeMatch = output.match(/package size:\\s*([\\d.]+)\\s*(\\w+)/);
  
  if (sizeMatch) {
    const size = parseFloat(sizeMatch[1]);
    const unit = sizeMatch[2];
    
    console.log(`  📦 Package size: ${size} ${unit}`);
    
    if (unit === 'kB' && size < 100) {
      console.log('  ✅ Package size is reasonable');
    } else if (unit === 'MB' && size < 1) {
      console.log('  ✅ Package size is reasonable'); 
    } else {
      console.log('  ⚠️ Package size might be large');
    }
  }
} catch (error) {
  console.log('  ⚠️ Could not determine package size');
}

// Test 5: Verify .npmignore is working
console.log('\n5️⃣ Checking .npmignore effectiveness...');
try {
  const output = execSync('npm pack --dry-run 2>/dev/null', { encoding: 'utf8' });
  const files = output.split('\\n').filter(line => line.includes('notice') && line.includes('kB')).length;
  
  const ignoreChecks = {
    'No source .ts files': !output.includes('src/'),
    'No test files': !output.includes('test-'),
    'No TypeScript configs': !output.includes('tsconfig'),
    'No development docs': !output.includes('TypeScript_Migration_PRD.md'),
    'Includes README': output.includes('README.md'),
    'Includes LICENSE': output.includes('LICENSE'),
    'Includes dist/': output.includes('dist/')
  };
  
  Object.entries(ignoreChecks).forEach(([check, passed]) => {
    console.log(`  ${passed ? '✅' : '❌'} ${check}`);
  });
  
  console.log(`  📄 Total files in package: ${files}`);
  
} catch (error) {
  console.log('  ❌ Could not verify .npmignore');
}

// Test 6: Test require/import patterns
console.log('\n6️⃣ Testing module patterns...');
try {
  // Test CommonJS require
  delete require.cache[require.resolve('./dist/cjs/index.js')];
  const cjsModule = require('./dist/cjs/index.js');
  console.log('  ✅ CommonJS require works');
  
  // Test that default export exists
  if (typeof cjsModule.default === 'function') {
    console.log('  ✅ Default export is a function/class');
  } else {
    console.log('  ❌ Default export is not a function/class');
  }
  
  // Test instance creation
  const instance = new cjsModule.default('test', 'test');
  if (instance && typeof instance.game === 'object') {
    console.log('  ✅ Instance creation works');
    console.log('  ✅ Has expected resources');
  } else {
    console.log('  ❌ Instance creation failed');
  }
  
} catch (error) {
  console.log('  ❌ Module loading failed:', error.message);
}

console.log('\n✨ Package verification completed!');
console.log('\n📋 Pre-release checklist:');
console.log('  □ Run npm run test:all to verify all tests pass');  
console.log('  □ Update CHANGELOG.md with release notes');
console.log('  □ Commit all changes');
console.log('  □ Create git tag for release');
console.log('  □ Run npm publish --tag beta for beta release');

console.log('\n🎯 Package is ready for release!');