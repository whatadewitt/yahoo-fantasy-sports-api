// Team helper functions

// Helper to merge array of objects into single object
function mergeObjects(arrayOfObjects: any[]): any {
  const destinationObj: any = {};

  if (arrayOfObjects) {
    arrayOfObjects.forEach(obj => {
      Object.keys(obj).forEach(key => {
        if (typeof key !== "undefined") {
          destinationObj[key] = obj[key];
        }
      });
    });
  }

  return destinationObj;
}

export function mapTeam(t: any): any {
  const team = mergeObjects(t);
  
  // clean up team_logos
  if (team.team_logos && team.team_logos.length) {
    team.team_logos = team.team_logos.map((logo: any) => logo.team_logo);
  } else {
    // fix issue #49 -- no team logo throwing error
    team.team_logos = [];
  }

  // clean up managers
  if (team.managers) {
    team.managers = team.managers.map((manager: any) => manager.manager);
  }

  return team;
}

export function mapTeamPoints(team: any, points: any): any {
  team.points = points.team_points;

  if (points.team_stats) {
    team.stats = mapStats(points.team_stats.stats);
  }

  if (points.team_projected_points) {
    team.projected_points = points.team_projected_points;
  }

  return team;
}

export function mapStats(stats: any): any {
  return stats.map((s: any) => s.stat);
}

export function mapRoster(roster: any): any {
  return roster;
}

export function mapDraft(draft: any): any {
  return draft;
}

export function mapMatchups(matchups: any): any {
  return matchups;
}