import { mapPlayer } from './playerHelper';
import { MappedPlayer } from '../types/api-responses';

export function mapLeagues(ls: any): any[] {
  const leagues = Object.values(ls);

  return leagues.reduce((result: any[], l: any) => {
    if (l.league) {
      result.push(l.league[0]);
    }
    return result;
  }, []);
}

export function mapPlayers(ps: any): MappedPlayer[] {
  const players = Object.values(ps);

  return players.reduce((result: any[], p: any) => {
    if (p.player) {
      for (let i = 1; i < p.player.length; i++) {
        p.player[0].push(p.player[i]);
      }
      result.push(mapPlayer(p.player[0]));
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
    
    // Convert base_stats to simple array of stat_id strings
    if (typeof statcat.base_stats !== 'undefined' && Array.isArray(statcat.base_stats)) {
      statcat.base_stats = statcat.base_stats.map((bs: any) => {
        if (bs.base_stat && bs.base_stat.stat_id) {
          return bs.base_stat.stat_id;
        }
        return bs;
      });
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

export function parseCollection(gs: any, subresources: string[] = []): any[] {
  const count = gs.count;
  const games = [];

  for (let i = 0; i < count; i++) {
    games.push(gs[i]);
  }

  return games.map((g: any) => {
    let game = Array.isArray(g.game) ? g.game[0] : g.game;
    
    // Handle subresources
    subresources.forEach((resource, idx) => {
      switch (resource) {
        case "leagues":
          game.leagues = mapLeagues(g.game[idx + 1].leagues);
          break;

        case "players":
          game.players = mapPlayers(g.game[idx + 1].players);
          break;

        case "game_weeks":
          game.game_weeks = mapWeeks(g.game[idx + 1].game_weeks);
          break;

        case "stat_categories":
          game.stat_categories = mapStatCategories(
            g.game[idx + 1].stat_categories.stats
          );
          break;

        case "position_types":
          game.position_types = mapPositionTypes(
            g.game[idx + 1].position_types
          );
          break;

        case "roster_positions":
          game.roster_positions = mapRosterPositions(
            g.game[idx + 1].roster_positions
          );
          break;

        default:
          break;
      }
    });
    
    return game;
  });
}