# Write API Support — Design

- **Date:** 2026-05-17
- **Status:** Approved (pending spec review)
- **Topic:** Yahoo Fantasy Sports write operations (roster edits + transactions)

## Context

An audit of this wrapper against Yahoo's documented Fantasy v2 API (now rehosted at
`https://sports.yahoo.com/developer/docs/` — the classic guide, API unchanged) found:

- **Read (GET) coverage is essentially 100%.** Every documented resource, collection,
  and sub-resource is implemented and mapped.
- **The entire write half is absent.** Yahoo documents ~15 mutating operations
  (roster lineup edits, add/drop, waivers, trades, trade responses, cancels). None
  are implemented.
- The transport layer cannot perform writes: `api()` only writes a request body when
  `method === "POST"` (`YahooFantasy.ts:431`), and Yahoo's write endpoints require
  **XML** request bodies (the `format=json` query param affects only the *response*).
  There is no XML body construction anywhere. `add_player`/`drop_player`/`add_drop`
  exist only as commented-out stubs (`transactionsCollection.ts:162-181`,
  `types/collections.ts:101-127`).

This is not something Yahoo newly added — it is the write half this wrapper never had.

## Goals

- Add full support for every documented write operation.
- Preserve existing conventions: snake_case method names, callback + promise
  overloads, methods on existing namespaces, minimal runtime dependencies.
- Ship as two independently reviewable PRs tonight.

## Non-Goals

- No integration tests for write operations (they mutate real leagues).
- No new runtime dependency.
- No changes to existing read methods or their behavior.
- No special-casing of OAuth 1.0a request-body signing (writes require OAuth2 user
  context).

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Worktree split | A = plumbing + roster editing; B = plumbing + all transaction writes | Feature-domain seams don't conflict; verb split would scatter the trade lifecycle and omit POST |
| Plumbing duplication | Plumbing lives in both branches; B branches off A and rebases after A merges | Exactly two PRs tonight, no cross-PR conflicts |
| Transaction scope | All ~15 documented operations | User requested complete coverage |
| API ergonomics | snake_case, callback + promise overloads, on existing `roster`/`transactions`/`transaction` namespaces | Matches existing codebase + the pre-existing commented stubs |
| Testing | Unit only — mock `https`, assert method/URL/Content-Type/exact XML body | Writes mutate real leagues; fixed XML strings are trivially testable; fully CI-able |
| XML construction | Hand-rolled builder functions + `escapeXml()` util | Zero deps (project ships only `oauth-signature` + `follow-redirects`); byte-exact output is what tests assert |

## Architecture

### Section 1 — Shared foundation (identical in both worktrees)

**`src/YahooFantasy.ts` — `api()` refactor:**

- Add `public readonly PUT: HttpMethod = "PUT"` and
  `public readonly DELETE: HttpMethod = "DELETE"` (the `HttpMethod` type already
  includes them — `types/core.ts:37`).
- Replace `if (postData && method === "POST")` with: send the request body when
  `postData` is present and `method` is `POST` or `PUT`. `DELETE` sends no body.
- When a body is sent, set header `Content-Type: application/xml`.
- Keep appending `?format=json` so responses still parse as JSON.
- The existing token-expiry refresh-and-retry path already forwards `postData`;
  no change needed beyond confirming it via test.

**`src/helpers/xmlHelper.ts` (new):**

- `escapeXml(value: string): string` — escapes `& < > " '`.
- One builder function per operation (see XML envelopes below), each returning a
  byte-exact XML string with the declaration `<?xml version='1.0'?>`.

### Section 2 — Worktree A → PR A: Roster lineup editing

`src/resources/rosterResource.ts` gains:

```ts
roster.update(teamKey: string, coverage: { week: number } | { date: string },
              players: Array<{ player_key: string; position: string }>): Promise<any>;
roster.update(teamKey, coverage, players, cb: Callback<any>): void;
```

→ `PUT https://fantasysports.yahooapis.com/fantasy/v2/team/{teamKey}/roster`

### Section 3 — Worktree B → PR B: All transaction writes

Creates on `yf.transactions.*` → `POST /league/{leagueKey}/transactions`.
Single-transaction edits/cancels on `yf.transaction.*` →
`PUT`/`DELETE /transaction/{transactionKey}`.

| Method | Verb | Operation |
|---|---|---|
| `transactions.add_player(leagueKey, teamKey, playerKey)` | POST | add free agent |
| `transactions.drop_player(leagueKey, teamKey, playerKey)` | POST | drop |
| `transactions.add_drop(leagueKey, teamKey, addKey, dropKey)` | POST | add + drop |
| `transactions.waiver_claim(leagueKey, teamKey, addKey, { faab_bid?, drop_player_key? })` | POST | waiver / FAAB claim |
| `transactions.propose_trade(leagueKey, traderTeamKey, tradeeTeamKey, { send: string[], receive: string[], trade_note? })` | POST | propose trade |
| `transaction.accept(txnKey, { trade_note? })` | PUT | accept trade |
| `transaction.reject(txnKey, { trade_note? })` | PUT | reject trade |
| `transaction.allow(txnKey)` | PUT | commissioner allow trade |
| `transaction.disallow(txnKey)` | PUT | commissioner disallow trade |
| `transaction.vote_against(txnKey, voterTeamKey)` | PUT | vote against trade |
| `transaction.edit_waiver(txnKey, { priority?, faab_bid? })` | PUT | edit pending waiver |
| `transaction.edit_trade(txnKey, { trade_note? })` | PUT | edit pending trade |
| `transaction.cancel(txnKey)` | DELETE | cancel pending waiver or trade |

