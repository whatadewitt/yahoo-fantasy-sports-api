// Resource-specific type definitions

import {
  Callback,
  BaseResource
} from './core';

import {
  TradeResponseOptions,
  EditWaiverOptions,
  EditTradeOptions,
} from '../helpers/xmlHelper';

import {
  Game,
  GameWeek,
  StatCategory,
  PositionType,
  RosterPosition,
  League,
  LeagueSettings,
  MappedTeam,
  MappedPlayer,
  MappedStats,
  MappedDraftAnalysis,
  PlayerOwnership,
  Transaction,
  UserGame,
  UserLeague,
  FantasyContent
} from './api-responses';

// Game Resource
export interface GameResource extends BaseResource {
  meta(gameKey: string, cb: Callback<Game>): void;
  meta(gameKey: string): Promise<Game>;
  
  // REMOVED: leagues() and players() methods (deprecated)
  // Use league.meta() and player.meta() instead
  
  game_weeks(gameKey: string, cb: Callback<Game & { weeks: GameWeek[] }>): void;
  game_weeks(gameKey: string): Promise<Game & { weeks: GameWeek[] }>;
  
  stat_categories(gameKey: string, cb: Callback<Game & { stat_categories: StatCategory[] }>): void;
  stat_categories(gameKey: string): Promise<Game & { stat_categories: StatCategory[] }>;
  
  position_types(gameKey: string, cb: Callback<Game & { position_types: PositionType[] }>): void;
  position_types(gameKey: string): Promise<Game & { position_types: PositionType[] }>;
  
  roster_positions(gameKey: string, cb: Callback<Game & { roster_positions: RosterPosition[] }>): void;
  roster_positions(gameKey: string): Promise<Game & { roster_positions: RosterPosition[] }>;
}

// League Resource
export interface LeagueResource extends BaseResource {
  meta(leagueKey: string, cb: Callback<League>): void;
  meta(leagueKey: string): Promise<League>;
  
  settings(leagueKey: string, cb: Callback<LeagueSettings>): void;
  settings(leagueKey: string): Promise<LeagueSettings>;
  
  standings(leagueKey: string, cb: Callback<League & { standings: MappedTeam[] }>): void;
  standings(leagueKey: string): Promise<League & { standings: MappedTeam[] }>;
  
  scoreboard(leagueKey: string, week: number, cb: Callback<any>): void;
  scoreboard(leagueKey: string, week: number): Promise<any>;
  scoreboard(leagueKey: string, cb: Callback<any>): void;
  scoreboard(leagueKey: string): Promise<any>;
  
  teams(leagueKey: string, cb: Callback<MappedTeam[]>): void;
  teams(leagueKey: string): Promise<MappedTeam[]>;
  
  players(leagueKey: string, cb: Callback<MappedPlayer[]>): void;
  players(leagueKey: string): Promise<MappedPlayer[]>;
  
  draftResults(leagueKey: string, cb: Callback<any>): void;
  draftResults(leagueKey: string): Promise<any>;
  
  transactions(leagueKey: string, cb: Callback<Transaction[]>): void;
  transactions(leagueKey: string): Promise<Transaction[]>;
}

// Team Resource  
export interface TeamResource extends BaseResource {
  meta(teamKey: string, cb: Callback<MappedTeam>): void;
  meta(teamKey: string): Promise<MappedTeam>;
  
  stats(teamKey: string, cb: Callback<any>): void;
  stats(teamKey: string): Promise<any>;
  stats(teamKey: string, week: number, cb: Callback<any>): void;
  stats(teamKey: string, week: number): Promise<any>;
  
  standings(teamKey: string, cb: Callback<MappedTeam>): void;
  standings(teamKey: string): Promise<MappedTeam>;
  
  roster(teamKey: string, cb: Callback<MappedTeam>): void;
  roster(teamKey: string): Promise<MappedTeam>;
  roster(teamKey: string, week: number, cb: Callback<MappedTeam>): void;
  roster(teamKey: string, week: number): Promise<MappedTeam>;
  
  draft_results(teamKey: string, cb: Callback<any>): void;
  draft_results(teamKey: string): Promise<any>;
  
  matchups(teamKey: string, cb: Callback<MappedTeam>): void;
  matchups(teamKey: string): Promise<MappedTeam>;
  matchups(teamKey: string, weeks: number[], cb: Callback<MappedTeam>): void;
  matchups(teamKey: string, weeks: number[]): Promise<MappedTeam>;
}

