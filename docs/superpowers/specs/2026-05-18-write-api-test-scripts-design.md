# Write-API Test Scripts — Design

- **Date:** 2026-05-18
- **Status:** Approved (pending spec review)
- **Topic:** Manual test scripts for the merged write API against a real Yahoo league

## Context

The write API (`roster.update`, `transactions.waiver_claim`, etc.) is merged into
`claude-typescript` but only unit-tested (mocked HTTP). The user has a real league
and wants two small scripts to exercise two write operations live. The user supplies
credentials themselves; scripts use clearly-marked placeholders.

## Goals

- One script that submits a waiver claim.
- One script that moves a player from the starting lineup to the bench.
- Easy, obvious placeholder spots for league/team/player keys.
- Run against a real league with the user's own Yahoo app credentials.

## Non-Goals

- No token caching/persistence (re-auth each run — user's choice for minimal code).
- No automated tests for these scripts (they are manual tools).
- No new library code; scripts only consume the existing public API.
- No secrets committed; credentials come from env, IDs from in-file placeholders.

## Decisions

| Decision | Choice |
|---|---|
| Auth | Full OAuth2 authorize flow each run (user has only consumer key/secret) |
| Token cache | None — paste a fresh authorize `code` every run |
| Structure | Shared `scripts/_auth.js` helper + two thin scripts (DRY) |
| Module form | Plain CommonJS Node scripts, `require("../index.js")` (→ `dist/cjs`) |
| Prereq | `npm run build:cjs` before running (dist is gitignored) |
| Credentials | `YAHOO_CONSUMER_KEY`, `YAHOO_CONSUMER_SECRET`, `YAHOO_REDIRECT_URI` via env/`.env` |
| IDs | In-file placeholder constants at top of each script |

## Components

### `scripts/_auth.js`
Exports `async function authedClient()`:
1. Reads `YAHOO_CONSUMER_KEY`, `YAHOO_CONSUMER_SECRET`, `YAHOO_REDIRECT_URI` from
   env (repo already loads `.env` via `dotenv`). Errors clearly if any are missing.
2. Constructs `new YahooFantasy(KEY, SECRET, undefined, REDIRECT_URI)`.
3. Prints the Yahoo authorize URL:
   `https://api.login.yahoo.com/oauth2/request_auth?client_id={KEY}&redirect_uri={REDIRECT_URI}&response_type=code`
4. Prompts on stdin (`readline`) for the `code` value the user copies from the
   post-approval redirect URL (or the on-screen code if the app uses `oob`).
5. Calls `yf.authCallback({ query: { code } }, cb)` — the library exchanges the
   code and sets the user token internally.
6. Resolves to the authed `yf` instance.

### `scripts/waiver-claim.js`
Placeholder block:
```js
const LEAGUE_KEY  = "PUT_LEAGUE_KEY_HERE";   // e.g. "461.l.1234"
const TEAM_KEY    = "PUT_TEAM_KEY_HERE";     // your team, e.g. "461.l.1234.t.5"
const ADD_PLAYER  = "PUT_PLAYER_KEY_HERE";   // player to claim, e.g. "461.p.30123"
const FAAB_BID    = 5;                        // number, or null for priority leagues
const DROP_PLAYER = null;                     // optional player_key to drop, or null
```
Flow: `const yf = await authedClient();` then build `opts` (`faab_bid` only if a
number, `drop_player_key` only if set) and call
`yf.transactions.waiver_claim(LEAGUE_KEY, TEAM_KEY, ADD_PLAYER, opts)`.
Print the JSON result on success.

### `scripts/bench-player.js`
Placeholder block:
```js
const TEAM_KEY = "PUT_TEAM_KEY_HERE";
const COVERAGE = { week: 1 };                 // NFL; daily sports: { date: "2026-05-18" }
const PLAYERS = [
  { player_key: "PUT_STARTER_KEY", position: "BN" },        // bench this starter
  { player_key: "PUT_BENCH_KEY",   position: "PUT_POSITION" } // promote into freed slot
];
```
Flow: `const yf = await authedClient();` then
`yf.roster.update(TEAM_KEY, COVERAGE, PLAYERS)`. In-file comment explains Yahoo
expects the changed players and the resulting lineup must be valid for that
week/date, so a bench move is normally paired with promoting another player.

## Error Handling

Each script wraps the write in `try/catch`; on failure prints
`err.name`, `err.message`, and `err.status` (the library throws
`YahooFantasyError` with Yahoo's description, e.g. invalid player key, roster
locked, not your team). Exit code 1 on error, 0 on success. The only network
write performed is the single intended operation.

## File Manifest

- Create `scripts/_auth.js`
- Create `scripts/waiver-claim.js`
- Create `scripts/bench-player.js`

No `.gitignore` change (no token file). No library/source changes.

## Open Questions

None — auth model, caching, structure, and placeholders are all decided.
