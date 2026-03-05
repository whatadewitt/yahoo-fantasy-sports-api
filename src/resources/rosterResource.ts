import { YahooFantasyInstance, Callback } from "../types/core";
import { MappedTeam, FantasyContent } from "../types/api-responses";
import { mapTeam, mapRoster } from "../helpers/teamHelper";
import { extractCallback } from "../helpers/argsParser";

class RosterResource {
  constructor(private yf: YahooFantasyInstance) {}

  // Method overloads for fetch
  fetch(teamKey: string): Promise<MappedTeam>;
  fetch(teamKey: string, date: string): Promise<MappedTeam>;
  fetch(teamKey: string, week: number): Promise<MappedTeam>;
  fetch(teamKey: string, cb: Callback<MappedTeam>): void;
  fetch(
    teamKey: string,
    date: string,
    cb: Callback<MappedTeam>
  ): void;
  fetch(
    teamKey: string,
    week: number,
    cb: Callback<MappedTeam>
  ): void;
  fetch(
    teamKey: string,
    ...args: any[]
  ): Promise<MappedTeam> | void {
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/roster`;
    const cb = extractCallback(args);

    if (args.length) {
      const date = args[0];
      if (typeof date === "string" && date.indexOf("-") > 0) {
        // string is date, of format y-m-d
        url += `;date=${date}`;
      } else if (
        typeof date === "number" ||
        (typeof date === "string" && !isNaN(Number(date)))
      ) {
        // number is week...
        url += `;week=${date}`;
      }
    }

    const promise = this.yf.api(this.yf.GET, url) as Promise<
      FantasyContent<{ team: any[] }>
    >;
    const resultPromise = promise.then((data) => {
      const team = mapTeam(data.fantasy_content.team[0]);
      const roster = mapRoster(data.fantasy_content.team[1].roster);
      team.roster = roster;
      return team;
    });

    if (cb) {
      resultPromise.then((result) => cb(null, result)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
  }

  players(teamKey: string): Promise<MappedTeam>;
  players(teamKey: string, subresources: string | string[]): Promise<MappedTeam>;
  players(
    teamKey: string,
    date: string,
    subresources?: string | string[]
  ): Promise<MappedTeam>;
  players(
    teamKey: string,
    week: number,
    subresources?: string | string[]
  ): Promise<MappedTeam>;
  players(teamKey: string, cb: Callback<MappedTeam>): void;
  players(
    teamKey: string,
    subresources: string | string[],
    cb: Callback<MappedTeam>
  ): void;
  players(teamKey: string, date: string, cb: Callback<MappedTeam>): void;
  players(
    teamKey: string,
    date: string,
    subresources: string | string[],
    cb: Callback<MappedTeam>
  ): void;
  players(teamKey: string, week: number, cb: Callback<MappedTeam>): void;
  players(
    teamKey: string,
    week: number,
    subresources: string | string[],
    cb: Callback<MappedTeam>
  ): void;
  players(teamKey: string, ...args: any[]): Promise<MappedTeam> | void {
    const cb = extractCallback(args);

    let dateWeekParam: string | number | undefined;
    let subresource: string = "";

    for (const arg of args) {
      if (typeof arg === "string") {
        if (arg.indexOf("-") > 0) {
          // Date format YYYY-MM-DD
          dateWeekParam = arg;
        } else if (isNaN(Number(arg))) {
          // Non-numeric string, likely a subresource
          subresource = arg;
        } else {
          // Numeric string, treat as week
          dateWeekParam = arg;
        }
      } else if (typeof arg === "number") {
        dateWeekParam = arg;
      }
    }

    let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/roster`;

    let dateType = "season";
    let dateValue = "";

    if (dateWeekParam) {
      if (typeof dateWeekParam === "string" && dateWeekParam.indexOf("-") > 0) {
        dateType = "date";
        dateValue = dateWeekParam;
      } else {
        dateType = "week";
        dateValue = String(dateWeekParam);
      }
    }

    if (subresource && dateType) {
      if (dateType !== "season") {
        url += `;${dateType}=${dateValue}`;
      }
      url += `/players/${subresource};type=${dateType}`;
      if (dateType !== "season") {
        url += `;${dateType}=${dateValue}`;
      }
    } else if (dateType !== "season") {
      url += `;${dateType}=${dateValue}`;
    }

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;
    const resultPromise = promise.then((data) => {
      const team = mapTeam(data.fantasy_content.team[0]);
      const roster = mapRoster(data.fantasy_content.team[1].roster);
      team.roster = roster;
      return team;
    });

    if (cb) {
      resultPromise.then((result) => cb(null, result)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
  }
}

export default RosterResource;
