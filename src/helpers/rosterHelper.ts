import type { FantasyContent, MappedTeam } from '../types/api-responses';
import { type Coverage, coverageFilter } from './coverageHelper';
import { mapRoster, mapTeam } from './teamHelper';

export function parseRosterArgs(args: any[]): {
  param?: string | number;
  subresource: string;
} {
  let param: string | number | undefined;
  let subresource = '';

  for (const arg of args) {
    if (typeof arg === 'number') {
      param = arg;
    } else if (typeof arg === 'string') {
      if (arg.indexOf('-') > 0 || !Number.isNaN(Number(arg))) {
        param = arg;
      } else {
        subresource = arg;
      }
    }
  }

  return { param, subresource };
}

export function buildRosterUrl(
  teamKey: string,
  coverage: Coverage,
  subresource: string,
): string {
  const base = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/roster`;
  const filter = coverageFilter(coverage);

  if (subresource) {
    return `${base}${filter}/players/${subresource};type=${coverage.type}${filter}`;
  }

  return `${base}${filter}`;
}

export function mapTeamWithRoster(
  data: FantasyContent<{ team: any[] }>,
): MappedTeam {
  const team = mapTeam(data.fantasy_content.team[0]);
  team.roster = mapRoster(data.fantasy_content.team[1].roster);
  return team;
}
