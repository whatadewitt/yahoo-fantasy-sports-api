// Collection-specific type definitions

import { 
  Callback, 
  BaseResource
} from './core';

import {
  Game,
  League,
  Player,
  Team,
  Transaction,
  GamesCollection,
  LeaguesCollection,
  PlayersCollection,
  TeamsCollection,
  TransactionsCollection
} from './api-responses';

import {
  FilterParams,
  PaginationParams
} from './utils';

// Base collection interface
export interface BaseCollection extends BaseResource {
  // Common collection methods could go here
}

// Games Collection
export interface GamesCollectionResource extends BaseCollection {
  fetch(gameKeys: string[], cb: Callback<Game[]>): void;
  fetch(gameKeys: string[]): Promise<Game[]>;
  
  user(cb: Callback<Game[]>): void;
  user(): Promise<Game[]>;
  
  userFetch(gameKeys: string[], cb: Callback<Game[]>): void;
  userFetch(gameKeys: string[]): Promise<Game[]>;
}

// Leagues Collection
export interface LeaguesCollectionResource extends BaseCollection {
  fetch(leagueKeys: string[], cb: Callback<League[]>): void;
  fetch(leagueKeys: string[]): Promise<League[]>;
  
  user(cb: Callback<League[]>): void;
  user(): Promise<League[]>;
  
  userFetch(leagueKeys: string[], cb: Callback<League[]>): void;
  userFetch(leagueKeys: string[]): Promise<League[]>;
}

// Players Collection
export interface PlayersCollectionResource extends BaseCollection {
  fetch(playerKeys: string[], cb: Callback<Player[]>): void;
  fetch(playerKeys: string[]): Promise<Player[]>;
  
  league(
    leagueKey: string, 
    params: PaginationParams & FilterParams, 
    cb: Callback<Player[]>
  ): void;
  league(
    leagueKey: string, 
    params: PaginationParams & FilterParams
  ): Promise<Player[]>;
  league(leagueKey: string, cb: Callback<Player[]>): void;
  league(leagueKey: string): Promise<Player[]>;
  
  team(teamKey: string, cb: Callback<Player[]>): void;
  team(teamKey: string): Promise<Player[]>;
  
  freeAgents(leagueKey: string, cb: Callback<Player[]>): void;
  freeAgents(leagueKey: string): Promise<Player[]>;
  
  ownership(leagueKey: string, playerKeys: string[], cb: Callback<any[]>): void;
  ownership(leagueKey: string, playerKeys: string[]): Promise<any[]>;
}

// Teams Collection  
export interface TeamsCollectionResource extends BaseCollection {
  fetch(teamKeys: string[], cb: Callback<Team[]>): void;
  fetch(teamKeys: string[]): Promise<Team[]>;
  
  league(leagueKey: string, cb: Callback<Team[]>): void;
  league(leagueKey: string): Promise<Team[]>;
  
  user(cb: Callback<Team[]>): void;
  user(): Promise<Team[]>;
  
  userFetch(teamKeys: string[], cb: Callback<Team[]>): void;
  userFetch(teamKeys: string[]): Promise<Team[]>;
}

// Transactions Collection
export interface TransactionsCollectionResource extends BaseCollection {
  fetch(transactionKeys: string[], cb: Callback<Transaction[]>): void;
  fetch(transactionKeys: string[]): Promise<Transaction[]>;
  
  league(leagueKey: string, cb: Callback<Transaction[]>): void;
  league(leagueKey: string): Promise<Transaction[]>;
  
  // TODO: Uncomment when implementation is ready
  // add_player(
  //   teamKey: string,
  //   playerKey: string,
  //   cb: Callback<Transaction>
  // ): void;
  // add_player(
  //   teamKey: string,
  //   playerKey: string
  // ): Promise<Transaction>;
  
  // drop_player(
  //   teamKey: string,
  //   playerKey: string,
  //   cb: Callback<Transaction>
  // ): void;
  // drop_player(
  //   teamKey: string,
  //   playerKey: string
  // ): Promise<Transaction>;
  
  // add_drop(
  //   teamKey: string,
  //   addPlayerKey: string,
  //   dropPlayerKey: string,
  //   cb: Callback<Transaction>
  // ): void;
  // add_drop(
  //   teamKey: string,
  //   addPlayerKey: string,
  //   dropPlayerKey: string
  // ): Promise<Transaction>;
}