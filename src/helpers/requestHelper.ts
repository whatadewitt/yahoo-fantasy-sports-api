import { Callback, YahooFantasyInstance } from "../types/core";
import { extractCallback } from "./argsParser";

interface KeyedCollectionOptions<T> {
  collection: string;
  keyName: string;
  suffix: string;
  select: (data: any) => any;
  parser: (collectionData: any, subresources: string[]) => T;
}

export function asArray<T>(value: T | T[] | null | undefined): T[] {
  if (value === null || value === undefined) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

export function appendSemicolonParams(
  url: string,
  params: Array<[string, string | number | boolean | null | undefined]>,
): string {
  const renderedParams = params
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    )
    .map(([key, value]) => `${key}=${value}`);

  return renderedParams.length ? `${url};${renderedParams.join(";")}` : url;
}

export function withCallback<T>(
  promise: Promise<T>,
  cb?: Callback<T>,
): Promise<T> | void {
  if (cb) {
    promise.then((result) => cb(null, result)).catch((e) => cb(e));
    return;
  }
  return promise;
}

export function getAndMap<T>(
  yf: YahooFantasyInstance,
  url: string,
  mapper: (data: any) => T,
  cb?: Callback<T>,
): Promise<T> | void {
  const request = yf.api(yf.GET, url) as Promise<any>;
  return withCallback(request.then(mapper), cb);
}

export function getKeyedCollectionFromArgs<T>(
  yf: YahooFantasyInstance,
  args: any[],
  options: KeyedCollectionOptions<T>,
): Promise<T> | void {
  const cb = extractCallback(args) as Callback<T> | undefined;
  const keys = asArray(args.shift());
  const rawSubresources = args.length ? args.shift() : [];
  const subresources = asArray<string>(rawSubresources);
  const base = `https://fantasysports.yahooapis.com/fantasy/v2/${options.collection};${options.keyName}=${keys.join(
    ",",
  )}${options.suffix}`;
  const url = subresources.length
    ? `${base};out=${subresources.join(",")}`
    : base;

  return getAndMap(
    yf,
    url,
    (data) => options.parser(options.select(data), subresources),
    cb,
  );
}

export function collectionItems(collection: any): any[] {
  const count = Number(collection?.count) || 0;
  return Array.from({ length: count }, (_, i) => collection[i]).filter(Boolean);
}
