// API Response Types based on Yahoo Fantasy Sports API

// Base wrapper for all API responses
export interface FantasyContent<T> {
  fantasy_content: T & {
    'xml:lang': string;
    'yahoo:uri': string;
    time: string;
    copyright: string;
    refresh_rate: string;
  };
}

// Error response
export interface YahooApiError {
  error: {
    'xml:lang': string;
    'yahoo:uri': string;
    description: string;
    detail: string;
  };
}

// Common types
export interface Manager {
  manager_id: string;
  nickname: string;
  guid: string;
  is_commissioner?: string;
  email?: string;
  image_url?: string;
}

export interface TeamLogo {
  size: string;
  url: string;
}

// Game types
export interface Game {
  game_key: string;
  game_id: string;
  name: string;
  code: string;
  type: string;
  url: string;
  season: string;
  is_registration_over?: number;
  is_game_over?: number;
  is_offseason?: number;
}

export interface GameWeek {
  week: string;
  display_name: string;
  start: string;
  end: string;
}

export interface GameDates {
  season?: {
    start_date: string;
    end_date: string;
  };
  [key: string]: any;
}

export interface StatCategory {
  stat_id: string;
  name: string;
  display_name: string;
  sort_order: string;
  position_type: string;
  stat_position_types?: Array<{
    position_type: string;
    is_only_display_stat?: string;
  }>;
  is_only_display_stat?: string;
}

export interface PositionType {
  type: string;
  display_name: string;
}

export interface RosterPosition {
  position: string;
  abbreviation?: string;
  display_name: string;
  position_type: string;
  is_starting_position?: string;
  count?: string;
}

// League types
export interface League {
  league_key: string;
  league_id: string;
  name: string;
  url: string;
  league_chat_id?: string;
  draft_status: string;
  num_teams: number;
  edit_key: string;
  weekly_deadline: string;
  league_update_timestamp: string;
  scoring_type: string;
  league_type: string;
  renew?: string;
  renewed?: string;
  short_invitation_url?: string;
  is_pro_league: string;
  current_week: string;
  start_week: string;
  start_date: string;
  end_week: string;
  end_date: string;
  is_finished?: number;
  game_code: string;
  season: string;
}

export interface LeagueSettings {
  draft_type: string;
  is_auction_draft: string;
  scoring_type: string;
  persistent_url?: string;
  uses_playoff: string;
  has_playoff_consolation_games: boolean;
  playoff_start_week: string;
  uses_playoff_reseeding: number;
  uses_lock_eliminated_teams: number;
  num_playoff_teams: string;
  num_playoff_consolation_teams: number;
  has_multiweek_championship: number;
  waiver_type: string;
  waiver_rule: string;
  uses_faab: string;
  draft_time: string;
  draft_pick_time: string;
  post_draft_players: string;
  max_teams: string;
  waiver_time: string;
  trade_end_date: string;
  trade_ratify_type: string;
  trade_reject_time: string;
  player_pool: string;
  cant_cut_list: string;
  is_publicly_viewable: string;
  roster_positions: RosterPosition[];
  stat_categories: {
    stats: StatCategory[];
  };
  stat_modifiers?: {
    stats: Array<{
      stat_id: string;
      value: string;
    }>;
  };
  max_adds?: string;
  season_type?: string;
  min_innings_pitched?: string;
  uses_fractional_points?: string;
  uses_negative_points?: string;
}

export interface TeamStanding {
  team_key: string;
  team_id: string;
  name: string;
  url: string;
  team_logos: Array<{ team_logo: TeamLogo }>;
  waiver_priority: number;
  number_of_moves: string;
  number_of_trades: string;
  clinched_playoffs?: number;
  managers: Array<{ manager: Manager }>;
  standings?: {
    rank: string;
    playoff_seed?: string;
    outcome_totals: {
      wins: string;
      losses: string;
      ties: string;
      percentage: string;
    };
    games_back?: string;
  };
  roster_adds?: {
    coverage_type: string;
    coverage_value: string;
    value: string;
  };
}

// Team types
export interface Team {
  team_key: string;
  team_id: string;
  name: string;
  is_owned_by_current_login?: number;
  url: string;
  team_logos: Array<{ team_logo: TeamLogo }>;
  division_id?: string;
  waiver_priority?: number;
  faab_balance?: string;
  number_of_moves: string;
  number_of_trades: string;
  roster_adds?: {
    coverage_type: string;
    coverage_value: string;
    value: string;
  };
  league_scoring_type?: string;
  has_draft_grade?: number;
  draft_grade?: string;
  draft_recap_url?: string;
  managers?: Array<{ manager: Manager }>;
  clinched_playoffs?: number;
}

export interface TeamMatchup {
  week: string;
  week_start: string;
  week_end: string;
  status: string;
  is_playoffs?: string;
  is_consolation?: string;
  is_matchup_recap_available?: number;
  matchup_recap_url?: string;
  matchup_grades?: Array<{
    team_key: string;
    grade: string;
  }>;
  teams: Array<{
    team: Array<any>; // Complex nested structure
  }>;
}

// Player types
export interface PlayerName {
  full: string;
  first: string;
  last: string;
  ascii_first: string;
  ascii_last: string;
}

