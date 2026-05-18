# Write-API Test Scripts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Two runnable Node scripts that exercise the merged write API (waiver claim + bench a player) against a real Yahoo league, sharing one OAuth2 helper.

**Architecture:** Plain CommonJS scripts in `scripts/`, requiring the built library via `../index.js` (→ `dist/cjs`). A shared `_auth.js` runs the OAuth2 authorize-code flow each run (no token cache). Two thin scripts hold clearly-marked placeholder constants and call the write methods.

**Tech Stack:** Node, CommonJS, `dotenv` (already a devDependency), the `yahoo-fantasy` library in this repo.

**No automated tests:** Per the spec, these are manual live-API tools (real OAuth + real league mutation). Per-file verification is `node --check` (syntax, no execution/network). Real verification = the user runs them with real values. Spec: `docs/superpowers/specs/2026-05-18-write-api-test-scripts-design.md`.

**Prerequisite (state once, before running for real):** `npm run build:cjs` so `../index.js` → `dist/cjs/index.js` resolves. Not required for `node --check`.

---

### Task 1: Shared OAuth2 helper

**Files:**
- Create: `scripts/_auth.js`

- [ ] **Step 1: Create `scripts/_auth.js` with this exact content**

```js
require('dotenv').config();
const readline = require('readline');
const YahooFantasy = require('../index.js');

function prompt(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function authedClient() {
  const { YAHOO_CONSUMER_KEY, YAHOO_CONSUMER_SECRET, YAHOO_REDIRECT_URI } =
    process.env;

  if (!YAHOO_CONSUMER_KEY || !YAHOO_CONSUMER_SECRET || !YAHOO_REDIRECT_URI) {
    throw new Error(
      'Missing env vars. Set YAHOO_CONSUMER_KEY, YAHOO_CONSUMER_SECRET, and ' +
        'YAHOO_REDIRECT_URI (in .env or the environment).'
    );
  }

  const yf = new YahooFantasy(
    YAHOO_CONSUMER_KEY,
    YAHOO_CONSUMER_SECRET,
    undefined,
    YAHOO_REDIRECT_URI
  );

  const authUrl =
    'https://api.login.yahoo.com/oauth2/request_auth?client_id=' +
    encodeURIComponent(YAHOO_CONSUMER_KEY) +
    '&redirect_uri=' +
    encodeURIComponent(YAHOO_REDIRECT_URI) +
    '&response_type=code';

  console.log('\n1) Open this URL and approve access:\n');
  console.log(authUrl + '\n');
  console.log(
    '2) After approving, copy the "code" query value from the redirect URL'
  );
  console.log(
    '   (or the code shown on screen if your Yahoo app uses an oob redirect).\n'
  );

  const code = await prompt('Paste the code here: ');
  if (!code) throw new Error('No code entered.');

  return new Promise((resolve, reject) => {
    yf.authCallback({ query: { code } }, (err) => {
      if (err) return reject(err);
      resolve(yf);
    });
  });
}

module.exports = { authedClient };
```

- [ ] **Step 2: Syntax check**

Run: `node --check scripts/_auth.js`
Expected: no output, exit 0.

- [ ] **Step 3: Commit**

```bash
git add scripts/_auth.js
git commit -m "feat: add shared OAuth2 helper for write-API test scripts"
```

---

### Task 2: Waiver-claim script

**Files:**
- Create: `scripts/waiver-claim.js`

- [ ] **Step 1: Create `scripts/waiver-claim.js` with this exact content**

```js
const { authedClient } = require('./_auth');

// ─── EDIT THESE ──────────────────────────────────────────────────
const LEAGUE_KEY = 'PUT_LEAGUE_KEY_HERE'; // e.g. "461.l.1234"
const TEAM_KEY = 'PUT_TEAM_KEY_HERE'; // your team, e.g. "461.l.1234.t.5"
const ADD_PLAYER = 'PUT_PLAYER_KEY_HERE'; // player to claim, e.g. "461.p.30123"
const FAAB_BID = 5; // number, or null for waiver-priority leagues
const DROP_PLAYER = null; // optional player_key to drop with the claim, or null
// ─────────────────────────────────────────────────────────────────

(async () => {
  try {
    const yf = await authedClient();

    const opts = {};
    if (typeof FAAB_BID === 'number') opts.faab_bid = FAAB_BID;
    if (DROP_PLAYER) opts.drop_player_key = DROP_PLAYER;

    const result = await yf.transactions.waiver_claim(
      LEAGUE_KEY,
      TEAM_KEY,
      ADD_PLAYER,
      opts
    );

    console.log('\n✅ Waiver claim submitted:\n');
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Failed:', err && err.name ? err.name : 'Error');
    console.error('   message:', err && err.message);
    if (err && err.status) console.error('   status :', err.status);
    process.exit(1);
  }
})();
```

