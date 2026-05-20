import { YahooFantasyInstance, Callback } from "../types/core";
import {
  League,
  LeagueSettings,
  MappedTeam,
  MappedPlayer,
  Transaction,
  FantasyContent,
} from "../types/api-responses";
import {
  mapSettings,
  mapStandings,
  mapScoreboard,
  mapTeams,
  mapDraft,
  mapTransactions,
} from "../helpers/leagueHelper";
import { mapPlayers } from "../helpers/gameHelper";
import { extractCallback } from "../helpers/argsParser";
import {
  appendSemicolonParams,
  asArray,
  getAndMap,
  withCallback,
} from "../helpers/requestHelper";

class LeagueResource {
  constructor(public yf: YahooFantasyInstance) {}

  // Method overloads for meta
  meta(leagueKey: string): Promise<League>;
  meta(leagueKey: string, cb: Callback<League>): void;
  meta(leagueKey: string, cb?: Callback<League>): Promise<League> | void {
    return getAndMap(
      this.yf,
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/metadata`,
      (data) => {
        const meta = data.fantasy_content.league[0];
        if (!meta) {
          throw new Error("No league data found");
        }
        return meta;
      },
      cb,
    );
  }

  // Method overloads for settings
  settings(leagueKey: string): Promise<LeagueSettings>;
  settings(leagueKey: string, cb: Callback<LeagueSettings>): void;
  settings(
    leagueKey: string,
    cb?: Callback<LeagueSettings>,
  ): Promise<LeagueSettings> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/settings`,
    ) as Promise<FantasyContent<{ league: any[] }>>;

    const resultPromise: Promise<LeagueSettings> = promise.then((data) => {
      const settings = mapSettings(data.fantasy_content.league[1].settings[0]);
      if (!settings) {
        throw new Error("No league settings found");
      }
      return settings;
    });

    if (cb) {
      resultPromise.then((settings) => cb(null, settings)).catch((e) => cb(e));
      return;
    } else {
      return resultPromise;
    }
  }

  // Method overloads for standings
  standings(leagueKey: string): Promise<League & { standings: MappedTeam[] }>;
  standings(
    leagueKey: string,
    cb: Callback<League & { standings: MappedTeam[] }>,
  ): void;
  standings(
    leagueKey: string,
    cb?: Callback<League & { standings: MappedTeam[] }>,
  ): Promise<League & { standings: MappedTeam[] }> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/standings`,
    ) as Promise<FantasyContent<{ league: any[] }>>;

    const resultPromise: Promise<League & { standings: MappedTeam[] }> =
      promise.then((data) => {
        const standings = mapStandings(
          data.fantasy_content.league[1].standings[0].teams,
        );
        const league = data.fantasy_content.league[0] as League;
        return { ...league, standings };
      });

    if (cb) {
      resultPromise.then((result) => cb(null, result)).catch((e) => cb(e));
      return;
    } else {
      return resultPromise;
    }
  }

  // Method overloads for scoreboard (h2h only)
  scoreboard(leagueKey: string): Promise<any>;
  scoreboard(leagueKey: string, week: number): Promise<any>;
  scoreboard(leagueKey: string, cb: Callback<any>): void;
  scoreboard(leagueKey: string, week: number, cb: Callback<any>): void;
  scoreboard(leagueKey: string, ...args: any[]): Promise<any> | void {
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/scoreboard`;
    const cb = extractCallback(args);
    let requestedWeek: number | undefined;
    if (args.length) {
      const week = args[0];
      if (
        typeof week === "number" ||
        (typeof week === "string" && !isNaN(Number(week)))
      ) {
        requestedWeek = Number(week);
        url += `;week=${requestedWeek}`;
      }
    }

    const promise = this.yf.api(this.yf.GET, url) as Promise<
      FantasyContent<{ league: any[] }>
    >;

    const resultPromise: Promise<any> = promise.then((data) => {
      const scoreboardData = data.fantasy_content.league[1].scoreboard;
      const scoreboard = mapScoreboard(scoreboardData[0].matchups);
      const league = data.fantasy_content.league[0];

      league.scoreboard = scoreboard;
      // Use the requested week if provided, otherwise use the week from the scoreboard data
      league.scoreboard.week =
        requestedWeek !== undefined ? requestedWeek : scoreboardData.week;
      return league;
    });

