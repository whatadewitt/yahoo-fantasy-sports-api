declare module 'follow-redirects' {
  import * as nodeHttp from 'node:http';
  import * as nodeHttps from 'node:https';

  export const http: typeof nodeHttp;
  export const https: typeof nodeHttps;
}