- [ ] **Step 2: Syntax check**

Run: `node --check scripts/waiver-claim.js`
Expected: no output, exit 0.

- [ ] **Step 3: Commit**

```bash
git add scripts/waiver-claim.js
git commit -m "feat: add waiver-claim test script"
```

---

### Task 3: Bench-player script

**Files:**
- Create: `scripts/bench-player.js`

- [ ] **Step 1: Create `scripts/bench-player.js` with this exact content**

```js
const { authedClient } = require('./_auth');

// ─── EDIT THESE ──────────────────────────────────────────────────
const TEAM_KEY = 'PUT_TEAM_KEY_HERE'; // your team, e.g. "461.l.1234.t.5"

// NFL: use a week number. Daily sports (NBA/MLB/NHL): replace with
//   const COVERAGE = { date: '2026-05-18' };
const COVERAGE = { week: 1 };

// Yahoo applies these position changes and the resulting lineup must be
// valid for this week/date. To bench a starter you normally also promote a
// bench player into the freed slot — hence two entries below.
const PLAYERS = [
  { player_key: 'PUT_STARTER_KEY', position: 'BN' }, // bench this starter
  { player_key: 'PUT_BENCH_KEY', position: 'PUT_POSITION' }, // e.g. "RB","PG","C"
];
// ─────────────────────────────────────────────────────────────────

(async () => {
  try {
    const yf = await authedClient();

    const result = await yf.roster.update(TEAM_KEY, COVERAGE, PLAYERS);

    console.log('\n✅ Roster updated:\n');
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Failed:', err && err.name ? err.name : 'Error');
    console.error('   message:', err && err.message);
    if (err && err.status) console.error('   status :', err.status);
    process.exit(1);
  }
})();
```

- [ ] **Step 2: Syntax check**

Run: `node --check scripts/bench-player.js`
Expected: no output, exit 0.

- [ ] **Step 3: Commit**

```bash
git add scripts/bench-player.js
git commit -m "feat: add bench-player test script"
```

---

### Task 4: Final verification

- [ ] **Step 1: Build so the scripts can resolve the library**

Run: `npm run build:cjs`
Expected: clean exit, `dist/cjs/index.js` exists.

- [ ] **Step 2: Confirm scripts load without crashing on require**

Run: `node --check scripts/_auth.js && node --check scripts/waiver-claim.js && node --check scripts/bench-player.js`
Expected: no output, exit 0.

- [ ] **Step 3: Hand-off note (no action)**

Real verification is manual and done by the user: set `YAHOO_CONSUMER_KEY`,
`YAHOO_CONSUMER_SECRET`, `YAHOO_REDIRECT_URI` (in `.env` or env), fill the
placeholder constants, then run e.g. `node scripts/waiver-claim.js` /
`node scripts/bench-player.js`, complete the printed OAuth step, and observe
the JSON result or the printed Yahoo error. This performs a real league
mutation and is intentionally outside automated testing.

---

## Self-Review

- **Spec coverage:** shared `_auth.js` OAuth2 flow (Task 1) ✓; `waiver-claim.js` with placeholders + `waiver_claim` call (Task 2) ✓; `bench-player.js` with placeholders + `roster.update` call (Task 3) ✓; CJS + `require("../index.js")` + build prereq (Task 4) ✓; env credentials, in-file IDs, error handling, no `.gitignore` change, no library changes — all reflected. No spec requirement unaddressed.
- **Placeholder scan:** the only placeholders are the intentional, clearly-marked `PUT_*` user-edit constants the spec requires; no plan-level TBD/TODO/"similar to" — every file is shown in full.
- **Type/signature consistency:** `authedClient()` is defined in Task 1 and consumed identically in Tasks 2 & 3; `yf.transactions.waiver_claim(leagueKey, teamKey, addPlayerKey, opts)` and `yf.roster.update(teamKey, coverage, players)` match the merged public API exactly; both return promises when no callback is passed, so `await` is correct.