// Player Resource
export interface PlayerResource extends BaseResource {
  meta(playerKey: string, cb: Callback<MappedPlayer>): void;
  meta(playerKey: string): Promise<MappedPlayer>;
  
  stats(playerKey: string, cb: Callback<MappedPlayer & { stats: MappedStats }>): void;
  stats(playerKey: string): Promise<MappedPlayer & { stats: MappedStats }>;
  stats(playerKey: string, week: number, cb: Callback<MappedPlayer & { stats: MappedStats }>): void;
  stats(playerKey: string, week: number): Promise<MappedPlayer & { stats: MappedStats }>;
  stats(playerKey: string, date: string, cb: Callback<MappedPlayer & { stats: MappedStats }>): void;
  stats(playerKey: string, date: string): Promise<MappedPlayer & { stats: MappedStats }>;
  stats(playerKey: string, type: 'lastweek' | 'lastmonth', cb: Callback<MappedPlayer & { stats: MappedStats }>): void;
  stats(playerKey: string, type: 'lastweek' | 'lastmonth'): Promise<MappedPlayer & { stats: MappedStats }>;
  
  ownership(playerKey: string, leagueKey: string, cb: Callback<PlayerOwnership>): void;
  ownership(playerKey: string, leagueKey: string): Promise<PlayerOwnership>;
  
  percent_owned(playerKey: string, cb: Callback<any>): void;
  percent_owned(playerKey: string): Promise<any>;
  
  draft_analysis(playerKey: string, cb: Callback<any>): void;
  draft_analysis(playerKey: string): Promise<any>;
}

// Roster Resource
export interface RosterResource extends BaseResource {
  players(teamKey: string, cb: Callback<MappedTeam>): void;
  players(teamKey: string): Promise<MappedTeam>;
  players(teamKey: string, date: string, cb: Callback<MappedTeam>): void;
  players(teamKey: string, date: string): Promise<MappedTeam>;
  players(teamKey: string, week: number, cb: Callback<MappedTeam>): void;
  players(teamKey: string, week: number): Promise<MappedTeam>;
}

// Transaction Resource
export interface TransactionResource extends BaseResource {
  meta(transactionKey: string, cb: Callback<Transaction>): void;
  meta(transactionKey: string): Promise<Transaction>;

  players(transactionKey: string, cb: Callback<MappedPlayer[]>): void;
  players(transactionKey: string): Promise<MappedPlayer[]>;

  accept(transactionKey: string, opts?: { trade_note?: string }): Promise<any>;
  accept(transactionKey: string, opts: { trade_note?: string }, cb: Callback<any>): void;
  accept(transactionKey: string, cb: Callback<any>): void;

  reject(transactionKey: string, opts?: { trade_note?: string }): Promise<any>;
  reject(transactionKey: string, opts: { trade_note?: string }, cb: Callback<any>): void;
  reject(transactionKey: string, cb: Callback<any>): void;

  allow(transactionKey: string): Promise<any>;
  allow(transactionKey: string, cb: Callback<any>): void;

  disallow(transactionKey: string): Promise<any>;
  disallow(transactionKey: string, cb: Callback<any>): void;

  vote_against(transactionKey: string, voterTeamKey: string): Promise<any>;
  vote_against(transactionKey: string, voterTeamKey: string, cb: Callback<any>): void;

  edit_waiver(transactionKey: string, opts: EditWaiverOptions): Promise<any>;
  edit_waiver(transactionKey: string, opts: EditWaiverOptions, cb: Callback<any>): void;

  edit_trade(transactionKey: string, opts: EditTradeOptions): Promise<any>;
  edit_trade(transactionKey: string, opts: EditTradeOptions, cb: Callback<any>): void;

  cancel(transactionKey: string): Promise<any>;
  cancel(transactionKey: string, cb: Callback<any>): void;
}

// User Resource
export interface UserResource extends BaseResource {
  games(cb: Callback<UserGame[]>): void;
  games(): Promise<UserGame[]>;
  
  game_leagues(gameKey: string, cb: Callback<UserLeague[]>): void;
  game_leagues(gameKey: string): Promise<UserLeague[]>;
  
  game_teams(gameKey: string, cb: Callback<MappedTeam[]>): void;
  game_teams(gameKey: string): Promise<MappedTeam[]>;
  
  leagues(cb: Callback<UserLeague[]>): void;
  leagues(): Promise<UserLeague[]>;
  
  teams(cb: Callback<MappedTeam[]>): void;
  teams(): Promise<MappedTeam[]>;
}