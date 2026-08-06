import { extractCallback, toCallbackOrPromise } from '../helpers/argsParser';
import { mapPlayers } from '../helpers/gameHelper';
import {
  mapDraft,
  mapScoreboard,
  mapSettings,
  mapStandings,
  mapTeams,
  mapTransactions,
} from '../helpers/leagueHelper';
import type {
  FantasyContent,
  League,
  LeagueSettings,
  MappedPlayer,
  MappedTeam,
  Transaction,
} from '../types/api-responses';
import type { Callback, YahooFantasyInstance } from '../types/core';

class LeagueResource {
  constructor(public yf: YahooFantasyInstance) {}

  // Method overloads for meta
  meta(leagueKey: string): Promise<League>;
  meta(leagueKey: string, cb: Callback<League>): void;
  meta(leagueKey: string, cb?: Callback<League>): Promise<League> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/metadata`,
    ) as Promise<FantasyContent<{ league: League[] }>>;

    const resultPromise: Promise<League> = promise.then((data) => {
      const meta = data.fantasy_content.league[0];
      if (!meta) {
        throw new Error('No league data found');
      }
      return meta;
    });

    return toCallbackOrPromise(resultPromise, cb);
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
        throw new Error('No league settings found');
      }
      return settings;
    });

    return toCallbackOrPromise(resultPromise, cb);
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

    return toCallbackOrPromise(resultPromise, cb);
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
        typeof week === 'number' ||
        (typeof week === 'string' && !Number.isNaN(Number(week)))
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

    return toCallbackOrPromise(resultPromise, cb);
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

    return toCallbackOrPromise(resultPromise, cb);
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

    return toCallbackOrPromise(resultPromise, cb);
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

    return toCallbackOrPromise(resultPromise, cb);
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
    const cb = extractCallback(args);
    let playerKeys: string[] = args.length ? args.shift() : [];
    let week: number | false = false;

    if (playerKeys && !Array.isArray(playerKeys)) {
      playerKeys = [playerKeys];
    }

    if (args.length) {
      const weekParam = args.shift();
      if (
        typeof weekParam === 'number' ||
        (typeof weekParam === 'string' && !Number.isNaN(Number(weekParam)))
      ) {
        week = Number(weekParam);
      }
    }

    let url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/players;`;

    if (playerKeys?.length) {
      url += `player_keys=${playerKeys.join(',')}`;
    }

    url += '/stats';

    if (week) {
      url += `;week=${week}`;
    }

    const promise = this.yf.api(this.yf.GET, url) as Promise<
      FantasyContent<{ league: any[] }>
    >;

    const resultPromise: Promise<MappedPlayer[]> = promise.then((data) => {
      const players = mapPlayers(data.fantasy_content.league[1].players);
      return players;
    });

    return toCallbackOrPromise(resultPromise, cb);
  }
}

export default LeagueResource;
