import { mapTeam, mapTeamPoints } from "./teamHelper.mjs";
import { mapTransactionPlayers } from "./transactionHelper.mjs";

/*
 * Helper function to map data to a "team"
 */
export function mapTeams(ts) {
  const count = ts.count;
  const teams = [];

  for (let i = 0; i < count; i++) {
    teams.push(mapTeam(ts[i].team[0]));
  }

  return teams;
}

export function mapStandings(ts) {
  const count = ts.count;
  const teams = [];

  for (let i = 0; i < count; i++) {
    const team = mapTeam(ts[i].team[0]);
    team.standings = ts[i].team[2].team_standings;
    teams.push(team);
  }

  return teams;
}

export function mapSettings(settings) {
  settings.stat_categories = settings.stat_categories.stats.map(s => {
    s.stat.stat_position_types = s.stat.stat_position_types.map(
      pt => pt.stat_position_type
    );

    return s.stat;
  });

  settings.roster_positions = settings.roster_positions.map(
    p => p.roster_position
  );

  return settings;
}

export function mapDraft(d) {
  const count = d.count;
  const draft = [];

  for (let i = 0; i < count; i++) {
    draft.push(d[i].draft_result);
  }

  return draft;
}

export function mapScoreboard(scoreboard) {
  const count = scoreboard.count;
  let matchups = [];

  for (let i = 0; i < count; i++) {
    matchups.push(scoreboard[i].matchup);
  }

  matchups = matchups.map(m => {
    if (m.matchup_grades) {
      m.matchup_grades = m.matchup_grades.map(grade => {
        return {
          team_key: grade.matchup_grade.team_key,
          grade: grade.matchup_grade.grade
        };
      });
    }

    // TODO: i feel like i should be able to use map teams here...
    const count = m[0].teams.count;
    let teams = [];

    for (let i = 0; i < count; i++) {
      let team = mapTeam(m[0].teams[i].team[0]);
      team = mapTeamPoints(team, m[0].teams[i].team[1]);

      teams.push(team);
    }

    delete m[0];
    m.teams = teams;

    return m;
  });

  return {
    matchups: matchups,
    week: scoreboard.week
  };
}

export function mapTransactions(ts) {
  const count = ts.count;
  const transactions = [];

  for (let i = 0; i < count; i++) {
    let transaction = Object.assign({ players: [] }, ts[i].transaction[0]);

    if (ts[i].transaction[1].players) {
      transaction.players = mapTransactionPlayers(ts[i].transaction[1].players);
    }

    transactions.push(transaction);
  }

  return transactions;
}

export function parseCollection(ls, subresources) {
  const count = ls.count;
  const leagues = [];

  for (let i = 0; i < count; i++) {
    leagues.push(ls[i]);
  }

  return leagues.map(l => {
    let league = l.league[0];

    subresources.forEach((resource, idx) => {
      switch (resource) {
        case "settings":
          league.settings = mapSettings(l.league[idx + 1].settings[0]);
          break;

        case "standings":
          league.standings = mapStandings(l.league[idx + 1].standings[0].teams);
          break;

        case "scoreboard":
          league.scoreboard = mapScoreboard(
            l.league[idx + 1].scoreboard[0].matchups
          );
          break;

        case "teams":
          league.teams = mapTeams(l.league[idx + 1].teams);
          break;

        case "draftresults":
          league.draftresults = mapDraft(l.league[idx + 1].draft_results);
          break;

        case "transactions":
          league.transactions = mapTransactions(l.league[idx + 1].transactions);
          break;

        default:
          break;
      }
    });

    return league;
  });
}
