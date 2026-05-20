import { YahooFantasyInstance, Callback } from "../types/core";
import { MappedTeam } from "../types/api-responses";
import {
  mapTeam,
  mapStats,
  mapRoster,
  mapDraft,
  mapMatchups,
} from "../helpers/teamHelper";
import { withCallback } from "../helpers/requestHelper";

function teamStatsUrl(
  teamKey: string,
  statParam?: number | string | Callback<any>,
): string {
  const url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/stats`;

  if (typeof statParam === "string" && statParam.indexOf("-") > 0) {
    return `${url};type=date;date=${statParam}`;
  }

  const week = Number(statParam);
  return week > 0 ? `${url};type=week;week=${week}` : url;
}

function mapTeamStatsResponse(data: any): MappedTeam {
  const teamData = data.fantasy_content.team;
  const team = mapTeam(teamData[0]);

  team.stats = {
    coverage_type: teamData[1].team_stats.coverage_type,
    stats: mapStats(teamData[1].team_stats.stats),
    ...(teamData[1].team_stats.coverage_type === "week"
      ? { week: teamData[1].team_stats.week }
      : {}),
    ...(teamData[1].team_stats.coverage_type === "date"
      ? { date: teamData[1].team_stats.date }
      : {}),
    ...(teamData[1].team_points
      ? { points: teamData[1].team_points.total }
      : {}),
    ...(teamData[1].team_remaining_games
      ? { remaining: teamData[1].team_remaining_games.total }
      : {}),
  } as any;

  return team;
}

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
      if (!meta) throw new Error("No team data found");
      return meta;
    });

    if (cb) {
      resultPromise.then((meta) => cb(null, meta)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
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
    const actualCb = typeof weekDateOrCb === "function" ? weekDateOrCb : cb;
    const statParam =
      typeof weekDateOrCb === "function" ? undefined : weekDateOrCb;
    const promise = (
      this.yf.api(this.yf.GET, teamStatsUrl(teamKey, statParam)) as Promise<any>
    ).then(mapTeamStatsResponse);

    return withCallback(promise, actualCb);
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

    if (cb) {
      resultPromise.then((result) => cb(null, result)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
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
    const actualCb = typeof weekOrCb === "function" ? weekOrCb : cb;
    const week = typeof weekOrCb === "number" ? weekOrCb : undefined;

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

    if (cb) {
      resultPromise.then((result) => cb(null, result)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
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
    const actualCb = typeof weeksOrCb === "function" ? weeksOrCb : cb;
    let weeks: number[] | undefined;

    if (Array.isArray(weeksOrCb)) {
      weeks = weeksOrCb.map((week) => Number(week));
    }

    const url = weeks?.length
      ? `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/matchups;weeks=${weeks.join(",")}`
      : `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/matchups`;
    const promise = (this.yf.api(this.yf.GET, url) as Promise<any>).then(
      (data) => {
        const team = mapTeam(data.fantasy_content.team[0]);
        team.matchups = mapMatchups(data.fantasy_content.team[1].matchups);
        return team;
      },
    );

    return withCallback(promise, actualCb);
  }
}

export default TeamResource;
