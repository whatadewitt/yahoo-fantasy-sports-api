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
