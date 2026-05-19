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
