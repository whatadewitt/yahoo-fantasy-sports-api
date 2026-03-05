import { mapTeam, mapTeamPoints } from './teamHelper';
import { mapTransactionPlayers } from './transactionHelper';
import { mapDraft } from './sharedHelper';
import { MappedTeam } from '../types/api-responses';

export function mapSettings(settings: any): any {
  settings.stat_categories = settings.stat_categories.stats.map((s: any) => {
    s.stat.stat_position_types = s.stat.stat_position_types
      ? s.stat.stat_position_types.map(
          (pt: any) => pt.stat_position_type.position_type
        )
      : [];

    return s.stat;
  });

  settings.roster_positions = settings.roster_positions.map(
    (p: any) => p.roster_position
  );

  if (settings.waiver_days) {
    settings.waiver_days = settings.waiver_days.map((d: any) => d.day);
  }

  return settings;
}

export function mapStandings(ts: any): MappedTeam[] {
  const count = ts.count;
  const teams = [];

  for (let i = 0; i < count; i++) {
    const team = mapTeam(ts[i].team[0]);
    team.standings = ts[i].team[2].team_standings;
    teams.push(team);
  }

  return teams;
}

export function mapScoreboard(sb: any): any {
  const scoreboard = Object.values(sb);
  
  // Process matchups following the original implementation
  const matchups = scoreboard.reduce((matchupsResult: any[], m: any) => {
    if (m.matchup) {
      m = m.matchup;
      
      if (m.matchup_grades) {
        m.matchup_grades = m.matchup_grades.map((grade: any) => {
          return {
            team_key: grade.matchup_grade.team_key,
            grade: grade.matchup_grade.grade,
          };
        });
      }

      if (m.stat_winners) {
        m.stat_winners = m.stat_winners.reduce((winners: any[], stat: any) => {
          winners.push(stat.stat_winner);
          return winners;
        }, []);
      }

      const teams = Object.values(m[0].teams);

      // Remove raw data entry from the matchup
      delete m[0];

      m.teams = teams.reduce((teamsResult: any[], t: any) => {
        if (t.team) {
          let team = mapTeam(t.team[0]);
          team = mapTeamPoints(team, t.team[1]);
          teamsResult.push(team);
        }
        return teamsResult;
      }, []);

      matchupsResult.push(m);
    }

    return matchupsResult;
  }, []);

  return {
    matchups: matchups,
  };
}

export function mapTeams(ts: any): MappedTeam[] {
  const teams = Object.values(ts);

  return teams.reduce((result: MappedTeam[], t: any) => {
    if (t.team) {
      result.push(mapTeam(t.team[0]));
    }

    return result;
  }, []);
}

export { mapDraft } from './sharedHelper';

export function mapTransactions(ts: any): any[] {
  const count = ts.count;
  const transactions = [];

  for (let i = 0; i < count; i++) {
    let transaction = Object.assign({ players: [] }, ts[i].transaction[0]);

    if (ts[i].transaction.length > 1 && ts[i].transaction[1].players) {
      transaction.players = mapTransactionPlayers(ts[i].transaction[1].players);
    } else {
      transaction.players = [];
    }

    transactions.push(transaction);
  }

  return transactions;
}

export function parseCollection(ls: any, subresources: string[] = []): any[] {
  const count = ls.count;
  const leagues = [];

  for (let i = 0; i < count; i++) {
    leagues.push(ls[i]);
  }

  return leagues.map((l: any) => {
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