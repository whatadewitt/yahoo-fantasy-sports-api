import { extractCallback, toCallbackOrPromise } from '../helpers/argsParser';
import { parseCollection } from '../helpers/leagueHelper';
import type { League } from '../types/api-responses';
import type { Callback, YahooFantasyInstance } from '../types/core';

class LeaguesCollection {
  constructor(private yf: YahooFantasyInstance) {}

  fetch(leagueKeys: string[]): Promise<League[]>;
  fetch(leagueKeys: string[], cb: Callback<League[]>): void;
  fetch(leagueKeys: string[], subresources: string[]): Promise<League[]>;
  fetch(
    leagueKeys: string[],
    subresources: string[],
    cb: Callback<League[]>,
  ): void;
  fetch(...args: any[]): Promise<League[]> | void {
    const cb = extractCallback(args);
    let leagueKeys = args.shift();
    let subresources = args.length ? args.shift() : [];

    if (!Array.isArray(leagueKeys)) {
      leagueKeys = [leagueKeys];
    }

    let url =
      'https://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=';
    url += leagueKeys.join(',');

    if (typeof subresources === 'string') {
      subresources = [subresources];
    }

    if (subresources.length > 0) {
      url += `;out=${subresources.join(',')}`;
    }

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;

    const resultPromise = promise.then((data) => {
      return parseCollection(data.fantasy_content.leagues, subresources);
    });

    return toCallbackOrPromise(resultPromise, cb);
  }
}

export default LeaguesCollection;
