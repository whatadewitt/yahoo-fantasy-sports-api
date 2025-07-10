// League helper functions - temporary stubs until full migration

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

export function mapScoreboard(matchups: any): any[] {
  // TODO: Implement proper scoreboard mapping
  const matchupList = Object.values(matchups);
  return matchupList.reduce((result: any[], matchup: any) => {
    if (matchup.matchup) {
      result.push(matchup.matchup);
    }
    return result;
  }, []);
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