export interface Player {
  player_key: string;
  player_id: string;
  name: PlayerName;
  editorial_player_key: string;
  editorial_team_key: string;
  editorial_team_full_name: string;
  editorial_team_abbr: string;
  uniform_number?: string;
  display_position: string;
  headshot?: {
    url: string;
    size: string;
  };
  image_url?: string;
  is_undroppable: string;
  position_type: string;
  eligible_positions: Array<{ position: string }>;
  has_player_notes?: number;
  player_notes_last_timestamp?: number;
  status?: string;
  status_full?: string;
  injury_note?: string;
  has_recent_player_notes?: number;
  on_disabled_list?: string;
}

export interface PlayerStats {
  coverage_type: string;
  season?: string;
  date?: string;
  week?: string;
  stats: Array<{
    stat_id: string;
    value: string;
  }>;
}

export interface PlayerOwnership {
  ownership_type: string;
  owner_team_key?: string;
  owner_team_name?: string;
  teams: Array<{
    team_key: string;
    team_id: string;
    name: string;
    url: string;
    team_logos: Array<{ team_logo: TeamLogo }>;
    waiver_priority: number;
    faab_balance?: string;
    number_of_moves: string;
    number_of_trades: string;
    roster_adds: {
      coverage_type: string;
      coverage_value: string;
      value: string;
    };
    league_scoring_type: string;
    has_draft_grade: number;
    managers: Array<{ manager: Manager }>;
  }>;
}

// Transaction types
export interface Transaction {
  transaction_key: string;
  transaction_id: string;
  type: string;
  status: string;
  timestamp: string;
  players?: Array<{
    player: Player & {
      transaction_data: {
        type: string;
        source_type: string;
        destination_type: string;
        source_team_key?: string;
        source_team_name?: string;
        destination_team_key?: string;
        destination_team_name?: string;
      };
    };
  }>;
}

// Roster types
export interface RosterPlayer extends Player {
  selected_position: {
    coverage_type: string;
    date?: string;
    week?: string;
    position: string;
    is_flex?: number;
  };
}

export interface Roster {
  coverage_type: string;
  date?: string;
  week?: string;
  is_editable?: number;
  players: Array<{ player: RosterPlayer }>;
}

// User types
export interface UserGame {
  game_key: string;
  game_id: string;
  name: string;
  code: string;
  type: string;
  url: string;
  season: string;
  is_registration_over: number;
  is_game_over: number;
  is_offseason: number;
}

export interface UserLeague extends League {
  teams?: Array<{ team: Team }>;
}

// Mapped types — these represent the transformed shapes returned by helper functions.
// The helpers flatten Yahoo's raw array-of-objects format and reshape certain fields.

export interface MappedPlayer {
  player_key: string;
  player_id: string;
  name: PlayerName;
  editorial_player_key: string;
  editorial_team_key: string;
  editorial_team_full_name: string;
  editorial_team_abbr: string;
  uniform_number?: string;
  display_position: string;
  headshot?: string;
  image_url?: string;
  is_undroppable: string;
  position_type: string;
  primary_position?: string;
  eligible_positions: string[];
  has_player_notes?: number;
  player_notes_last_timestamp?: number;
  status?: string;
  status_full?: string;
  injury_note?: string;
  has_recent_player_notes?: number;
  on_disabled_list?: string;
  starting_status?: number;
  batting_order?: string;
  selected_position?: string;
  player_stats?: MappedStats;
  player_advanced_stats?: MappedStats;
  player_points?: MappedPoints;
  [key: string]: any;
}

export interface MappedStats {
  coverage_type: string;
  coverage_value: string;
  stats: Array<{ stat_id: string; value: string }>;
}

export interface MappedPoints {
  coverage_type: string;
  coverage_value: string;
  total: string;
}

export interface MappedOwnership {
  ownership_type: string;
  owner_team_key?: string;
  owner_team_name?: string;
}

export interface MappedDraftAnalysis {
  average_pick?: string;
  average_round?: string;
  average_cost?: string;
  percent_drafted?: string;
  [key: string]: any;
}

export interface MappedTeam {
  team_key: string;
  team_id: string;
  name: string;
  is_owned_by_current_login?: number;
  url: string;
  team_logo: string;
  division_id?: string;
  waiver_priority?: number;
  faab_balance?: string;
  number_of_moves: string;
  number_of_trades: number;
  roster_adds?: {
    coverage_type: string;
    coverage_value: string;
    value: string;
  };
  league_scoring_type?: string;
  has_draft_grade?: number;
  draft_grade?: string;
  draft_recap_url?: string;
  managers?: Manager[];
  clinched_playoffs?: number;
  auction_budget_total?: string;
  auction_budget_spent?: number;
  roster?: MappedPlayer[];
  standings?: any;
  points?: any;
  stats?: Array<{ stat_id: string; value: string }>;
  projected_points?: any;
  matchups?: any;
  draftresults?: any;
  [key: string]: any;
}

// Collection types
export interface GamesCollection {
  games: {
    [key: string]: Game | any;
    count: number;
  };
}

export interface LeaguesCollection {
  leagues: {
    [key: string]: League | any;
    count: number;
  };
}

export interface PlayersCollection {
  players: {
    [key: string]: Player | any;
    count: number;
  };
}

export interface TeamsCollection {
  teams: {
    [key: string]: Team | any;
    count: number;
  };
}

export interface TransactionsCollection {
  transactions: {
    [key: string]: Transaction | any;
    count: number;
  };
}