// Collection-specific type definitions

import {
  Callback,
  BaseResource
} from './core';

import {
  Game,
  League,
  MappedPlayer,
  MappedTeam,
  Transaction,
} from './api-responses';

import { WaiverOptions, ProposeTrade } from '../helpers/xmlHelper';

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
}

// Players Collection
export interface PlayersCollectionResource extends BaseCollection {
  fetch(playerKeys: string[], cb: Callback<MappedPlayer[]>): void;
  fetch(playerKeys: string[]): Promise<MappedPlayer[]>;
}

// Teams Collection  
export interface TeamsCollectionResource extends BaseCollection {
  fetch(teamKeys: string[], cb: Callback<MappedTeam[]>): void;
  fetch(teamKeys: string[]): Promise<MappedTeam[]>;
  
  league(leagueKey: string, cb: Callback<MappedTeam[]>): void;
  league(leagueKey: string): Promise<MappedTeam[]>;
}

// Transactions Collection
export interface TransactionsCollectionResource extends BaseCollection {
  fetch(transactionKeys: string[], cb: Callback<Transaction[]>): void;
  fetch(transactionKeys: string[]): Promise<Transaction[]>;
  
  league(leagueKey: string, cb: Callback<Transaction[]>): void;
  league(leagueKey: string): Promise<Transaction[]>;
  
  add_player(leagueKey: string, teamKey: string, playerKey: string): Promise<any>;
  add_player(leagueKey: string, teamKey: string, playerKey: string, cb: Callback<any>): void;

  drop_player(leagueKey: string, teamKey: string, playerKey: string): Promise<any>;
  drop_player(leagueKey: string, teamKey: string, playerKey: string, cb: Callback<any>): void;

  add_drop(leagueKey: string, teamKey: string, addPlayerKey: string, dropPlayerKey: string): Promise<any>;
  add_drop(leagueKey: string, teamKey: string, addPlayerKey: string, dropPlayerKey: string, cb: Callback<any>): void;

  waiver_claim(leagueKey: string, teamKey: string, addPlayerKey: string, opts?: WaiverOptions): Promise<any>;
  waiver_claim(leagueKey: string, teamKey: string, addPlayerKey: string, opts: WaiverOptions, cb: Callback<any>): void;
  waiver_claim(leagueKey: string, teamKey: string, addPlayerKey: string, cb: Callback<any>): void;

  propose_trade(leagueKey: string, traderTeamKey: string, tradeeTeamKey: string, trade: ProposeTrade): Promise<any>;
  propose_trade(leagueKey: string, traderTeamKey: string, tradeeTeamKey: string, trade: ProposeTrade, cb: Callback<any>): void;
}
