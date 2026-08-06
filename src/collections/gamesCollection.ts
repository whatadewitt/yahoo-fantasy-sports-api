import { YahooFantasyInstance, Callback } from '../types/core';
import { Game } from '../types/api-responses';
import { parseCollection } from '../helpers/gameHelper';
import { extractCallback, toCallbackOrPromise } from '../helpers/argsParser';

class GamesCollection {
  constructor(private yf: YahooFantasyInstance) {}

  fetch(gameKeys: string[]): Promise<Game[]>;
  fetch(gameKeys: string[], cb: Callback<Game[]>): void;
  fetch(gameKeys: string[], subresources: string[]): Promise<Game[]>;
  fetch(gameKeys: string[], subresources: string[], cb: Callback<Game[]>): void;
  fetch(...args: any[]): Promise<Game[]> | void {
    let gameKeys: string[] = [];
    let subresources: string[] = [];
    const cb = extractCallback(args);

    gameKeys = args.shift();
    if (!Array.isArray(gameKeys)) {
      gameKeys = [gameKeys];
    }

    if (args.length) {
      subresources = args.pop();
      if (typeof subresources === 'string') {
        subresources = [subresources];
      }
    }

    let url = 'https://fantasysports.yahooapis.com/fantasy/v2/games';

    if (gameKeys.length) {
      url += `;game_keys=${gameKeys.join(',')}`;
    }

    if (subresources.length) {
      url += `;out=${subresources.join(',')}`;
    }

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;
    const resultPromise = promise.then((data) => {
      const games = parseCollection(data.fantasy_content.games, subresources);
      return games;
    });

    return toCallbackOrPromise(resultPromise, cb);
  }

  user(): Promise<Game[]>;
  user(cb: Callback<Game[]>): void;
  user(filters: any): Promise<Game[]>;
  user(filters: any, cb: Callback<Game[]>): void;
  user(filters: any, subresources: string[]): Promise<Game[]>;
  user(filters: any, subresources: string[], cb: Callback<Game[]>): void;
  user(subresources: string[]): Promise<Game[]>;
  user(subresources: string[], cb: Callback<Game[]>): void;
  user(...args: any[]): Promise<Game[]> | void {
    let subresources: string[] = [];
    let filters: any = false;
    const cb = extractCallback(args);

    switch (args.length) {
      case 1:
        if (Array.isArray(args[0])) {
          subresources = args[0];
        } else {
          filters = args[0];
        }
        break;

      case 2:
        filters = args[0];
        subresources = args[1];
        break;

      default:
        break;
    }

    let url = 'https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games';

    if (filters) {
      Object.keys(filters).forEach((key) => {
        url += `;${key}=${filters[key]}`;
      });
    }

    if (subresources.length) {
      url += `;out=${subresources.join(',')}`;
    }

    const promise = this.yf.api(this.yf.GET, url) as Promise<any>;
    
    const resultPromise = promise.then((data) => {
      return parseCollection(
        data.fantasy_content.users[0].user[1].games,
        subresources
      );
    });

    return toCallbackOrPromise(resultPromise, cb);
  }
}

export default GamesCollection;