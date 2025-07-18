// Team helper functions
import { mapPlayers } from './gameHelper';

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
  
  // clean up team_logos - extract URL from first logo
  if (team.team_logos && team.team_logos.length) {
    team.team_logo = team.team_logos[0].team_logo.url;
  } else {
    // fix issue #49 -- no team logo throwing error
    team.team_logo = "";
  }
  
  // Remove the original team_logos array
  delete team.team_logos;

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

export function mapRoster(r: any): any {
  let players = r[0].players;
  return mapPlayers(players);
}

export function mapDraft(draft: any): any {
  if (!draft) return draft;
  
  const results = [];
  const keys = Object.keys(draft);
  
  for (const key of keys) {
    if (draft[key] && draft[key].draft_result) {
      results.push(draft[key].draft_result);
    }
  }
  
  return results;
}

export function mapMatchups(matchups: any): any {
  if (!matchups) return matchups;
  
  const results = [];
  const keys = Object.keys(matchups);
  
  for (const key of keys) {
    if (matchups[key] && matchups[key].matchup) {
      const matchup = matchups[key].matchup;
      
      // Start with the matchup properties (week, week_start, week_end, status, etc.)
      const mappedMatchup: any = {
        week: matchup.week,
        week_start: matchup.week_start,
        week_end: matchup.week_end,
        status: matchup.status,
        is_playoffs: matchup.is_playoffs,
        is_consolation: matchup.is_consolation,
        is_matchup_of_the_week: matchup.is_matchup_of_the_week
      };
      
      // Add other properties that might exist
      if (matchup.is_tied !== undefined) mappedMatchup.is_tied = matchup.is_tied;
      if (matchup.winner_team_key) mappedMatchup.winner_team_key = matchup.winner_team_key;
      
      // Handle teams in the matchup
      if (matchup[0] && matchup[0].teams) {
        const teams = [];
        const teamKeys = Object.keys(matchup[0].teams);
        
        for (const teamKey of teamKeys) {
          if (teamKey !== 'count') {
            const teamData = matchup[0].teams[teamKey];
            if (teamData && teamData.team) {
              teams.push(mapTeam(teamData.team[0]));
            }
          }
        }
        
        mappedMatchup.teams = teams;
      }
      
      results.push(mappedMatchup);
    }
  }
  
  return results;
}