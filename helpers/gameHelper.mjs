import { mapPlayer } from "./playerHelper.mjs";

export function mapLeagues(ls) {
  // TODO: clean this up?
  const count = ls.count;
  const leagues = [];

  for (let i = 0; i < count; i++) {
    leagues.push(ls[i].league[0]);
  }

  return leagues;
}

// todo: again, this should be more re-usable
export function mapPlayers(ps) {
  // TODO: clean this up?
  const count = ps.count;
  let players = [];

  for (let i = 0; i < count; i++) {
    let player = ps[i].player[0];

    // TODO: i hate this, it can def be better...
    for (let j = ps[i].player.length - 1; j > 0; j--) {
      player.push(ps[i].player[j]);
    }

    players.push(player);
  }
  players = players.map(p => mapPlayer(p));

  return players;
}

export function mapWeeks(ws) {
  // TODO: clean this up?
  const count = ws.count;
  const weeks = [];

  for (let i = 0; i < count; i++) {
    weeks.push(ws[i].game_week);
  }

  return weeks;
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
