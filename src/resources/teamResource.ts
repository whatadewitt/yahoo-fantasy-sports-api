import { toCallbackOrPromise } from '../helpers/argsParser';
import {
  mapDraft,
  mapMatchups,
  mapRoster,
  mapTeam,
} from '../helpers/teamHelper';
import type { MappedTeam } from '../types/api-responses';
import type { Callback, YahooFantasyInstance } from '../types/core';

class TeamResource {
  constructor(private yf: YahooFantasyInstance) {}

  meta(teamKey: string): Promise<MappedTeam>;
  meta(teamKey: string, cb: Callback<MappedTeam>): void;
  meta(teamKey: string, cb?: Callback<MappedTeam>): Promise<MappedTeam> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/metadata`,
    ) as Promise<any>;

    const resultPromise = promise.then((data: any) => {
      const meta = mapTeam(data.fantasy_content.team[0]);
      if (!meta) throw new Error('No team data found');
      return meta;
    });

    return toCallbackOrPromise(resultPromise, cb);
  }

  stats(teamKey: string): Promise<any>;
  stats(teamKey: string, week: number): Promise<any>;
  stats(teamKey: string, date: string): Promise<any>;
  stats(teamKey: string, cb: Callback<any>): void;
  stats(teamKey: string, week: number, cb: Callback<any>): void;
  stats(teamKey: string, date: string, cb: Callback<any>): void;
  stats(
    teamKey: string,
    weekDateOrCb?: number | string | Callback<any>,
    cb?: Callback<any>,
  ): Promise<any> | void {
    // Simplified implementation
    const actualCb = typeof weekDateOrCb === 'function' ? weekDateOrCb : cb;
    const param = typeof weekDateOrCb !== 'function' ? weekDateOrCb : undefined;

    let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/stats`;

    if (param !== undefined && param !== null && param !== '') {
      if (typeof param === 'string' && param.indexOf('-') > 0) {
        // string is date, of format YYYY-MM-DD
        url += `;type=date;date=${param}`;
      } else if (typeof param === 'number' && param > 0) {
        // number is week (and greater than 0)
        url += `;type=week;week=${param}`;
      } else if (
        typeof param === 'string' &&
        !Number.isNaN(Number(param)) &&
        Number(param) > 0
      ) {
        // numeric string is week (and greater than 0)
        const week = Number(param);
        url += `;type=week;week=${week}`;
      }
    }

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;
    const resultPromise = promise.then((data) => {
      const rawStats = data.fantasy_content.team[1].team_stats;
      const team = mapTeam(data.fantasy_content.team[0]);

      // Build enhanced stats object
      const statsObj: any = {
        coverage_type: rawStats.coverage_type,
        stats: rawStats.stats.map((s: any) => s.stat),
      };

      // Add coverage value (week or date)
      if (rawStats.coverage_type === 'week') {
        statsObj.week = rawStats.week;
      } else if (rawStats.coverage_type === 'date') {
        statsObj.date = rawStats.date;
      }

      // Add team_points if available (just the total)
      if (data.fantasy_content.team[1].team_points) {
        statsObj.points = data.fantasy_content.team[1].team_points.total;
      }

      // Add team_remaining_games if available (just the total)
      if (data.fantasy_content.team[1].team_remaining_games) {
        statsObj.remaining =
          data.fantasy_content.team[1].team_remaining_games.total;
      }

      team.stats = statsObj;
      return team;
    });

    if (actualCb) {
      resultPromise
        .then((result) => actualCb(null, result))
        .catch((e) => actualCb(e));
      return;
    }
    return resultPromise;
  }

  standings(teamKey: string): Promise<MappedTeam>;
  standings(teamKey: string, cb: Callback<MappedTeam>): void;
  standings(
    teamKey: string,
    cb?: Callback<MappedTeam>,
  ): Promise<MappedTeam> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/standings`,
    ) as Promise<any>;

    const resultPromise = promise.then((data) => {
      const standings = data.fantasy_content.team[1].team_standings;
      const team = mapTeam(data.fantasy_content.team[0]);

      team.standings = standings;
      return team;
    });

    return toCallbackOrPromise(resultPromise, cb);
  }

  roster(teamKey: string): Promise<MappedTeam>;
  roster(teamKey: string, week: number): Promise<MappedTeam>;
  roster(teamKey: string, cb: Callback<MappedTeam>): void;
  roster(teamKey: string, week: number, cb: Callback<MappedTeam>): void;
  roster(
    teamKey: string,
    weekOrCb?: number | Callback<MappedTeam>,
    cb?: Callback<MappedTeam>,
  ): Promise<MappedTeam> | void {
    const actualCb = typeof weekOrCb === 'function' ? weekOrCb : cb;
    const week = typeof weekOrCb === 'number' ? weekOrCb : undefined;

    let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/roster`;
    if (week) url += `;week=${week}`;

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;
    const resultPromise = promise.then((data) => {
      const team = mapTeam(data.fantasy_content.team[0]);
      const roster = mapRoster(data.fantasy_content.team[1].roster);

      team.roster = roster;
      return team;
    });

    if (actualCb) {
      resultPromise
        .then((result) => actualCb(null, result))
        .catch((e) => actualCb(e));
      return;
    }
    return resultPromise;
  }

  draft_results(teamKey: string): Promise<any>;
  draft_results(teamKey: string, cb: Callback<any>): void;
  draft_results(teamKey: string, cb?: Callback<any>): Promise<any> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/draftresults`,
    ) as Promise<any>;

    const resultPromise = promise.then((data) => {
      const team = mapTeam(data.fantasy_content.team[0]);
      const draft_results = mapDraft(
        data.fantasy_content.team[1].draft_results,
      );

      team.draft_results = draft_results;
      return team;
    });

    return toCallbackOrPromise(resultPromise, cb);
  }

  matchups(teamKey: string): Promise<MappedTeam>;
  matchups(teamKey: string, weeks: number[]): Promise<MappedTeam>;
  matchups(teamKey: string, cb: Callback<MappedTeam>): void;
  matchups(teamKey: string, weeks: number[], cb: Callback<MappedTeam>): void;
  matchups(
    teamKey: string,
    weeksOrCb?: number[] | Callback<MappedTeam>,
    cb?: Callback<MappedTeam>,
  ): Promise<MappedTeam> | void {
    const actualCb = typeof weeksOrCb === 'function' ? weeksOrCb : cb;
    const weeks = Array.isArray(weeksOrCb)
      ? weeksOrCb.map((w) => Number(w))
      : typeof weeksOrCb === 'number' ||
          (typeof weeksOrCb === 'string' && !Number.isNaN(Number(weeksOrCb)))
        ? [Number(weeksOrCb)]
        : undefined;

    let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/matchups`;
    if (weeks) url += `;weeks=${weeks.join(',')}`;

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;
    const resultPromise = promise.then((data) => {
      const team = mapTeam(data.fantasy_content.team[0]);
      const matchups = mapMatchups(data.fantasy_content.team[1].matchups);

      team.matchups = matchups;
      return team;
    });

    if (actualCb) {
      resultPromise
        .then((result) => actualCb(null, result))
        .catch((e) => actualCb(e));
      return;
    }
    return resultPromise;
  }
}

export default TeamResource;
