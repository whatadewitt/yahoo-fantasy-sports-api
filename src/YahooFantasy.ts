import * as https from "https";
import * as crypto from "crypto";
const oauthSignature = require("oauth-signature");

import {
  Game,
  League,
  Player,
  Roster,
  Team,
  Transaction,
  User,
} from "./resources";

import { Games, Leagues, Players, Teams, Transactions } from "./collections";

import {
  TokenCallbackFunction,
  OAuthTokens,
  OAuthTokenCallbackData,
  HttpMethod,
  Callback,
  YahooFantasyError,
} from "./types";

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

interface ApiArgs {
  method: HttpMethod;
  url: string;
  postData: any;
  callback?: Callback<any>;
}

class YahooFantasy {
  public CONSUMER_KEY: string;
  public CONSUMER_SECRET: string;
  public REDIRECT_URI?: string;

  public refreshTokenCallback: TokenCallbackFunction;

  public readonly GET: HttpMethod = "GET";
  public readonly POST: HttpMethod = "POST";
  public readonly PUT: HttpMethod = "PUT";
  public readonly DELETE: HttpMethod = "DELETE";

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
    redirectUri?: string,
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
      redirect_uri: this.REDIRECT_URI || "",
      response_type: "code",
    };

    if (state) {
      authData.state = state;
    }

    const options: https.RequestOptions = {
      hostname: "api.login.yahoo.com",
      port: 443,
      path: `/oauth2/request_auth?${new URLSearchParams(authData).toString()}`,
      method: "GET",
    };

    const authRequest = https.request(options, (authResponse) => {
      let data = "";

      authResponse.on("data", (chunk) => {
        data += chunk;
      });

      authResponse.on("end", () => {
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

    authRequest.on("error", (e) => {
      throw new Error(e.message);
    });

    authRequest.end();
  }

  public authCallback(
    req: AuthRequest,
    cb: Callback<OAuthTokenCallbackData>,
  ): void {
    const tokenData: Record<string, string> = {
      client_id: this.CONSUMER_KEY,
      client_secret: this.CONSUMER_SECRET,
      redirect_uri: this.REDIRECT_URI || "",
      code: req.query.code,
      grant_type: "authorization_code",
    };

    const state = req.query.state;
    if (state) {
      tokenData.state = state;
    }

    const options: https.RequestOptions = {
      hostname: "api.login.yahoo.com",
      port: 443,
      path: "/oauth2/get_token",
      method: this.POST,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${this.CONSUMER_KEY}:${this.CONSUMER_SECRET}`,
        ).toString("base64")}`,
      },
    };

    const tokenRequest = https.request(options, (tokenResponse) => {
      const chunks: Buffer[] = [];

      tokenResponse.on("data", (d) => {
        chunks.push(d);
      });

      tokenResponse.on("end", async () => {
        try {
          const tokenData: OAuthTokens = JSON.parse(
            Buffer.concat(chunks).toString(),
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

    tokenRequest.on("error", (e) => {
      cb(e);
    });

    tokenRequest.write(new URLSearchParams(tokenData).toString());
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
  public refreshAuthToken(
    refreshToken: string,
    cb?: Callback<OAuthTokens>,
  ): Promise<OAuthTokens> | void {
    this.setRefreshToken(refreshToken);
    return cb ? this.refreshToken(cb) : this.refreshToken();
  }

  private refreshTokenWithCallback(cb: Callback<OAuthTokens>): void {
    if (!this.yahooRefreshToken) {
      cb(new Error("No refresh token available"));
      return;
    }

    const refreshData = new URLSearchParams({
      grant_type: "refresh_token",
      redirect_uri: this.REDIRECT_URI || "",
      refresh_token: this.yahooRefreshToken,
    }).toString();

    const options: https.RequestOptions = {
      hostname: "api.login.yahoo.com",
      port: 443,
      path: "/oauth2/get_token",
      method: this.POST,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${this.CONSUMER_KEY}:${this.CONSUMER_SECRET}`,
        ).toString("base64")}`,
      },
    };

    const tokenRequest = https.request(options, (tokenResponse) => {
      const chunks: Buffer[] = [];

      tokenResponse.on("data", (d) => {
        chunks.push(d);
      });

      tokenResponse.on("end", async () => {
        try {
          const tokenData: OAuthTokens = JSON.parse(
            Buffer.concat(chunks).toString(),
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

    tokenRequest.on("error", (e) => {
      cb(e);
    });

    tokenRequest.write(refreshData);
    tokenRequest.end();
  }

  private parseApiArgs(args: any[]): ApiArgs {
    const method = args[0] as HttpMethod;
    const url = args[1] as string;
    const callback = args.find((arg) => typeof arg === "function") as
      | Callback<any>
      | undefined;
    const postData =
      args.length > 3 || (args.length === 3 && !callback) ? args[2] : false;

    return { method, url, postData, callback };
  }

  private buildApiParams(method: HttpMethod, url: string): Record<string, any> {
    const params: Record<string, any> = { format: "json" };

    if (this.yahooUserToken) {
      return params;
    }

    const oauthParams = {
      ...params,
      oauth_consumer_key: this.CONSUMER_KEY,
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: Math.floor(Date.now() / 1000),
      oauth_nonce: crypto.randomBytes(12).toString("base64"),
      oauth_version: "1.0",
    };
    const signature = oauthSignature.generate(
      method,
      url,
      oauthParams,
      this.CONSUMER_SECRET,
    );

    return {
      ...oauthParams,
      oauth_signature: decodeURIComponent(signature),
    };
  }

  private hasWritableBody(method: HttpMethod, postData: any): boolean {
    return Boolean(postData) && (method === this.POST || method === this.PUT);
  }

  private buildApiHeaders(
    method: HttpMethod,
    postData: any,
  ): Record<string, string> {
    const headers: Record<string, string> = {};

    if (this.yahooUserToken) {
      headers.Authorization = `Bearer ${this.yahooUserToken}`;
    }

    if (this.hasWritableBody(method, postData)) {
      headers["Content-Type"] = "application/xml";
    }

    return headers;
  }

  private buildApiPath(url: string, params: Record<string, any>): string {
    const apiPath = url.replace("https://fantasysports.yahooapis.com", "");
    const query = new URLSearchParams(
      Object.entries(params).map(([key, value]): [string, string] => [
        key,
        String(value),
      ]),
    ).toString();

    return `${apiPath}?${query}`;
  }

  private buildApiRequestOptions(
    method: HttpMethod,
    url: string,
    postData: any,
  ): https.RequestOptions {
    const params = this.buildApiParams(method, url);

    return {
      hostname: "fantasysports.yahooapis.com",
      path: this.buildApiPath(url, params),
      method,
      headers: this.buildApiHeaders(method, postData),
    };
  }

  private writeRequestBody(
    request: ReturnType<typeof https.request>,
    method: HttpMethod,
    postData: any,
  ): void {
    if (this.hasWritableBody(method, postData)) {
      request.write(
        typeof postData === "string" ? postData : JSON.stringify(postData),
      );
    }
  }

  private isExpiredTokenError(error: any): boolean {
    return /"token_expired"/i.test(error?.description || "");
  }

  private async handleApiError(
    error: any,
    statusCode: number | undefined,
    method: HttpMethod,
    url: string,
    postData: any,
  ): Promise<any> {
    if (this.isExpiredTokenError(error)) {
      await this.refreshToken();
      return this.api(method, url, postData);
    }

    throw new YahooFantasyError(
      error.description || error.message,
      error.name,
      statusCode,
    );
  }

  private async parseApiResponse(
    data: string,
    statusCode: number | undefined,
    method: HttpMethod,
    url: string,
    postData: any,
  ): Promise<any> {
    let parsedData: any;

    try {
      parsedData = JSON.parse(data);
    } catch (parseError) {
      throw new Error(`Failed to parse response: ${parseError}`);
    }

    return parsedData.error
      ? this.handleApiError(parsedData.error, statusCode, method, url, postData)
      : parsedData;
  }

  private performRequest(
    method: HttpMethod,
    url: string,
    postData: any,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = https.request(
        this.buildApiRequestOptions(method, url, postData),
        (resp) => {
          let data = "";

          resp.on("data", (chunk) => {
            data += chunk;
          });

          resp.on("end", () => {
            this.parseApiResponse(data, resp.statusCode, method, url, postData)
              .then(resolve)
              .catch(reject);
          });
        },
      );

      request.on("error", (err) => {
        reject(new Error(err.message));
      });

      this.writeRequestBody(request, method, postData);
      request.end();
    });
  }

  // API method with overloads
  public api(method: HttpMethod, url: string, cb: Callback<any>): void;
  public api(
    method: HttpMethod,
    url: string,
    data: any,
    cb: Callback<any>,
  ): void;
  public api(method: HttpMethod, url: string): Promise<any>;
  public api(method: HttpMethod, url: string, data: any): Promise<any>;
  public api(...args: any[]): Promise<any> | void {
    const { method, url, postData, callback } = this.parseApiArgs(args);
    const request = this.performRequest(method, url, postData);

    if (callback) {
      request
        .then((data) => callback(null, data))
        .catch((err) => callback(err));
      return;
    }

    return request;
  }
}

export default YahooFantasy;
