import { mapPlayer } from "./playerHelper.mjs";

export function mapLeagues(ls) {
  const leagues = Object.values(ls);

  return leagues.reduce((result, l) => {
    if (l.league) {
      result.push(l.league[0]);
    }

    return result;
  }, []);
}

export function mapPlayers(ps) {
  const players = Object.values(ps);

  return players.reduce((result, p) => {
    if (p.player) {
      result.push(mapPlayer(p.player[0], p.player[1]));
    }

    return result;
  }, []);
}

export function mapWeeks(ws) {
  const weeks = Object.values(ws);

  return weeks.reduce((result, w) => {
    if (w.game_week) {
      result.push(w.game_week);
    }

    return result;
  }, []);
}

export function mapStatCategories(statcats) {
  statcats = statcats.map(s => s.stat);

  // additional cleanup...
  statcats = statcats.map(statcat => {
    if ("undefined" != typeof statcat.position_types) {
      statcat.position_types = statcat.position_types.map(
        pt => pt.position_type
      );
    }

    if ("undefined" != typeof statcat.base_stats) {
      statcat.base_stats = statcat.base_stats.map(bs => bs.base_stat.stat_id);
    }

    return statcat;
  });

  return statcats;
}

export function mapPositionTypes(positions) {
  return positions.map(p => p.position_type);
}

export function mapRosterPositions(positions) {
  return positions.map(p => p.roster_position);
}

export function parseCollection(gs, subresources) {
  const count = gs.count;
  const games = [];

  for (let i = 0; i < count; i++) {
    games.push(gs[i]);
  }

  return games.map(g => {
    let game = Array.isArray(g.game) ? g.game[0] : g.game;
    // TODO: figure out the "pick'em" subresources...

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

        case "teams":
          game.teams = mapTeams(g.game[idx + 1].teams);
          break;

        default:
          break;
      }
    });

    return game;
  });
}
