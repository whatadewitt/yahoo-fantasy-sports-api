// League helper functions - temporary stubs until full migration

import { mapTeam, mapTeamPoints } from './teamHelper';

export function mapSettings(settings: any): any {
  // TODO: Implement proper settings mapping
  return settings;
}

export function mapStandings(standings: any): any[] {
  // TODO: Implement proper standings mapping
  const teams = Object.values(standings);
  return teams.reduce((result: any[], team: any) => {
    if (team.team) {
      result.push(team.team);
    }
    return result;
  }, []);
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

export function mapTeams(teams: any): any[] {
  // TODO: Implement proper teams mapping
  const teamList = Object.values(teams);
  return teamList.reduce((result: any[], team: any) => {
    if (team.team) {
      result.push(team.team);
    }
    return result;
  }, []);
}

export function mapDraft(draftResults: any): any[] {
  // TODO: Implement proper draft mapping
  const picks = Object.values(draftResults);
  return picks.reduce((result: any[], pick: any) => {
    if (pick.draft_result) {
      result.push(pick.draft_result);
    }
    return result;
  }, []);
}

export function mapTransactions(transactions: any): any[] {
  // TODO: Implement proper transactions mapping
  const transactionList = Object.values(transactions);
  return transactionList.reduce((result: any[], transaction: any) => {
    if (transaction.transaction) {
      result.push(transaction.transaction);
    }
    return result;
  }, []);
}