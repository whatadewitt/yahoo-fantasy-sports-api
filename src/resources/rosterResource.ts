import { YahooFantasyInstance, Callback } from "../types/core";
import { MappedTeam, FantasyContent } from "../types/api-responses";
import { mapTeam, mapRoster } from "../helpers/teamHelper";
import { extractCallback } from "../helpers/argsParser";
import {
  buildRosterPayload,
  RosterCoverage,
  RosterSlot,
} from "../helpers/xmlHelper";
import { asArray, withCallback } from "../helpers/requestHelper";

function isRosterDateOrWeek(value: any): boolean {
  return (
    typeof value === "number" ||
    (typeof value === "string" &&
      (value.indexOf("-") > 0 || !isNaN(Number(value))))
  );
}

function isRosterSubresource(value: any): boolean {
  return (
    Array.isArray(value) ||
    (typeof value === "string" && !isRosterDateOrWeek(value))
  );
}

function rosterCoverage(dateWeekParam?: string | number): {
  type: "season" | "date" | "week";
  value: string;
} {
  if (dateWeekParam === undefined || dateWeekParam === 0) {
    return { type: "season", value: "" };
  }

  return typeof dateWeekParam === "string" && dateWeekParam.indexOf("-") > 0
    ? { type: "date", value: dateWeekParam }
    : { type: "week", value: String(dateWeekParam) };
}

function buildRosterPlayersUrl(teamKey: string, args: any[]): string {
  const dateWeekParam = args.find(isRosterDateOrWeek) as
    | string
    | number
    | undefined;
  const rawSubresources = args.find(isRosterSubresource);
  const subresources = asArray<string>(rawSubresources);
  const coverage = rosterCoverage(dateWeekParam);
  const base = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/roster`;
  const dateSelector =
    coverage.type === "season" ? "" : `;${coverage.type}=${coverage.value}`;
  const subresourcePath = subresources.join(",");

  return subresourcePath
    ? `${base}${dateSelector}/players/${subresourcePath};type=${coverage.type}${dateSelector}`
    : `${base}${dateSelector}`;
}

function mapRosterTeam(data: any): MappedTeam {
  const team = mapTeam(data.fantasy_content.team[0]);
  team.roster = mapRoster(data.fantasy_content.team[1].roster);
  return team;
}

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
    const cb = extractCallback(args) as Callback<MappedTeam> | undefined;
    const value = args[0];
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/roster`;

    if (typeof value === "string" && value.indexOf("-") > 0) {
      url += `;date=${value}`;
    } else if (
      typeof value === "number" ||
      (typeof value === "string" && !isNaN(Number(value)))
    ) {
      url += `;week=${value}`;
    }

    const promise = (
      this.yf.api(this.yf.GET, url) as Promise<FantasyContent<{ team: any[] }>>
    ).then(mapRosterTeam);

    return withCallback(promise, cb);
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
    const cb = extractCallback(args) as Callback<MappedTeam> | undefined;
    const url = buildRosterPlayersUrl(teamKey, args);
    const promise = (this.yf.api(this.yf.GET, url) as Promise<any>).then(
      mapRosterTeam,
    );

    return withCallback(promise, cb);
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

    if (cb) {
      promise.then((data) => cb(null, data)).catch((e) => cb(e));
      return;
    }
    return promise;
  }
}

export default RosterResource;
