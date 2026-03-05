import { YahooFantasyInstance, Callback } from "../types/core";
import { League } from "../types/api-responses";
import { parseCollection } from "../helpers/leagueHelper";
import { extractCallback } from "../helpers/argsParser";

class LeaguesCollection {
  constructor(private yf: YahooFantasyInstance) {}

  fetch(leagueKeys: string[]): Promise<League[]>;
  fetch(leagueKeys: string[], cb: Callback<League[]>): void;
  fetch(leagueKeys: string[], subresources: string[]): Promise<League[]>;
  fetch(
    leagueKeys: string[],
    subresources: string[],
    cb: Callback<League[]>
  ): void;
  fetch(...args: any[]): Promise<League[]> | void {
    const cb = extractCallback(args);
    let leagueKeys = args.shift();
    let subresources = args.length ? args.shift() : [];

    if (!Array.isArray(leagueKeys)) {
      leagueKeys = [leagueKeys];
    }

    let url =
      "https://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=";
    url += leagueKeys.join(",");

    if (typeof subresources === "string") {
      subresources = [subresources];
    }

    if (subresources.length > 0) {
      url += `;out=${subresources.join(",")}`;
    }

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;

    const resultPromise = promise.then((data) => {
      return parseCollection(data.fantasy_content.leagues, subresources);
    });

    if (cb) {
      resultPromise.then((leagues) => cb(null, leagues)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
  }

  user(): Promise<League[]>;
  user(cb: Callback<League[]>): void;
  user(...args: any[]): Promise<League[]> | void {
    const cb = extractCallback(args);

    const promise = this.yf.api(
      this.yf.GET,
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games/leagues"
    ) as Promise<any>;

    const resultPromise = promise.then((data) => {
      return parseCollection(data.fantasy_content.users[0].user[1].games);
    });

    if (cb) {
      resultPromise.then((leagues) => cb(null, leagues)).catch((e) => cb(e));
      return;
    }
    return resultPromise;
  }

  userFetch(leagueKeys: string[]): Promise<League[]>;
  userFetch(leagueKeys: string[], cb: Callback<League[]>): void;
  userFetch(...args: any[]): Promise<League[]> | void {
    const cb = extractCallback(args);
    const leagueKeys = args[0];

    const result = this.fetch(leagueKeys);

    if (cb) {
      result.then((leagues) => cb(null, leagues)).catch((e) => cb(e));
      return;
    }
    return result;
  }
}

export default LeaguesCollection;
