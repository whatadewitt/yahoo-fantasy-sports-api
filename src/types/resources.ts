// Resource-specific type definitions

import { 
  Callback, 
  BaseResource
} from './core';

import {
  Game,
  GameWeek,
  StatCategory,
  PositionType,
  RosterPosition,
  League,
  LeagueSettings,
  TeamStanding,
  Team,
  TeamMatchup,
  Player,
  PlayerStats,
  PlayerOwnership,
  Transaction,
  Roster,
  UserGame,
  UserLeague,
  FantasyContent
} from './api-responses';

// Game Resource
export interface GameResource extends BaseResource {
  meta(gameKey: string, cb: Callback<Game>): void;
  meta(gameKey: string): Promise<Game>;
  
  leagues(gameKey: string, leagueKeys: string[], cb: Callback<League[]>): void;
  leagues(gameKey: string, leagueKeys: string[]): Promise<League[]>;
  
  players(gameKey: string, playerKeys: string[], cb: Callback<Player[]>): void;
  players(gameKey: string, playerKeys: string[]): Promise<Player[]>;
  
  weeks(gameKey: string, cb: Callback<GameWeek[]>): void;
  weeks(gameKey: string): Promise<GameWeek[]>;
  
  statCategories(gameKey: string, cb: Callback<StatCategory[]>): void;
  statCategories(gameKey: string): Promise<StatCategory[]>;
  
  positionTypes(gameKey: string, cb: Callback<PositionType[]>): void;
  positionTypes(gameKey: string): Promise<PositionType[]>;
  
  rosterPositions(gameKey: string, cb: Callback<RosterPosition[]>): void;
  rosterPositions(gameKey: string): Promise<RosterPosition[]>;
}

// League Resource
export interface LeagueResource extends BaseResource {
  meta(leagueKey: string, cb: Callback<League>): void;
  meta(leagueKey: string): Promise<League>;
  
  settings(leagueKey: string, cb: Callback<LeagueSettings>): void;
  settings(leagueKey: string): Promise<LeagueSettings>;
  
  standings(leagueKey: string, cb: Callback<TeamStanding[]>): void;
  standings(leagueKey: string): Promise<TeamStanding[]>;
  
  scoreboard(leagueKey: string, week: number, cb: Callback<any>): void;
  scoreboard(leagueKey: string, week: number): Promise<any>;
  scoreboard(leagueKey: string, cb: Callback<any>): void;
  scoreboard(leagueKey: string): Promise<any>;
  
  teams(leagueKey: string, cb: Callback<Team[]>): void;
  teams(leagueKey: string): Promise<Team[]>;
  
  players(leagueKey: string, cb: Callback<Player[]>): void;
  players(leagueKey: string): Promise<Player[]>;
  
  draftResults(leagueKey: string, cb: Callback<any>): void;
  draftResults(leagueKey: string): Promise<any>;
  
  transactions(leagueKey: string, cb: Callback<Transaction[]>): void;
  transactions(leagueKey: string): Promise<Transaction[]>;
}

// Team Resource  
export interface TeamResource extends BaseResource {
  meta(teamKey: string, cb: Callback<Team>): void;
  meta(teamKey: string): Promise<Team>;
  
  stats(teamKey: string, cb: Callback<any>): void;
  stats(teamKey: string): Promise<any>;
  stats(teamKey: string, week: number, cb: Callback<any>): void;
  stats(teamKey: string, week: number): Promise<any>;
  
  standings(teamKey: string, cb: Callback<TeamStanding>): void;
  standings(teamKey: string): Promise<TeamStanding>;
  
  roster(teamKey: string, cb: Callback<Roster>): void;
  roster(teamKey: string): Promise<Roster>;
  roster(teamKey: string, week: number, cb: Callback<Roster>): void;
  roster(teamKey: string, week: number): Promise<Roster>;
  
  draftResults(teamKey: string, cb: Callback<any>): void;
  draftResults(teamKey: string): Promise<any>;
  
  matchups(teamKey: string, cb: Callback<TeamMatchup[]>): void;
  matchups(teamKey: string): Promise<TeamMatchup[]>;
  matchups(teamKey: string, weeks: number[], cb: Callback<TeamMatchup[]>): void;
  matchups(teamKey: string, weeks: number[]): Promise<TeamMatchup[]>;
}

// Player Resource
export interface PlayerResource extends BaseResource {
  meta(playerKey: string, cb: Callback<Player>): void;
  meta(playerKey: string): Promise<Player>;
  
  stats(playerKey: string, cb: Callback<PlayerStats>): void;
  stats(playerKey: string): Promise<PlayerStats>;
  stats(playerKey: string, week: number, cb: Callback<PlayerStats>): void;
  stats(playerKey: string, week: number): Promise<PlayerStats>;
  
  ownership(playerKey: string, leagueKey: string, cb: Callback<PlayerOwnership>): void;
  ownership(playerKey: string, leagueKey: string): Promise<PlayerOwnership>;
  
  percentOwned(playerKey: string, cb: Callback<any>): void;
  percentOwned(playerKey: string): Promise<any>;
  
  draftAnalysis(playerKey: string, cb: Callback<any>): void;
  draftAnalysis(playerKey: string): Promise<any>;
}

// Roster Resource
export interface RosterResource extends BaseResource {
  players(teamKey: string, cb: Callback<Roster>): void;
  players(teamKey: string): Promise<Roster>;
  players(teamKey: string, date: string, cb: Callback<Roster>): void;
  players(teamKey: string, date: string): Promise<Roster>;
  players(teamKey: string, week: number, cb: Callback<Roster>): void;
  players(teamKey: string, week: number): Promise<Roster>;
}

// Transaction Resource
export interface TransactionResource extends BaseResource {
  meta(transactionKey: string, cb: Callback<Transaction>): void;
  meta(transactionKey: string): Promise<Transaction>;
  
  players(transactionKey: string, cb: Callback<Player[]>): void;
  players(transactionKey: string): Promise<Player[]>;
}

// User Resource
export interface UserResource extends BaseResource {
  games(cb: Callback<UserGame[]>): void;
  games(): Promise<UserGame[]>;
  
  game_leagues(gameKey: string, cb: Callback<UserLeague[]>): void;
  game_leagues(gameKey: string): Promise<UserLeague[]>;
  
  game_teams(gameKey: string, cb: Callback<Team[]>): void;
  game_teams(gameKey: string): Promise<Team[]>;
  
  leagues(cb: Callback<UserLeague[]>): void;
  leagues(): Promise<UserLeague[]>;
  
  teams(cb: Callback<Team[]>): void;
  teams(): Promise<Team[]>;
}