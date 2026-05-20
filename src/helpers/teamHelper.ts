import { mapPlayers } from "./gameHelper";
import { parseCollection as parsePlayerCollection } from "./playerHelper";
import { mergeObjects, mapDraft } from "./sharedHelper";
import { MappedTeam, MappedPlayer, Manager } from "../types/api-responses";
import { collectionItems } from "./requestHelper";

export function mapTeam(t: any): MappedTeam {
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

export function mapTeamPoints(team: MappedTeam, points: any): MappedTeam {
  team.points = points.team_points;

  if (points.team_stats) {
    team.stats = mapStats(points.team_stats.stats);
  }

  if (points.team_projected_points) {
    team.projected_points = points.team_projected_points;
  }

  return team;
}

export function mapStats(
  stats: any,
): Array<{ stat_id: string; value: string }> {
  return stats.map((s: any) => s.stat);
}

export function mapRoster(r: any): MappedPlayer[] {
  let players = r[0].players;
  return mapPlayers(players);
}

export { mapDraft } from "./sharedHelper";

export function mapMatchups(matchups: any): any {
  if (!matchups) return matchups;

  return Object.values(matchups)
    .map((entry: any) => entry.matchup)
    .filter(Boolean)
    .map((matchup: any) => {
      const teamsData = matchup[0]?.teams;
      const teams = teamsData
        ? Object.keys(teamsData)
            .filter((teamKey) => teamKey !== "count")
            .map((teamKey) => teamsData[teamKey]?.team?.[0])
            .filter(Boolean)
            .map(mapTeam)
        : [];

      return {
        week: matchup.week,
        week_start: matchup.week_start,
        week_end: matchup.week_end,
        status: matchup.status,
        is_playoffs: matchup.is_playoffs,
        is_consolation: matchup.is_consolation,
        is_matchup_of_the_week: matchup.is_matchup_of_the_week,
        ...(matchup.is_tied !== undefined ? { is_tied: matchup.is_tied } : {}),
        ...(matchup.winner_team_key
          ? { winner_team_key: matchup.winner_team_key }
          : {}),
        ...(teams.length ? { teams } : {}),
      };
    });
}

export function parseCollection(
  ts: any,
  subresources: string[] = [],
): MappedTeam[] {
  const count = ts.count;
  const teams = [];

  for (let i = 0; i < count; i++) {
    teams.push(ts[i]);
  }

  return teams.map((t: any) => {
    // this is only here because user games collection is adding an extra null
    // and I cannot for the life of me figure out why.
    t.team = t.team.filter((o: any) => null !== o);

    let team = mapTeam(t.team[0]);

    subresources.forEach((resource, idx) => {
      switch (resource) {
        case "stats":
          // TODO: this could be cleaner...
          if (t.team[idx + 1].team_stats) {
            team.stats = mapStats(t.team[idx + 1].team_stats.stats);
          }

          if (t.team[idx + 1].team_points) {
            team.points = t.team[idx + 1].team_points;
          }

          break;

        case "standings":
          team.standings = t.team[idx + 1].team_standings;
          break;

        case "roster":
          team.roster = mapRoster(t.team[idx + 1].roster);
          break;

        case "draftresults":
          team.draftresults = mapDraft(t.team[idx + 1].draft_results);
          break;

        case "matchups":
          team.matchups = mapMatchups(t.team[idx + 1].matchups);
          break;

        default:
          break;
      }
    });

    return team;
  });
}

export function parseLeagueCollection(
  ls: any,
  subresources: string[] = [],
): any[] {
  return collectionItems(ls).map((l: any) => {
    let league = l.league[0];
    league.teams = parseCollection(l.league[1].teams, subresources);

    return league;
  });
}

export function parseTeamCollection(
  ts: any,
  subresources: string[] = [],
): MappedTeam[] {
  return collectionItems(ts).map((t: any) => {
    let team = mapTeam(t.team[0]);
    team.players = parsePlayerCollection(t.team[1].players, subresources);

    return team;
  });
}

export function parseGameCollection(
  gs: any,
  subresources: string[] = [],
): any[] {
  return collectionItems(gs).map((g: any) => {
    let game = g.game[0];
    game.teams = parseCollection(g.game[1].teams, subresources);

    return game;
  });
}
