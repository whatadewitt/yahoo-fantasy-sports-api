import type { MappedPlayer, MappedTeam } from '../types/api-responses';
import { mapPlayers } from './gameHelper';
import { mapDraft, mergeObjects, yahooArray } from './sharedHelper';

export function mapTeam(t: any): MappedTeam {
  const team = mergeObjects(t);

  // clean up team_logos - extract URL from first logo
  if (team.team_logos?.length) {
    team.team_logo = team.team_logos[0].team_logo.url;
  } else {
    // fix issue #49 -- no team logo throwing error
    team.team_logo = '';
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
  const players = r[0].players;
  return mapPlayers(players);
}

export { mapDraft } from './sharedHelper';

function mapMatchupTeams(teams: any): MappedTeam[] {
  return Object.keys(teams)
    .filter((key) => key !== 'count')
    .map((key) => teams[key]?.team)
    .filter((team) => team)
    .map((team) => mapTeam(team[0]));
}

function mapMatchup(matchup: any): any {
  const mappedMatchup: any = {
    week: matchup.week,
    week_start: matchup.week_start,
    week_end: matchup.week_end,
    status: matchup.status,
    is_playoffs: matchup.is_playoffs,
    is_consolation: matchup.is_consolation,
    is_matchup_of_the_week: matchup.is_matchup_of_the_week,
  };

  if (matchup.is_tied !== undefined) mappedMatchup.is_tied = matchup.is_tied;
  if (matchup.winner_team_key)
    mappedMatchup.winner_team_key = matchup.winner_team_key;

  if (matchup[0]?.teams) {
    mappedMatchup.teams = mapMatchupTeams(matchup[0].teams);
  }

  return mappedMatchup;
}

export function mapMatchups(matchups: any): any {
  if (!matchups) return matchups;

  return Object.keys(matchups)
    .filter((key) => matchups[key]?.matchup)
    .map((key) => mapMatchup(matchups[key].matchup));
}

export function parseCollection(
  ts: any,
  subresources: string[] = [],
): MappedTeam[] {
  return yahooArray(ts).map((t: any) => {
    // this is only here because user games collection is adding an extra null
    // and I cannot for the life of me figure out why.
    t.team = t.team.filter((o: any) => null !== o);

    const team = mapTeam(t.team[0]);

    subresources.forEach((resource, idx) => {
      switch (resource) {
        case 'stats':
          // TODO: this could be cleaner...
          if (t.team[idx + 1].team_stats) {
            team.stats = mapStats(t.team[idx + 1].team_stats.stats);
          }

          if (t.team[idx + 1].team_points) {
            team.points = t.team[idx + 1].team_points;
          }

          break;

        case 'standings':
          team.standings = t.team[idx + 1].team_standings;
          break;

        case 'roster':
          team.roster = mapRoster(t.team[idx + 1].roster);
          break;

        case 'draftresults':
          team.draftresults = mapDraft(t.team[idx + 1].draft_results);
          break;

        case 'matchups':
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
  return yahooArray(ls).map((l: any) => {
    const league = l.league[0];
    league.teams = parseCollection(l.league[1].teams, subresources);

    return league;
  });
}

export function parseGameCollection(
  gs: any,
  subresources: string[] = [],
): any[] {
  return yahooArray(gs).map((g: any) => {
    const game = g.game[0];
    game.teams = parseCollection(g.game[1].teams, subresources);

    return game;
  });
}