    if (cb) {
      resultPromise.then((result) => cb(null, result)).catch((e) => cb(e));
      return;
    } else {
      return resultPromise;
    }
  }

  // Method overloads for teams
  teams(leagueKey: string): Promise<MappedTeam[]>;
  teams(leagueKey: string, cb: Callback<MappedTeam[]>): void;
  teams(
    leagueKey: string,
    cb?: Callback<MappedTeam[]>,
  ): Promise<MappedTeam[]> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/teams`,
    ) as Promise<FantasyContent<{ league: any[] }>>;

    const resultPromise: Promise<MappedTeam[]> = promise.then((data) => {
      const teams = mapTeams(data.fantasy_content.league[1].teams);
      return teams;
    });

    if (cb) {
      resultPromise.then((teams) => cb(null, teams)).catch((e) => cb(e));
      return;
    } else {
      return resultPromise;
    }
  }

  // Method overloads for draft_results
  draft_results(leagueKey: string): Promise<any>;
  draft_results(leagueKey: string, cb: Callback<any>): void;
  draft_results(leagueKey: string, cb?: Callback<any>): Promise<any> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/draftresults`,
    ) as Promise<FantasyContent<{ league: any[] }>>;

    const resultPromise: Promise<any> = promise.then((data) => {
      const draft = mapDraft(data.fantasy_content.league[1].draft_results);
      return draft;
    });

    if (cb) {
      resultPromise.then((draft) => cb(null, draft)).catch((e) => cb(e));
      return;
    } else {
      return resultPromise;
    }
  }

  // Alias for consistency with interface
  draftResults(leagueKey: string): Promise<any>;
  draftResults(leagueKey: string, cb: Callback<any>): void;
  draftResults(leagueKey: string, cb?: Callback<any>): Promise<any> | void {
    return cb
      ? this.draft_results(leagueKey, cb)
      : this.draft_results(leagueKey);
  }

  // Method overloads for transactions
  transactions(leagueKey: string): Promise<Transaction[]>;
  transactions(leagueKey: string, cb: Callback<Transaction[]>): void;
  transactions(
    leagueKey: string,
    cb?: Callback<Transaction[]>,
  ): Promise<Transaction[]> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/transactions`,
    ) as Promise<FantasyContent<{ league: any[] }>>;

    const resultPromise: Promise<Transaction[]> = promise.then((data) => {
      const transactions = mapTransactions(
        data.fantasy_content.league[1].transactions,
      );
      return transactions;
    });

    if (cb) {
      resultPromise
        .then((transactions) => cb(null, transactions))
        .catch((e) => cb(e));
      return;
    } else {
      return resultPromise;
    }
  }

  // Method overloads for players (WIP... not sure this is useful... certainly doesn't feel good...)
  players(leagueKey: string): Promise<MappedPlayer[]>;
  players(leagueKey: string, cb: Callback<MappedPlayer[]>): void;
  players(leagueKey: string, playerKeys: string[]): Promise<MappedPlayer[]>;
  players(
    leagueKey: string,
    playerKeys: string[],
    cb: Callback<MappedPlayer[]>,
  ): void;
  players(
    leagueKey: string,
    playerKeys: string[],
    week: number,
  ): Promise<MappedPlayer[]>;
  players(
    leagueKey: string,
    playerKeys: string[],
    week: number,
    cb: Callback<MappedPlayer[]>,
  ): void;
  players(leagueKey: string, ...args: any[]): Promise<MappedPlayer[]> | void {
    const cb = extractCallback(args) as Callback<MappedPlayer[]> | undefined;
    const playerKeys = asArray<string>(args.length ? args.shift() : []);
    const weekParam = args.find(
      (arg) =>
        typeof arg === "number" ||
        (typeof arg === "string" && !isNaN(Number(arg))),
    );
    const week = weekParam === undefined ? undefined : Number(weekParam);
    const playerSelector = playerKeys.length
      ? `;player_keys=${playerKeys.join(",")}`
      : "";
    const url = appendSemicolonParams(
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/players${playerSelector}/stats`,
      [["week", week]],
    );
    const promise = this.yf.api(this.yf.GET, url) as Promise<
      FantasyContent<{ league: any[] }>
    >;

    const resultPromise: Promise<MappedPlayer[]> = promise.then((data) => {
      const players = mapPlayers(data.fantasy_content.league[1].players);
      return players;
    });

    return withCallback(resultPromise, cb);
  }
}

export default LeagueResource;
