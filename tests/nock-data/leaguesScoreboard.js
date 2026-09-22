const recorded = require('./leagueScoreboard.js');

function cloneLeague() {
  return JSON.parse(JSON.stringify(recorded.fantasy_content.league));
}

function buildLeague(leagueKey, week) {
  const league = cloneLeague();

  league[0].league_key = leagueKey;
  league[1].scoreboard.week = week;
  league[1].scoreboard[0].matchups[0].matchup.week = week;

  return league;
}

module.exports = {
  fantasy_content: {
    'xml:lang': 'en-US',
    'yahoo:uri': '/fantasy/v2/leagues;league_keys=328.l.34014,328.l.24281;out=scoreboard',
    leagues: {
      0: { league: buildLeague('328.l.34014', '25') },
      1: { league: buildLeague('328.l.24281', '12') },
      count: 2,
    },
    time: '216.44902229309ms',
    copyright: 'Data provided by Yahoo! and STATS, LLC',
  },
};
