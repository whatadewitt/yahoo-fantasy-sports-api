// Player helper functions

// Helper to merge array of objects into single object
function mergeObjects(arrayOfObjects: any[]): any {
  const destinationObj: any = {};

  if (arrayOfObjects) {
    arrayOfObjects.forEach((obj) => {
      Object.keys(obj).forEach((key) => {
        if (typeof key !== "undefined") {
          destinationObj[key] = obj[key];
        }
      });
    });
  }

  return destinationObj;
}

export function mapPlayer(p: any): any {
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

  return player;
}

export function mapStats(stats: any): any {
  if (!stats) return stats;

  // Handle the structure: stats = { "0": { coverage_type: "season", season: "2014" }, "stats": [...] }
  const coverage_type = stats[0].coverage_type;
  return {
    coverage_type: coverage_type,
    coverage_value: stats[0][coverage_type],
    stats: stats.stats.map((s: any) => s.stat),
  };
}

export function mapPoints(points: any): any {
  const coverage_type = points[0].coverage_type;
  return {
    coverage_type,
    coverage_value: points[0][coverage_type],
    total: points.total,
  };
}

export function mapDraftAnalysis(analysis: any): any {
  // TODO: Implement proper draft analysis mapping
  return analysis;
}
