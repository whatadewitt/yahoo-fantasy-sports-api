import { YahooFantasyInstance, Callback } from "../types/core";
import { Roster, Team, FantasyContent } from "../types/api-responses";
import { mapTeam, mapRoster } from "../helpers/teamHelper";
import { extractCallback } from "../helpers/argsParser";

class RosterResource {
  constructor(private yf: YahooFantasyInstance) {}

  // Method overloads for fetch
  fetch(teamKey: string): Promise<Team & { roster: any[] }>;
  fetch(teamKey: string, date: string): Promise<Team & { roster: any[] }>;
  fetch(teamKey: string, week: number): Promise<Team & { roster: any[] }>;
  fetch(teamKey: string, cb: Callback<Team & { roster: any[] }>): void;
  fetch(
    teamKey: string,
    date: string,
    cb: Callback<Team & { roster: any[] }>
  ): void;
  fetch(
    teamKey: string,
    week: number,
    cb: Callback<Team & { roster: any[] }>
  ): void;
  fetch(
    teamKey: string,
    ...args: any[]
  ): Promise<Team & { roster: any[] }> | void {
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

  players(teamKey: string): Promise<Roster>;
  players(teamKey: string, subresources: string | string[]): Promise<Roster>;
  players(
    teamKey: string,
    date: string,
    subresources?: string | string[]
  ): Promise<Roster>;
  players(
    teamKey: string,
    week: number,
    subresources?: string | string[]
  ): Promise<Roster>;
  players(teamKey: string, cb: Callback<Roster>): void;
  players(
    teamKey: string,
    subresources: string | string[],
    cb: Callback<Roster>
  ): void;
  players(teamKey: string, date: string, cb: Callback<Roster>): void;
  players(
    teamKey: string,
    date: string,
    subresources: string | string[],
    cb: Callback<Roster>
  ): void;
  players(teamKey: string, week: number, cb: Callback<Roster>): void;
  players(
    teamKey: string,
    week: number,
    subresources: string | string[],
    cb: Callback<Roster>
  ): void;
  players(teamKey: string, ...args: any[]): Promise<Roster> | void {
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

    // Determine date type
    let dateType = "season"; // default
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

    // Build URL based on whether we have subresource
    if (subresource) {
      url += `/players/${subresource};type=${dateType}`;
      if (dateType !== "season") {
        url += `;${dateType}=${dateValue}`;
      }
    } else {
      url += "/players";
      if (dateType !== "season") {
        url += `;${dateType}=${dateValue}`;
      }
    }

    // TODO: subresources on this resource are buggered. but they already were so fix later...
    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;
    const resultPromise = promise.then((data) =>
      mapRoster(data.fantasy_content.team[1].roster)
    );

    if (cb) {
      resultPromise.then((result) => cb(null, result)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
  }
}

export default RosterResource;
