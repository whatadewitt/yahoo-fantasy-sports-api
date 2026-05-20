import { YahooFantasyInstance, Callback } from "../types/core";
import {
  MappedPlayer,
  MappedStats,
  MappedDraftAnalysis,
  PlayerOwnership,
  FantasyContent,
} from "../types/api-responses";
import { mapPlayer, mapStats, mapDraftAnalysis } from "../helpers/playerHelper";
import { extractCallback } from "../helpers/argsParser";
import { withCallback } from "../helpers/requestHelper";

function playerStatsRequest(
  playerKey: string,
  scope: any,
): {
  url: string;
  statsType: string;
} {
  let statsType = "";
  let url = `https://fantasysports.yahooapis.com/fantasy/v2/player/${playerKey}/stats`;

  if (scope === "lastweek" || scope === "lastmonth") {
    statsType = scope;
    url += `;type=${scope}`;
  } else if (typeof scope === "string" && scope.indexOf("-") > 0) {
    statsType = "date";
    url += `;type=date;date=${scope}`;
  } else if (scope !== undefined) {
    statsType = "week";
    url += `;type=week;week=${scope}`;
  }

  return { url, statsType };
}

function mapPlayerStatsResponse(
  playerKey: string,
  statsType: string,
  data: FantasyContent<{ player: any[] }>,
): MappedPlayer & { stats: MappedStats } {
  const playerData = data.fantasy_content.player;
  const player = mapPlayer(playerData[0]);
  const statsData = playerData[1];

  player.stats = statsData
    ? mapStats(statsData.player_stats || statsData)
    : `Cannot retrieve player stats of type '${statsType}' for game '${
        playerKey.split(".")[0]
      }'`;

  return player as MappedPlayer & { stats: MappedStats };
}

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
        throw new Error("No player data found");
      }
      return meta;
    });

    if (cb) {
      resultPromise.then((meta) => cb(null, meta)).catch((e) => cb(e));
      return;
    } else {
      return resultPromise;
    }
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
    type: "lastweek" | "lastmonth",
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
    type: "lastweek" | "lastmonth",
    cb: Callback<MappedPlayer & { stats: MappedStats }>,
  ): void;
  stats(
    playerKey: string,
    ...args: any[]
  ): Promise<MappedPlayer & { stats: MappedStats }> | void {
    const cb = extractCallback(args) as
      | Callback<MappedPlayer & { stats: MappedStats }>
      | undefined;
    const scope = args.length ? args.pop() : undefined;
    const { url, statsType } = playerStatsRequest(playerKey, scope);

    const promise = this.yf.api(this.yf.GET, url) as Promise<
      FantasyContent<{ player: any[] }>
    >;
    const resultPromise = promise.then((data) =>
      mapPlayerStatsResponse(playerKey, statsType, data),
    );

    return withCallback(resultPromise, cb);
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

    if (cb) {
      resultPromise.then((result) => cb(null, result)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
  }

  // Alias for consistency with interface
  percentOwned(playerKey: string): Promise<any>;
  percentOwned(playerKey: string, cb: Callback<any>): void;
  percentOwned(playerKey: string, cb?: Callback<any>): Promise<any> | void {
    return cb
      ? this.percent_owned(playerKey, cb)
      : this.percent_owned(playerKey);
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

    if (cb) {
      resultPromise.then((result) => cb(null, result)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
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

    if (cb) {
      resultPromise.then((result) => cb(null, result)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
  }

  // Alias for consistency with interface
  draftAnalysis(playerKey: string): Promise<any>;
  draftAnalysis(playerKey: string, cb: Callback<any>): void;
  draftAnalysis(playerKey: string, cb?: Callback<any>): Promise<any> | void {
    return cb
      ? this.draft_analysis(playerKey, cb)
      : this.draft_analysis(playerKey);
  }
}

export default PlayerResource;
