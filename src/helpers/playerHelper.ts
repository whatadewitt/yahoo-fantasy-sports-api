import { mapTeam } from './teamHelper';
import { mergeObjects, yahooArray } from './sharedHelper';
import { MappedPlayer, MappedStats, MappedPoints, MappedOwnership, MappedDraftAnalysis, MappedTeam } from '../types/api-responses';

export function mapPlayer(p: any): MappedPlayer {
  const player = mergeObjects(p);

  if (player.eligible_positions) {
    player.eligible_positions = player.eligible_positions.map(
      (p: any) => p.position
    );
  }

  if (player.starting_status) {
    player.starting_status = player.starting_status
      ? player.starting_status[1].is_starting
      : 0;

    if (player.batting_order) {
      player.batting_order = player.batting_order[0].order_num;
    }
  }

  if (player.player_stats) {
    player.player_stats = mapStats(player.player_stats);
  }

  if (player.player_advanced_stats) {
    player.player_advanced_stats = mapStats(player.player_advanced_stats);
  }

  if (player.player_points) {
    player.player_points = mapPoints(player.player_points);
  }

  if (player.selected_position) {
    player.selected_position = player.selected_position[1].position;
  }

  // Convert headshot object to just the URL string
  if (player.headshot && player.headshot.url) {
    player.headshot = player.headshot.url;
  }

  return player;
}

export function mapStats(stats: any): MappedStats {
  if (!stats) return stats;

  // Handle the structure: stats = { "0": { coverage_type: "season", season: "2014" }, "stats": [...] }
  // Some data uses string key "0", others use numeric index 0
  const statsInfo = stats[0] || stats["0"];
  const coverage_type = statsInfo.coverage_type;
  return {
    coverage_type: coverage_type,
    coverage_value: statsInfo[coverage_type],
    stats: stats.stats.map((s: any) => s.stat),
  };
}

export function mapPoints(points: any): MappedPoints {
  const pointsInfo = points[0] || points["0"];
  const coverage_type = pointsInfo.coverage_type;
  return {
    coverage_type,
    coverage_value: pointsInfo[coverage_type],
    total: points.total,
  };
}

export function mapOwnership(ownership: any): MappedOwnership {
  const o: MappedOwnership = {
    ownership_type: ownership.ownership_type,
  };

  if ("team" === o.ownership_type) {
    o.owner_team_key = ownership.owner_team_key;
    o.owner_team_name = ownership.owner_team_name;
  }

  return o;
}

export function mapDraftAnalysis(analysis: any): MappedDraftAnalysis {
  if (!analysis) return analysis;

  if (Array.isArray(analysis)) {
    const result: MappedDraftAnalysis = {};
    analysis.forEach((item: any) => {
      Object.keys(item).forEach((key) => {
        result[key] = item[key];
      });
    });
    return result;
  }
  
  return analysis;
}

export function parseLeagueCollection(ls: any, subresources: string[] = []): any {
  return yahooArray(ls).map((l: any) => {
    let league = l.league[0];
    league.players = parseCollection(l.league[1].players, subresources);

    return league;
  });
}

export function parseTeamCollection(ts: any, subresources: string[] = []): MappedTeam[] {
  return yahooArray(ts).map((t: any) => {
    let team = mapTeam(t.team[0]);
    team.players = parseCollection(t.team[1].players, subresources);

    return team;
  });
}

export function parseCollection(ps: any, subresources: string[] = []): MappedPlayer[] {
  return yahooArray(ps).map((p: any) => {
    let player = mapPlayer(p.player[0]);

    subresources.forEach((resource, idx) => {
      switch (resource) {
        case "stats":
          player.stats = mapStats(p.player[idx + 1].player_stats);
          break;

        case "percent_owned":
          // Handle the array structure for percent_owned
          const percentOwnedData = p.player[idx + 1].percent_owned;
          if (Array.isArray(percentOwnedData)) {
            player.percent_owned = {
              coverage_type: percentOwnedData[0].coverage_type,
              coverage_value: percentOwnedData[0][percentOwnedData[0].coverage_type],
              value: percentOwnedData[1].value,
              delta: percentOwnedData[2]?.delta || null
            };
          } else {
            player.percent_owned = percentOwnedData;
          }
          break;

        case "ownership":
          const ownershipData = p.player[idx + 1].ownership;
          if (ownershipData) {
            player.ownership = mapOwnership(ownershipData);
          }
          break;

        case "draft_analysis":
          player.draft_analysis = mapDraftAnalysis(
            p.player[idx + 1].draft_analysis
          );
          break;

        default:
          break;
      }
    });

    return player;
  });
}
