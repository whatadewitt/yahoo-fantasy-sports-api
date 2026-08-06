import { extractCallback, toCallbackOrPromise } from '../helpers/argsParser';
import { coverageFilter, resolveCoverage } from '../helpers/coverageHelper';
import {
  buildRosterUrl,
  mapTeamWithRoster,
  parseRosterArgs,
} from '../helpers/rosterHelper';
import {
  buildRosterPayload,
  type RosterCoverage,
  type RosterSlot,
} from '../helpers/xmlHelper';
import type { FantasyContent, MappedTeam } from '../types/api-responses';
import type { Callback, YahooFantasyInstance } from '../types/core';

class RosterResource {
  constructor(private yf: YahooFantasyInstance) {}

  // Method overloads for fetch
  fetch(teamKey: string): Promise<MappedTeam>;
  fetch(teamKey: string, date: string): Promise<MappedTeam>;
  fetch(teamKey: string, week: number): Promise<MappedTeam>;
  fetch(teamKey: string, cb: Callback<MappedTeam>): void;
  fetch(teamKey: string, date: string, cb: Callback<MappedTeam>): void;
  fetch(teamKey: string, week: number, cb: Callback<MappedTeam>): void;
  fetch(teamKey: string, ...args: any[]): Promise<MappedTeam> | void {
    const cb = extractCallback(args);
    const coverage = resolveCoverage(args[0]);
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/roster${coverageFilter(coverage)}`;

    const promise = this.yf.api(this.yf.GET, url) as Promise<
      FantasyContent<{ team: any[] }>
    >;
    const resultPromise = promise.then(mapTeamWithRoster);

    return toCallbackOrPromise(resultPromise, cb);
  }

  players(teamKey: string): Promise<MappedTeam>;
  players(
    teamKey: string,
    subresources: string | string[],
  ): Promise<MappedTeam>;
  players(
    teamKey: string,
    date: string,
    subresources?: string | string[],
  ): Promise<MappedTeam>;
  players(
    teamKey: string,
    week: number,
    subresources?: string | string[],
  ): Promise<MappedTeam>;
  players(teamKey: string, cb: Callback<MappedTeam>): void;
  players(
    teamKey: string,
    subresources: string | string[],
    cb: Callback<MappedTeam>,
  ): void;
  players(teamKey: string, date: string, cb: Callback<MappedTeam>): void;
  players(
    teamKey: string,
    date: string,
    subresources: string | string[],
    cb: Callback<MappedTeam>,
  ): void;
  players(teamKey: string, week: number, cb: Callback<MappedTeam>): void;
  players(
    teamKey: string,
    week: number,
    subresources: string | string[],
    cb: Callback<MappedTeam>,
  ): void;
  players(teamKey: string, ...args: any[]): Promise<MappedTeam> | void {
    const cb = extractCallback(args);
    const { param, subresource } = parseRosterArgs(args);
    const coverage = resolveCoverage(param);
    const url = buildRosterUrl(teamKey, coverage, subresource);

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;
    const resultPromise = promise.then(mapTeamWithRoster);

    return toCallbackOrPromise(resultPromise, cb);
  }

  update(
    teamKey: string,
    coverage: RosterCoverage,
    players: RosterSlot[],
  ): Promise<any>;
  update(
    teamKey: string,
    coverage: RosterCoverage,
    players: RosterSlot[],
    cb: Callback<any>,
  ): void;
  update(
    teamKey: string,
    coverage: RosterCoverage,
    players: RosterSlot[],
    cb?: Callback<any>,
  ): Promise<any> | void {
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/roster`;
    const body = buildRosterPayload(coverage, players);
    const promise = this.yf.api(this.yf.PUT, url, body) as Promise<any>;

    return toCallbackOrPromise(promise, cb);
  }
}

export default RosterResource;
