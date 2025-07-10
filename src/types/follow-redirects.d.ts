declare module 'follow-redirects' {
  import * as http from 'http';
  import * as https from 'https';

  export const http: typeof http;
  export const https: typeof https;
}