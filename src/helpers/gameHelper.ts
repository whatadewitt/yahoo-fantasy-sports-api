// Game helper functions - temporary stubs until full migration

export function mapLeagues(ls: any): any[] {
  const leagues = Object.values(ls);

  return leagues.reduce((result: any[], l: any) => {
    if (l.league) {
      result.push(l.league[0]);
    }
    return result;
  }, []);
}

export function mapPlayers(ps: any): any[] {
  const players = Object.values(ps);

  return players.reduce((result: any[], p: any) => {
    if (p.player) {
      for (let i = 1; i < p.player.length; i++) {
        p.player[0].push(p.player[i]);
      }
      // TODO: Import mapPlayer when playerHelper is migrated
      result.push(p.player[0]);
    }
    return result;
  }, []);
}

export function mapWeeks(ws: any): any[] {
  const weeks = Object.values(ws);

  return weeks.reduce((result: any[], w: any) => {
    if (w.game_week) {
      result.push(w.game_week);
    }
    return result;
  }, []);
}

export function mapStatCategories(statcats: any[]): any[] {
  statcats = statcats.map((s: any) => s.stat);

  // additional cleanup...
  statcats = statcats.map((statcat: any) => {
    if (typeof statcat.position_types !== 'undefined') {
      statcat.position_types = statcat.position_types.map(
        (pt: any) => pt.position_type
      );
    }
    return statcat;
  });

  return statcats;
}

export function mapPositionTypes(position_types: any[]): any[] {
  return Object.values(position_types).reduce((result: any[], pt: any) => {
    if (pt.position_type) {
      result.push(pt.position_type);
    }
    return result;
  }, []);
}

export function mapRosterPositions(roster_positions: any[]): any[] {
  return Object.values(roster_positions).reduce((result: any[], rp: any) => {
    if (rp.roster_position) {
      result.push(rp.roster_position);
    }
    return result;
  }, []);
}