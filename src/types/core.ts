// Core configuration types
export interface YahooFantasyConfig {
  clientId: string;
  clientSecret: string;
  redirectUri?: string;
  accessToken?: string;
  refreshToken?: string;
}

// OAuth types
export interface OAuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  token_type?: string;
}

export interface OAuthTokenCallbackData extends OAuthTokens {
  state?: string;
}

export type TokenCallbackFunction = (tokens: OAuthTokens) => void | Promise<void>;

// Error types
export class YahooFantasyError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'YahooFantasyError';
  }
}

// HTTP types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Request types
export interface YahooApiRequest {
  url: string;
  method: HttpMethod;
  body?: any;
}

// Response types
export interface YahooApiResponse<T = any> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

// Callback types
export type Callback<T> = (error: Error | null, result?: T | undefined) => void;

// Method overload helper types
export type CallbackOrPromise<T> = T | Promise<T>;

// Utility type for methods that support both callbacks and promises
export type DualMethod<TArgs extends any[], TResult> = {
  (...args: [...TArgs, Callback<TResult>]): void;
  (...args: TArgs): Promise<TResult>;
};

// Base resource/collection interface
export interface BaseResource {
  yf: YahooFantasyInstance;
}

// Yahoo Fantasy instance interface (to avoid circular dependency)
export interface YahooFantasyInstance {
  CONSUMER_KEY: string;
  CONSUMER_SECRET: string;
  REDIRECT_URI?: string;
  yahooUserToken?: string | null;
  yahooRefreshToken?: string | null;
  refreshTokenCallback: TokenCallbackFunction;
  
  GET: HttpMethod;
  POST: HttpMethod;
  
  // Method to make API requests
  api(
    method: HttpMethod,
    url: string,
    data?: any,
    cb?: Callback<any>
  ): Promise<any> | void;
  
  // OAuth methods
  authCallback(req: any, cb: Callback<OAuthTokenCallbackData>): void;
  refreshAuthToken(refreshToken: string, cb?: Callback<OAuthTokens>): Promise<OAuthTokens> | void;
  setRefreshToken(refreshToken: string): void;
  setAccessToken(accessToken: string): void;
  getAccessToken(): string | undefined;
}