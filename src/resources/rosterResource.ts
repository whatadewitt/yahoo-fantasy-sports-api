import { YahooFantasyInstance, Callback } from '../types/core';
import { Roster } from '../types/api-responses';

class RosterResource {
  constructor(private yf: YahooFantasyInstance) {}

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
    const resultPromise = promise.then(data => data.fantasy_content.team[1].roster);

    if (actualCb) {
      resultPromise.then(result => actualCb(null, result)).catch(e => actualCb(e));
      return;
    }
    return resultPromise;
  }
}

export default RosterResource;