All methods provide promise + callback overloads consistent with the rest of the
library. The commented-out stubs in `transactionsCollection.ts` and
`types/collections.ts` are replaced by real implementations/signatures.

### Section 4 — Testing & workflow

- **Unit tests only.** Mock the `https` layer. For every operation assert: HTTP
  method, request URL, `Content-Type: application/xml` (where a body is sent), and
  the exact XML request body string. Builder functions additionally get direct
  string-equality tests. Existing `npm test` / `npm run test:types` must stay green.
- Write operations are explicitly excluded from integration tests; a note is added
  to `CLAUDE.md` documenting this.
- **Worktrees:** created via `superpowers:using-git-worktrees`. Branch A off
  `master`; branch B off branch A so it compiles against the plumbing. B is rebased
  onto `master` once A merges.
- **PRs:** PR A = foundation + roster editing; PR B = all transaction writes.

## XML Request Envelopes (pinned)

Declaration line for every body: `<?xml version='1.0'?>`. All dynamic values are
passed through `escapeXml()`. Element order is significant to Yahoo and must match
exactly.

**Roster (PUT `/team/{team_key}/roster`)** — week coverage shown; date coverage uses
`<coverage_type>date</coverage_type><date>YYYY-MM-DD</date>`:

```xml
<fantasy_content>
  <roster>
    <coverage_type>week</coverage_type>
    <week>{week}</week>
    <players>
      <player><player_key>{key}</player_key><position>{pos}</position></player>
    </players>
  </roster>
</fantasy_content>
```

**Add free agent (POST transactions):**

```xml
<fantasy_content>
  <transaction>
    <type>add</type>
    <player>
      <player_key>{addKey}</player_key>
      <transaction_data>
        <type>add</type>
        <destination_team_key>{teamKey}</destination_team_key>
      </transaction_data>
    </player>
  </transaction>
</fantasy_content>
```

**Drop (POST transactions):** `<type>drop</type>`, single `<player>` with
`<transaction_data><type>drop</type><source_team_key>{teamKey}</source_team_key>`.

**Add/drop (POST transactions):** `<type>add/drop</type>` with a `<players>` list
containing the add player (`destination_team_key`) and the drop player
(`source_team_key`).

**Waiver claim (POST transactions):** same as add (or add/drop), with
`<faab_bid>{n}</faab_bid>` included at the `<transaction>` level when provided.

**Propose trade (POST transactions):**

```xml
<fantasy_content>
  <transaction>
    <type>pending_trade</type>
    <trader_team_key>{trader}</trader_team_key>
    <tradee_team_key>{tradee}</tradee_team_key>
    <trade_note>{note}</trade_note>
    <players>
      <player>
        <player_key>{key}</player_key>
        <transaction_data>
          <type>pending_trade</type>
          <source_team_key>{from}</source_team_key>
          <destination_team_key>{to}</destination_team_key>
        </transaction_data>
      </player>
    </players>
  </transaction>
</fantasy_content>
```

**Respond to trade (PUT `/transaction/{key}`)** — `action` ∈
`accept | reject | allow | disallow | vote_against`; `<trade_note>` for
accept/reject, `<voter_team_key>` for vote_against:

```xml
<fantasy_content>
  <transaction>
    <transaction_key>{key}</transaction_key>
    <type>pending_trade</type>
    <action>{action}</action>
  </transaction>
</fantasy_content>
```

**Edit pending waiver (PUT `/transaction/{key}`):**

```xml
<fantasy_content>
  <transaction>
    <transaction_key>{key}</transaction_key>
    <type>waiver</type>
    <waiver_priority>{priority}</waiver_priority>
    <faab_bid>{bid}</faab_bid>
  </transaction>
</fantasy_content>
```

**Cancel (DELETE `/transaction/{key}`):** no request body.

> The exact strings above are confirmed against Yahoo's documented examples during
> implementation and frozen by the unit tests (TDD: test asserts the string first).

## Files Touched

**Worktree A (PR A):**
- `src/YahooFantasy.ts` — `PUT`/`DELETE` constants, generalized body write, XML
  Content-Type.
- `src/helpers/xmlHelper.ts` — new: `escapeXml`, `buildRosterPayload`.
- `src/resources/rosterResource.ts` — `update()`.
- `src/types/*` — types for `roster.update` signature.
- `test/` — unit tests for `api()` PUT/DELETE behavior, `xmlHelper`, `roster.update`.
- `CLAUDE.md` — note that writes are unit-tested only.

**Worktree B (PR B):** all of A's plumbing (collapses on rebase) plus:
- `src/helpers/xmlHelper.ts` — transaction builder functions.
- `src/collections/transactionsCollection.ts` — replace stubs with real create
  methods.
- `src/resources/transactionResource.ts` — accept/reject/allow/disallow/
  vote_against/edit_waiver/edit_trade/cancel.
- `src/types/collections.ts` + related — replace commented signatures.
- `test/` — unit tests for every transaction write op + builders.

## Open Questions

None — split, scope, ergonomics, testing, and XML strategy are all decided.
