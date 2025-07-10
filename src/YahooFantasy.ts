import * as https from 'https';
import { stringify } from 'querystring';
import * as crypto from 'crypto';
import * as oauthSignature from 'oauth-signature';

import {
  Game,
  League,
  Player,
  Roster,
  Team,
  Transaction,
  User,
} from './resources';

import {
  Games,
  Leagues,
  Players,
  Teams,
  Transactions,
} from './collections';

import {
  TokenCallbackFunction,
  OAuthTokens,
  OAuthTokenCallbackData,
  HttpMethod,
  Callback,
  YahooFantasyError,
} from './types';

interface AuthRequest {
  query: {
    code: string;
    state?: string;
  };
}

interface AuthResponse {
  redirect(url: string): void;
  send(data: any): void;
}

class YahooFantasy {
  public CONSUMER_KEY: string;
  public CONSUMER_SECRET: string;
  public REDIRECT_URI?: string;
  
  public refreshTokenCallback: TokenCallbackFunction;
  
  public readonly GET: HttpMethod = 'GET';
  public readonly POST: HttpMethod = 'POST';
  
  public game: Game;
  public games: Games;
  public league: League;
  public leagues: Leagues;
  public player: Player;
  public players: Players;
  public team: Team;
  public teams: Teams;
  public transaction: Transaction;
  public transactions: Transactions;
  public roster: Roster;
  public user: User;
  
  public yahooUserToken: string | null = null;
  public yahooRefreshToken: string | null = null;

  constructor(
    consumerKey: string,
    consumerSecret: string,
    tokenCallbackFn?: TokenCallbackFunction,
    redirectUri?: string
  ) {
    this.CONSUMER_KEY = consumerKey;
    this.CONSUMER_SECRET = consumerSecret;
    this.REDIRECT_URI = redirectUri;
    
    this.refreshTokenCallback = tokenCallbackFn || (() => {});
    
    // Initialize resources
    this.game = new Game(this);
    this.games = new Games(this);
    
    this.league = new League(this);
    this.leagues = new Leagues(this);
    
    this.player = new Player(this);
    this.players = new Players(this);
    
    this.team = new Team(this);
    this.teams = new Teams(this);
    
    this.transaction = new Transaction(this);
    this.transactions = new Transactions(this);
    
    this.roster = new Roster(this);
    
    this.user = new User(this);
  }

  // OAuth2 authentication function -- follow redirect to yahoo login
  public auth(res: AuthResponse, state?: string | null): void {
    const authData: Record<string, string> = {
      client_id: this.CONSUMER_KEY,
      redirect_uri: this.REDIRECT_URI || '',
      response_type: 'code',
    };

    if (state) {
      authData.state = state;
    }

    const options: https.RequestOptions = {
      hostname: 'api.login.yahoo.com',
      port: 443,
      path: `/oauth2/request_auth?${stringify(authData)}`,
      method: 'GET',
    };

    const authRequest = https.request(options, (authResponse) => {
      let data = '';
      
      authResponse.on('data', (chunk) => {
        data += chunk;
      });

      authResponse.on('end', () => {
        if (authResponse.statusCode === 302) {
          const location = authResponse.headers.location;
          if (location) {
            res.redirect(location);
          }
        } else {
          res.send(data);
        }
      });
    });

    authRequest.on('error', (e) => {
      throw new Error(e.message);
    });

    authRequest.end();
  }

