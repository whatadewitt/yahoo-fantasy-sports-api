import { extractCallback, toCallbackOrPromise } from '../helpers/argsParser';
import { mapDraftAnalysis, mapPlayer, mapStats } from '../helpers/playerHelper';
import type {
  FantasyContent,
  MappedDraftAnalysis,
  MappedPlayer,
  MappedStats,
  PlayerOwnership,
} from '../types/api-responses';
import type { Callback, YahooFantasyInstance } from '../types/core';

class PlayerResource {
  constructor(public yf: YahooFantasyInstance) {}

  // Method overloads for meta
  meta(playerKey: string): Promise<MappedPlayer>;
  meta(playerKey: string, cb: Callback<MappedPlayer>): void;
  meta(
    playerKey: string,
    cb?: Callback<MappedPlayer>,
  ): Promise<MappedPlayer> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/player/${playerKey}/metadata`,
    ) as Promise<FantasyContent<{ player: any[] }>>;

    const resultPromise: Promise<MappedPlayer> = promise.then((data) => {
      const meta = mapPlayer(data.fantasy_content.player[0]);
      if (!meta) {
        throw new Error('No player data found');
      }
      return meta;
    });

    return toCallbackOrPromise(resultPromise, cb);
  }

  // Method overloads for stats
  stats(playerKey: string): Promise<MappedPlayer & { stats: MappedStats }>;
  stats(
    playerKey: string,
    week: number,
  ): Promise<MappedPlayer & { stats: MappedStats }>;
  stats(
    playerKey: string,
    date: string,
  ): Promise<MappedPlayer & { stats: MappedStats }>;
  stats(
    playerKey: string,
    type: 'lastweek' | 'lastmonth',
  ): Promise<MappedPlayer & { stats: MappedStats }>;
  stats(
    playerKey: string,
    cb: Callback<MappedPlayer & { stats: MappedStats }>,
  ): void;
  stats(
    playerKey: string,
    week: number,
    cb: Callback<MappedPlayer & { stats: MappedStats }>,
  ): void;
  stats(
    playerKey: string,
    date: string,
    cb: Callback<MappedPlayer & { stats: MappedStats }>,
  ): void;
  stats(
    playerKey: string,
    type: 'lastweek' | 'lastmonth',
    cb: Callback<MappedPlayer & { stats: MappedStats }>,
  ): void;
  stats(
    playerKey: string,
    ...args: any[]
  ): Promise<MappedPlayer & { stats: MappedStats }> | void {
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/player/${playerKey}/stats`;
    const cb = extractCallback(args);

    let dateType: string = '';
    if (args.length) {
      const date = args.pop();
      // TODO: I could get more clever here, but need it working first...
      if (date === 'lastweek' || date === 'lastmonth') {
        dateType = date;
        url += `;type=${date}`;
      } else if (typeof date === 'string' && date.indexOf('-') > 0) {
        dateType = 'date';
        // string is date, of format y-m-d
        url += `;type=date;date=${date}`;
      } else {
        dateType = 'week';
        // number is week...
        url += `;type=week;week=${date}`;
      }
    }

    const promise = this.yf.api(this.yf.GET, url) as Promise<
      FantasyContent<{ player: any[] }>
    >;

    const resultPromise: Promise<MappedPlayer & { stats: MappedStats }> =
      promise.then((data) => {
        let stats: any;
        const player = mapPlayer(data.fantasy_content.player[0]);

        if (data.fantasy_content.player.length > 1) {
          const statsData = data.fantasy_content.player[1];
          if (statsData.player_stats) {
            stats = mapStats(statsData.player_stats);
          } else {
            stats = mapStats(statsData);
          }
        } else {
          const gameKey = playerKey.split('.')[0];
          stats = `Cannot retrieve player stats of type '${dateType}' for game '${gameKey}'`;
        }

        player.stats = stats;
        return player as MappedPlayer & { stats: MappedStats };
      });

    return toCallbackOrPromise(resultPromise, cb);
  }

  // Method overloads for percent_owned
  percent_owned(
    playerKey: string,
  ): Promise<MappedPlayer & { percent_owned: string }>;
  percent_owned(
    playerKey: string,
    cb: Callback<MappedPlayer & { percent_owned: string }>,
  ): void;
  percent_owned(
    playerKey: string,
    cb?: Callback<MappedPlayer & { percent_owned: string }>,
  ): Promise<MappedPlayer & { percent_owned: string }> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/player/${playerKey}/percent_owned`,
    ) as Promise<FantasyContent<{ player: any[] }>>;

    const resultPromise: Promise<MappedPlayer & { percent_owned: string }> =
      promise.then((data) => {
        const percent_owned = data.fantasy_content.player[1].percent_owned[1];
        const player = mapPlayer(data.fantasy_content.player[0]);

        // TODO: do we need coverage type and/or delta????
        return { ...player, percent_owned: percent_owned.value };
      });

    return toCallbackOrPromise(resultPromise, cb);
  }

  // Method overloads for ownership
  ownership(playerKey: string, leagueKey: string): Promise<PlayerOwnership>;
  ownership(
    playerKey: string,
    leagueKey: string,
    cb: Callback<PlayerOwnership>,
  ): void;
  ownership(
    playerKey: string,
    leagueKey: string,
    cb?: Callback<PlayerOwnership>,
  ): Promise<PlayerOwnership> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/players;player_keys=${playerKey}/ownership`,
    ) as Promise<FantasyContent<{ league: any[] }>>;

    const resultPromise: Promise<PlayerOwnership> = promise.then((data) => {
      const league = data.fantasy_content.league[0];
      const player = mapPlayer(
        data.fantasy_content.league[1].players[0].player[0],
      );
      const status =
        data.fantasy_content.league[1].players[0].player[1].ownership;

      delete status[0];

      return {
        ...player,
        status,
        league,
      } as unknown as PlayerOwnership;
    });

    return toCallbackOrPromise(resultPromise, cb);
  }

  // Method overloads for draft_analysis
  draft_analysis(
    playerKey: string,
  ): Promise<MappedPlayer & { draft_analysis: MappedDraftAnalysis }>;
  draft_analysis(
    playerKey: string,
    cb: Callback<MappedPlayer & { draft_analysis: MappedDraftAnalysis }>,
  ): void;
  draft_analysis(
    playerKey: string,
    cb?: Callback<MappedPlayer & { draft_analysis: MappedDraftAnalysis }>,
  ): Promise<MappedPlayer & { draft_analysis: MappedDraftAnalysis }> | void {
    const promise = this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/player/${playerKey}/draft_analysis`,
    ) as Promise<FantasyContent<{ player: any[] }>>;

    const resultPromise: Promise<
      MappedPlayer & { draft_analysis: MappedDraftAnalysis }
    > = promise.then((data) => {
      const draft_analysis = mapDraftAnalysis(
        data.fantasy_content.player[1].draft_analysis,
      );
      const player = mapPlayer(data.fantasy_content.player[0]);

      return { ...player, draft_analysis };
    });

    return toCallbackOrPromise(resultPromise, cb);
  }
}

export default PlayerResource;
