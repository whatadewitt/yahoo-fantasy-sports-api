import { YahooFantasyInstance, Callback } from '../types/core';
import { Roster, Team, FantasyContent } from '../types/api-responses';
import { mapTeam, mapRoster } from '../helpers/teamHelper';
import { extractCallback } from '../helpers/argsParser';

class RosterResource {
  constructor(private yf: YahooFantasyInstance) {}

  // Method overloads for fetch
  fetch(teamKey: string): Promise<Team & { roster: any[] }>;
  fetch(teamKey: string, date: string): Promise<Team & { roster: any[] }>;
  fetch(teamKey: string, week: number): Promise<Team & { roster: any[] }>;
  fetch(teamKey: string, cb: Callback<Team & { roster: any[] }>): void;
  fetch(teamKey: string, date: string, cb: Callback<Team & { roster: any[] }>): void;
  fetch(teamKey: string, week: number, cb: Callback<Team & { roster: any[] }>): void;
  fetch(teamKey: string, ...args: any[]): Promise<Team & { roster: any[] }> | void {
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/roster`;
    const cb = extractCallback(args);

    if (args.length) {
      const date = args[0];
      if (typeof date === 'string' && date.indexOf("-") > 0) {
        // string is date, of format y-m-d
        url += `;date=${date}`;
      } else if (typeof date === 'number' || (typeof date === 'string' && !isNaN(Number(date)))) {
        // number is week...
        url += `;week=${date}`;
      }
    }

    const promise = this.yf.api(this.yf.GET, url) as Promise<FantasyContent<{ team: any[] }>>;
    const resultPromise = promise.then((data) => {
      const team = mapTeam(data.fantasy_content.team[0]);
      const roster = mapRoster(data.fantasy_content.team[1].roster);
      team.roster = roster;
      return team;
    });

    if (cb) {
      resultPromise.then(result => cb(null, result)).catch(e => cb(e));
      return;
    }
    return resultPromise;
  }

  players(teamKey: string): Promise<Roster>;
  players(teamKey: string, date: string): Promise<Roster>;
  players(teamKey: string, week: number): Promise<Roster>;
  players(teamKey: string, cb: Callback<Roster>): void;
  players(teamKey: string, date: string, cb: Callback<Roster>): void;
  players(teamKey: string, week: number, cb: Callback<Roster>): void;
  players(teamKey: string, dateWeekOrCb?: string | number | Callback<Roster>, cb?: Callback<Roster>): Promise<Roster> | void {
    const actualCb = typeof dateWeekOrCb === 'function' ? dateWeekOrCb : cb;
    const param = typeof dateWeekOrCb === 'string' || typeof dateWeekOrCb === 'number' ? dateWeekOrCb : undefined;
    
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/roster`;
    if (param) {
      if (typeof param === 'string') {
        url += `;date=${param}`;
      } else {
        url += `;week=${param}`;
      }
    }

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;
    const resultPromise = promise.then(data => mapRoster(data.fantasy_content.team[1].roster));

    if (actualCb) {
      resultPromise.then(result => actualCb(null, result)).catch(e => actualCb(e));
      return;
    }
    return resultPromise;
  }
}

export default RosterResource;