  public authCallback(req: AuthRequest, cb: Callback<OAuthTokenCallbackData>): void {
    const tokenData: Record<string, string> = {
      client_id: this.CONSUMER_KEY,
      client_secret: this.CONSUMER_SECRET,
      redirect_uri: this.REDIRECT_URI || '',
      code: req.query.code,
      grant_type: 'authorization_code',
    };

    const state = req.query.state;
    if (state) {
      tokenData.state = state;
    }

    const options: https.RequestOptions = {
      hostname: 'api.login.yahoo.com',
      port: 443,
      path: '/oauth2/get_token',
      method: this.POST,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(
          `${this.CONSUMER_KEY}:${this.CONSUMER_SECRET}`
        ).toString('base64')}`,
      },
    };

    const tokenRequest = https.request(options, (tokenResponse) => {
      const chunks: Buffer[] = [];
      
      tokenResponse.on('data', (d) => {
        chunks.push(d);
      });

      tokenResponse.on('end', async () => {
        try {
          const tokenData: OAuthTokens = JSON.parse(
            Buffer.concat(chunks).toString()
          );

          this.yahooUserToken = tokenData.access_token;
          this.yahooRefreshToken = tokenData.refresh_token;

          if (this.refreshTokenCallback) {
            await this.refreshTokenCallback(tokenData);
          }

          cb(null, { ...tokenData, state });
        } catch (error) {
          cb(error as Error);
        }
      });
    });

    tokenRequest.on('error', (e) => {
      cb(e);
    });

    tokenRequest.write(stringify(tokenData));
    tokenRequest.end();
  }

  public setUserToken(token: string): void {
    this.yahooUserToken = token;
  }
  
  // Alias for backward compatibility
  public setAccessToken(token: string): void {
    this.setUserToken(token);
  }
  
  public getAccessToken(): string | undefined {
    return this.yahooUserToken || undefined;
  }

  public setRefreshToken(token: string): void {
    this.yahooRefreshToken = token;
  }

  // Method overloads for refreshToken
  public refreshToken(cb: Callback<OAuthTokens>): void;
  public refreshToken(): Promise<OAuthTokens>;
  public refreshToken(cb?: Callback<OAuthTokens>): Promise<OAuthTokens> | void {
    if (cb) {
      return this.refreshTokenWithCallback(cb);
    }
    
    return new Promise((resolve, reject) => {
      this.refreshTokenWithCallback((err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data!);
        }
      });
    });
  }
  
  // Alias for consistency with PRD
  public refreshAuthToken(refreshToken: string, cb?: Callback<OAuthTokens>): Promise<OAuthTokens> | void {
    this.setRefreshToken(refreshToken);
    return cb ? this.refreshToken(cb) : this.refreshToken();
  }

  private refreshTokenWithCallback(cb: Callback<OAuthTokens>): void {
    if (!this.yahooRefreshToken) {
      cb(new Error('No refresh token available'));
      return;
    }

    const refreshData = stringify({
      grant_type: 'refresh_token',
      redirect_uri: this.REDIRECT_URI || '',
      refresh_token: this.yahooRefreshToken,
    });

    const options: https.RequestOptions = {
      hostname: 'api.login.yahoo.com',
      port: 443,
      path: '/oauth2/get_token',
      method: this.POST,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(
          `${this.CONSUMER_KEY}:${this.CONSUMER_SECRET}`
        ).toString('base64')}`,
      },
    };

    const tokenRequest = https.request(options, (tokenResponse) => {
      const chunks: Buffer[] = [];
      
      tokenResponse.on('data', (d) => {
        chunks.push(d);
      });

      tokenResponse.on('end', async () => {
        try {
          const tokenData: OAuthTokens = JSON.parse(
            Buffer.concat(chunks).toString()
          );

          this.setUserToken(tokenData.access_token);
          this.setRefreshToken(tokenData.refresh_token);

          if (this.refreshTokenCallback) {
            await this.refreshTokenCallback(tokenData);
          }

          cb(null, tokenData);
        } catch (error) {
          cb(error as Error);
        }
      });
    });

    tokenRequest.on('error', (e) => {
      cb(e);
    });

    tokenRequest.write(refreshData);
    tokenRequest.end();
  }

  // API method with overloads
  public api(method: HttpMethod, url: string, cb: Callback<any>): void;
  public api(method: HttpMethod, url: string, data: any, cb: Callback<any>): void;
  public api(method: HttpMethod, url: string): Promise<any>;
  public api(method: HttpMethod, url: string, data: any): Promise<any>;
  public api(...args: any[]): Promise<any> | void {
    const method = args[0] as HttpMethod;
    const url = args[1] as string;
    let postData: any = false;
    let callback: Callback<any> | undefined;

    // Parse arguments
    if (args.length === 3) {
      // method, url, callback
      if (typeof args[2] === 'function') {
        callback = args[2];
      } else {
        // method, url, data
        postData = args[2];
      }
    } else if (args.length === 4) {
      // method, url, data, callback
      postData = args[2];
      callback = args[3];
    }

    const performRequest = (): Promise<any> => {
      return new Promise((resolve, reject) => {
        let params: Record<string, any> = {
          format: 'json',
        };

        const headers: Record<string, string> = {};

        if (!this.yahooUserToken) {
          // OAuth 1.0a flow
          params = {
            ...params,
            oauth_consumer_key: this.CONSUMER_KEY,
            oauth_signature_method: 'HMAC-SHA1',
            oauth_timestamp: Math.floor(Date.now() / 1000),
            oauth_nonce: crypto.randomBytes(12).toString('base64'),
            oauth_version: '1.0',
          };

          const signature = oauthSignature.generate(
            method,
            url,
            params,
            this.CONSUMER_SECRET
          );

          params = {
            ...params,
            oauth_signature: decodeURIComponent(signature),
          };
        } else {
          // OAuth 2.0 flow
          headers.Authorization = `Bearer ${this.yahooUserToken}`;
        }

        const options: https.RequestOptions = {
          hostname: 'fantasysports.yahooapis.com',
          path: `${url.replace(
            'https://fantasysports.yahooapis.com',
            ''
          )}?${stringify(params)}`,
          method: method,
          headers,
        };

        const request = https.request(options, (resp) => {
          let data = '';

          resp.on('data', (chunk) => {
            data += chunk;
          });

          resp.on('end', async () => {
            try {
              const parsedData = JSON.parse(data);

              if (parsedData.error) {
                if (/"token_expired"/i.test(parsedData.error.description)) {
                  // Token expired, refresh and retry
                  try {
                    await this.refreshToken();
                    const retryResult = await this.api(method, url, postData);
                    resolve(retryResult);
                  } catch (refreshError) {
                    reject(refreshError);
                  }
                } else {
                  reject(new YahooFantasyError(
                    parsedData.error.description || parsedData.error.message,
                    parsedData.error.name,
                    resp.statusCode
                  ));
                }
              } else {
                resolve(parsedData);
              }
            } catch (parseError) {
              reject(new Error(`Failed to parse response: ${parseError}`));
            }
          });
        });

        request.on('error', (err) => {
          reject(new Error(err.message));
        });

        if (postData && method === 'POST') {
          request.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
        }

        request.end();
      });
    };

    if (callback) {
      performRequest()
        .then(data => callback(null, data))
        .catch(err => callback(err));
    } else {
      return performRequest();
    }
  }
}

export default YahooFantasy;