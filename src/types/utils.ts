// Utility types for Yahoo Fantasy API

// Common query parameter types
export interface PaginationParams {
  start?: number;
  count?: number;
}

export interface FilterParams {
  filters?: string[];
  sort?: string;
  sort_type?: 'season' | 'date' | 'week' | 'lastweek';
  sort_season?: string;
  sort_week?: number;
  sort_date?: string;
}

// Resource key types
export type GameKey = string;
export type LeagueKey = string;
export type TeamKey = string;
export type PlayerKey = string;
export type TransactionKey = string;
export type UserGuid = string;

// Common API response wrapper
export interface YahooApiWrapper<T> {
  fantasy_content: T;
}

// Collection response types
export interface CollectionResponse<T> {
  [key: string]: T | number | string | undefined;
  count?: number;
}

// Sub-resource types
export type SubResource =
  | 'stats'
  | 'standings'
  | 'scoreboard'
  | 'settings'
  | 'matchups'
  | 'roster'
  | 'draftresults'
  | 'transactions';

// Date/Time types
export interface WeekInfo {
  week: number;
  week_start: string;
  week_end: string;
}

// Common field types
export interface NameValue {
  name: string;
  value: string | number;
}

// Helper type to make all properties optional recursively
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
      ? DeepPartial<T[P]>
      : T[P];
};

// Helper type to extract promise type
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

// Helper type for API method signatures
export type ApiMethod<TParams = void, TResult = any> = TParams extends void
  ? {
      (cb: import('./core').Callback<TResult>): void;
      (): Promise<TResult>;
    }
  : {
      (params: TParams, cb: import('./core').Callback<TResult>): void;
      (params: TParams): Promise<TResult>;
    };

// Query builder types
export interface QueryOptions {
  format?: 'json' | 'xml';
  [key: string]: any;
}
