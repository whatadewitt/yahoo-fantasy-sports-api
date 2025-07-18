# CLAUDE.md - AI Assistant Context

This file contains important context and guidelines for AI assistants working on the Yahoo Fantasy Sports API TypeScript project.

## Project Overview

This is a TypeScript/JavaScript wrapper for the Yahoo Fantasy Sports API. The project was recently migrated from JavaScript to TypeScript while maintaining backward compatibility.

## Key Architecture Decisions

### 1. TypeScript Migration (Completed)
- Full TypeScript support with strict type checking
- Dual module support (CommonJS and ES Modules)
- Backward compatibility maintained for existing JavaScript users
- All 84 tests passing

### 2. OAuth Implementation
- Supports both OAuth 1.0a and OAuth 2.0
- Uses `oauth-signature` library (CommonJS require, not ES import)
- Consumer key/secret stored in `.env` file (never commit!)

### 3. API Structure
- Resources: Individual entities (game, league, player, team, etc.)
- Collections: Groups of entities (games, leagues, players, teams, etc.)
- All methods support both callback and promise patterns

## Testing

### Running Tests
```bash
npm test              # Run unit tests (uses mocked data)
npm run test:types    # Test TypeScript compilation and type safety
npm run test:integration  # Test against real Yahoo API (requires .env)
npm run test:all      # Run all test suites
```

### Integration Testing
1. Copy `.env.example` to `.env`
2. Add Yahoo API credentials
3. Set `RUN_INTEGRATION_TESTS=true`
4. Run `npm run test:integration`

## Common Issues & Solutions

### 1. OAuth Signature Import
The `oauth-signature` library must be imported using CommonJS:
```typescript
const oauthSignature = require('oauth-signature');
```
NOT:
```typescript
import oauthSignature from 'oauth-signature'; // This will fail!
```

### 2. Test Failures
- If tests fail with "consumer_key_unknown", check that `.env` file exists with valid credentials
- The `test:types` command now uses real credentials from `.env` to prevent OAuth errors

### 3. Building the Project
```bash
npm run build  # Builds CommonJS, ES modules, and type definitions
```

## Code Style Guidelines

1. **NO COMMENTS** - The user prefers clean code without comments
2. Use `const` instead of `var`
3. Maintain snake_case for Yahoo API methods (e.g., `draft_results`, not `draftResults`)
4. Follow existing patterns for method overloading (callback and promise versions)

## Important Files

- `src/YahooFantasy.ts` - Main class with OAuth implementation
- `src/types/` - TypeScript type definitions
- `src/resources/` - Individual resource implementations
- `src/collections/` - Collection implementations
- `src/helpers/` - Data mapping functions (mapPlayer, mapTeam, etc.)

## Deprecated Methods

The following methods were removed during the TypeScript migration:
- `game.leagues()` - Use `user.game_leagues()` instead
- `game.players()` - Use specific player endpoints instead

## Environment Variables

Required in `.env`:
- `YAHOO_CONSUMER_KEY` - Yahoo app consumer key
- `YAHOO_CONSUMER_SECRET` - Yahoo app consumer secret

Optional:
- `YAHOO_ACCESS_TOKEN` - For OAuth 2.0 testing
- `YAHOO_REFRESH_TOKEN` - For token refresh testing
- `RUN_INTEGRATION_TESTS` - Set to 'true' to enable integration tests

## Publishing

The package is published as `yahoo-fantasy` on npm. Version 6.0.0 includes the complete TypeScript migration.

## Gotchas

1. Yahoo API returns data in array format with numeric indices
2. Player data needs special mapping (see `mapPlayer` function)
3. Some endpoints require OAuth 2.0 (user-specific data)
4. Always run lint/typecheck before committing:
   ```bash
   npm run typecheck
   ```

## Need Help?

- Check the test files for usage examples
- Review the TypeScript types for API response structures
- Integration tests show real-world usage patterns