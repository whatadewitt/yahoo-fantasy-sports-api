import { YahooFantasyInstance, Callback } from '../types/core';
import { 
  Player, 
  PlayerStats,
  PlayerOwnership,
  FantasyContent 
} from '../types/api-responses';
import {
  mapPlayer,
  mapStats,
  mapDraftAnalysis,
} from '../helpers/playerHelper';
import { extractCallback } from '../helpers/argsParser';

class PlayerResource {
  constructor(public yf: YahooFantasyInstance) {}

  // Method overloads for meta
  meta(playerKey: string): Promise<Player>;
  meta(playerKey: string, cb: Callback<Player>): void;
  meta(playerKey: string, cb?: Callback<Player>): Promise<Player> | void {
    const promise = (this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/player/${playerKey}/metadata`
      ) as Promise<FantasyContent<{ player: any[] }>>);
    
    const resultPromise: Promise<Player> = promise.then((data) => {
      const meta = mapPlayer(data.fantasy_content.player[0]);
      if (!meta) {
        throw new Error('No player data found');
      }
      return meta;
    });

    if (cb) {
      resultPromise
        .then((meta) => cb(null, meta))
        .catch((e) => cb(e));
      return;
    } else {
      return resultPromise;
    }
  }

  // Method overloads for stats
  stats(playerKey: string): Promise<Player & { stats: any }>;
  stats(playerKey: string, week: number): Promise<Player & { stats: any }>;
  stats(playerKey: string, date: string): Promise<Player & { stats: any }>;
  stats(playerKey: string, type: 'lastweek' | 'lastmonth'): Promise<Player & { stats: any }>;
  stats(playerKey: string, cb: Callback<Player & { stats: any }>): void;
  stats(playerKey: string, week: number, cb: Callback<Player & { stats: any }>): void;
  stats(playerKey: string, date: string, cb: Callback<Player & { stats: any }>): void;
  stats(playerKey: string, type: 'lastweek' | 'lastmonth', cb: Callback<Player & { stats: any }>): void;
  stats(playerKey: string, ...args: any[]): Promise<Player & { stats: any }> | void {
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/player/${playerKey}/stats`;
    const cb = extractCallback(args);

    let dateType: string = '';
    if (args.length) {
      const date = args.pop();
      // TODO: I could get more clever here, but need it working first...
      if (date === "lastweek" || date === "lastmonth") {
        dateType = date;
        url += `;type=${date}`;
      } else if (typeof date === 'string' && date.indexOf("-") > 0) {
        dateType = "date";
        // string is date, of format y-m-d
        url += `;type=date;date=${date}`;
      } else {
        dateType = "week";
        // number is week...
        url += `;type=week;week=${date}`;
      }
    }

    const promise = (this.yf
      .api(this.yf.GET, url) as Promise<FantasyContent<{ player: any[] }>>);
    
    const resultPromise: Promise<Player & { stats: any }> = promise.then((data) => {
      let stats: any;
      const player = mapPlayer(data.fantasy_content.player[0]);

      if (data.fantasy_content.player.length > 1) {
        stats = mapStats(data.fantasy_content.player[1].player_stats);
      } else {
        const gameKey = playerKey.split(".")[0];
        stats = `Cannot retrieve player stats of type '${dateType}' for game '${gameKey}'`;
      }

      return { ...player, stats };
    });

    if (cb) {
      resultPromise
        .then((result) => cb(null, result))
        .catch((e) => cb(e));
      return;
    } else {
      return resultPromise;
    }
  }

  // Method overloads for percent_owned
  percent_owned(playerKey: string): Promise<Player & { percent_owned: string }>;
  percent_owned(playerKey: string, cb: Callback<Player & { percent_owned: string }>): void;
  percent_owned(playerKey: string, cb?: Callback<Player & { percent_owned: string }>): Promise<Player & { percent_owned: string }> | void {
    const promise = (this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/player/${playerKey}/percent_owned`
      ) as Promise<FantasyContent<{ player: any[] }>>);
    
    const resultPromise: Promise<Player & { percent_owned: string }> = promise.then((data) => {
      const percent_owned = data.fantasy_content.player[1].percent_owned[1];
      const player = mapPlayer(data.fantasy_content.player[0]);

      // TODO: do we need coverage type and/or delta????
      return { ...player, percent_owned: percent_owned.value };
    });

    if (cb) {
      resultPromise
        .then((result) => cb(null, result))
        .catch((e) => cb(e));
      return;
    } else {
      return resultPromise;
    }
  }

  // Alias for consistency with interface
  percentOwned(playerKey: string): Promise<any>;
  percentOwned(playerKey: string, cb: Callback<any>): void;
  percentOwned(playerKey: string, cb?: Callback<any>): Promise<any> | void {
    return cb ? this.percent_owned(playerKey, cb) : this.percent_owned(playerKey);
  }

  // Method overloads for ownership
  ownership(playerKey: string, leagueKey: string): Promise<PlayerOwnership>;
  ownership(playerKey: string, leagueKey: string, cb: Callback<PlayerOwnership>): void;
  ownership(playerKey: string, leagueKey: string, cb?: Callback<PlayerOwnership>): Promise<PlayerOwnership> | void {
    const promise = (this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/players;player_keys=${playerKey}/ownership`
      ) as Promise<FantasyContent<{ league: any[] }>>);
    
    const resultPromise: Promise<PlayerOwnership> = promise.then((data) => {
      const league = data.fantasy_content.league[0];
      const player = mapPlayer(data.fantasy_content.league[1].players[0].player[0]);
      const status = data.fantasy_content.league[1].players[0].player[1].ownership;

      delete status[0];

      return {
        ...player,
        status,
        league
      };
    });

    if (cb) {
      resultPromise
        .then((result) => cb(null, result))
        .catch((e) => cb(e));
      return;
    } else {
      return resultPromise;
    }
  }

  // Method overloads for draft_analysis
  draft_analysis(playerKey: string): Promise<Player & { draft_analysis: any }>;
  draft_analysis(playerKey: string, cb: Callback<Player & { draft_analysis: any }>): void;
  draft_analysis(playerKey: string, cb?: Callback<Player & { draft_analysis: any }>): Promise<Player & { draft_analysis: any }> | void {
    const promise = (this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/player/${playerKey}/draft_analysis`
      ) as Promise<FantasyContent<{ player: any[] }>>);
    
    const resultPromise: Promise<Player & { draft_analysis: any }> = promise.then((data) => {
      const draft_analysis = mapDraftAnalysis(data.fantasy_content.player[1].draft_analysis);
      const player = mapPlayer(data.fantasy_content.player[0]);

      return { ...player, draft_analysis };
    });

    if (cb) {
      resultPromise
        .then((result) => cb(null, result))
        .catch((e) => cb(e));
      return;
    } else {
      return resultPromise;
    }
  }

  // Alias for consistency with interface
  draftAnalysis(playerKey: string): Promise<any>;
  draftAnalysis(playerKey: string, cb: Callback<any>): void;
  draftAnalysis(playerKey: string, cb?: Callback<any>): Promise<any> | void {
    return cb ? this.draft_analysis(playerKey, cb) : this.draft_analysis(playerKey);
  }
}

export default PlayerResource;