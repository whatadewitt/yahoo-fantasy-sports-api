import { YahooFantasyInstance, Callback } from '../types/core';
import { Team, TeamStanding, TeamMatchup, Roster } from '../types/api-responses';

class TeamResource {
  constructor(private yf: YahooFantasyInstance) {}

  meta(teamKey: string): Promise<Team>;
  meta(teamKey: string, cb: Callback<Team>): void;
  meta(teamKey: string, cb?: Callback<Team>): Promise<Team> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/metadata`
    ) as Promise<any>;

    const resultPromise = promise.then((data: any) => {
      const meta = data.fantasy_content.team[0];
      if (!meta) throw new Error('No team data found');
      return meta;
    });

    if (cb) {
      resultPromise.then(meta => cb(null, meta)).catch(e => cb(e));
      return;
    }
    return resultPromise;
  }

  stats(teamKey: string): Promise<any>;
  stats(teamKey: string, week: number): Promise<any>;
  stats(teamKey: string, cb: Callback<any>): void;
  stats(teamKey: string, week: number, cb: Callback<any>): void;
  stats(teamKey: string, weekOrCb?: number | Callback<any>, cb?: Callback<any>): Promise<any> | void {
    // Simplified implementation
    const actualCb = typeof weekOrCb === 'function' ? weekOrCb : cb;
    const week = typeof weekOrCb === 'number' ? weekOrCb : undefined;
    
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/stats`;
    if (week) url += `;type=week;week=${week}`;

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;
    const resultPromise = promise.then(data => data.fantasy_content.team);

    if (actualCb) {
      resultPromise.then(result => actualCb(null, result)).catch(e => actualCb(e));
      return;
    }
    return resultPromise;
  }

  standings(teamKey: string): Promise<TeamStanding>;
  standings(teamKey: string, cb: Callback<TeamStanding>): void;
  standings(teamKey: string, cb?: Callback<TeamStanding>): Promise<TeamStanding> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/standings`
    ) as Promise<any>;

    const resultPromise = promise.then(data => data.fantasy_content.team);

    if (cb) {
      resultPromise.then(result => cb(null, result)).catch(e => cb(e));
      return;
    }
    return resultPromise;
  }

  roster(teamKey: string): Promise<Roster>;
  roster(teamKey: string, week: number): Promise<Roster>;
  roster(teamKey: string, cb: Callback<Roster>): void;
  roster(teamKey: string, week: number, cb: Callback<Roster>): void;
  roster(teamKey: string, weekOrCb?: number | Callback<Roster>, cb?: Callback<Roster>): Promise<Roster> | void {
    const actualCb = typeof weekOrCb === 'function' ? weekOrCb : cb;
    const week = typeof weekOrCb === 'number' ? weekOrCb : undefined;
    
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/roster`;
    if (week) url += `;week=${week}`;

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;
    const resultPromise = promise.then(data => data.fantasy_content.team);

    if (actualCb) {
      resultPromise.then(result => actualCb(null, result)).catch(e => actualCb(e));
      return;
    }
    return resultPromise;
  }

  draftResults(teamKey: string): Promise<any>;
  draftResults(teamKey: string, cb: Callback<any>): void;
  draftResults(teamKey: string, cb?: Callback<any>): Promise<any> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/draftresults`
    ) as Promise<any>;

    const resultPromise = promise.then(data => data.fantasy_content.team);

    if (cb) {
      resultPromise.then(result => cb(null, result)).catch(e => cb(e));
      return;
    }
    return resultPromise;
  }

  matchups(teamKey: string): Promise<TeamMatchup[]>;
  matchups(teamKey: string, weeks: number[]): Promise<TeamMatchup[]>;
  matchups(teamKey: string, cb: Callback<TeamMatchup[]>): void;
  matchups(teamKey: string, weeks: number[], cb: Callback<TeamMatchup[]>): void;
  matchups(teamKey: string, weeksOrCb?: number[] | Callback<TeamMatchup[]>, cb?: Callback<TeamMatchup[]>): Promise<TeamMatchup[]> | void {
    const actualCb = typeof weeksOrCb === 'function' ? weeksOrCb : cb;
    const weeks = Array.isArray(weeksOrCb) ? weeksOrCb : undefined;
    
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/matchups`;
    if (weeks) url += `;weeks=${weeks.join(',')}`;

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;
    const resultPromise = promise.then(data => data.fantasy_content.team);

    if (actualCb) {
      resultPromise.then(result => actualCb(null, result)).catch(e => actualCb(e));
      return;
    }
    return resultPromise;
  }
}

export default TeamResource;