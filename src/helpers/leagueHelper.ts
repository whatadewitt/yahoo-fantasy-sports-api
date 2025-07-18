// League helper functions - temporary stubs until full migration

import { mapTeam, mapTeamPoints } from './teamHelper';
import { mapTransactionPlayers } from './transactionHelper';

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

export function mapStandings(ts: any): any[] {
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

export function mapTeams(ts: any): any[] {
  const teams = Object.values(ts);

  return teams.reduce((result: any[], t: any) => {
    if (t.team) {
      result.push(mapTeam(t.team[0]));
    }

    return result;
  }, []);
}

export function mapDraft(d: any): any[] {
  const draft = Object.values(d);

  return draft.reduce((result: any[], d: any) => {
    if (d.draft_result) {
      result.push(d.draft_result);
    }

    return result;
  }, []);
}

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