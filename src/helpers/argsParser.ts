// Args parser helper functions

import { Callback } from "../types/core";

export function toCallbackOrPromise<T>(
  promise: Promise<T>,
  cb?: Callback<T>
): Promise<T> | void {
  if (cb) {
    promise.then((result) => cb(null, result)).catch((e) => cb(e));
    return;
  }
  return promise;
}

export function extractCallback(args: any[]): Callback<any> | undefined {
  // Find the last function in the arguments
  for (let i = args.length - 1; i >= 0; i--) {
    if (typeof args[i] === 'function') {
      return args.splice(i, 1)[0];
    }
  }
  // Return undefined if no callback found
  return undefined;
}