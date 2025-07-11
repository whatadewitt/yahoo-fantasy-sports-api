// Player helper functions - temporary stubs until full migration

export function mapPlayer(player: any): any {
  // TODO: Implement proper player mapping
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

export function mapDraftAnalysis(analysis: any): any {
  // TODO: Implement proper draft analysis mapping
  return analysis;
}