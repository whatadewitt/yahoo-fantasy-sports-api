'use strict';

module.exports = YahooFantasy;

var OAuth = require('oauth').OAuth,
  https = require('https'),
  querystring = require('querystring'),
  util = require('util'),
  _ = require('lodash'),
  Q = require('q'),
  gameResource = require('./resources/gameResource.js'),
  leagueResource = require('./resources/leagueResource.js'),
  playerResource = require('./resources/playerResource.js'),
  rosterResource = require('./resources/rosterResource.js'),
  teamResource = require('./resources/teamResource.js'),
  transactionResource = require('./resources/transactionResource.js'),
  userResource = require('./resources/userResource.js'),
  playersCollection = require('./collections/playersCollection.js'),
  gamesCollection = require('./collections/gamesCollection.js'),
  teamsCollection = require('./collections/teamsCollection.js'),
  leaguesCollection = require('./collections/leaguesCollection.js');
  // transactionsCollection = require('./collections/transactionsCollection.js')
  // usersCollection = require('./collections/usersCollection.js');

function YahooFantasy(consumerKey, consumerSecret) {
  var oauth = new OAuth(
    'https://api.login.yahoo.com/oauth/v2/get_request_token',
    'https://api.login.yahoo.com/oauth/v2/get_token',
    consumerKey,
    consumerSecret,
    '1.0',
    null,
    'HMAC-SHA1'
  );

  _.extend(this, {
    oauth: oauth,
    game: gameResource(),
    games: gamesCollection(),
    league: leagueResource(),
    leagues: leaguesCollection(),
    player: playerResource(),
    players: playersCollection(),
    team: teamResource(),
    teams: teamsCollection(),
    transaction: transactionResource(),
    // transactions: transactionsCollection(),
    roster: rosterResource(),
    user: userResource(),
    // users: usersCollection(),
    yuser: {
      token: null,
      secret: null,
      sessionHandle: null
    },
    consumer: {
      key: consumerKey,
      secret: consumerSecret
    }
  });

  // binding everything... is there really not a better way?

/**
 * * * *
 * # game
 *
 * With the Game API, you can obtain the fantasy game related information, like the fantasy game name, the Yahoo! game code, and season.
 *
 * To refer to a Game resource, you'll need to provide a game_key, which will either be a game_id or game_code. The game_id is a unique ID identifying a given fantasy game for a given season. A game_code generally identifies a game, independent of season, and, when used as a game_key, will typically return the current season of that game. For instance, the game_code for the Free NFL game is nfl; using nfl as your game_key during the 2014 season would be the same as providing the game_id for the 2014 season of the NFL game (331). As of the 2010 seasons, the Plus and Free games have been combined into a single code. If you always want the current season of a game, the game_code should be used as a game_key.
 *
 * You can find a list of common game_ids in the [official Yahoo! Fantasy Sports documentation for the game resource](https://developer.yahoo.com/fantasysports/guide/game-resource.html).
 *
 * maps to http://fantasysports.yahooapis.com/fantasy/v2/game/{game_key}/{sub_resource}
 */

/**
 * @name [game.meta](http://yfantasysandbox.herokuapp.com/resource/game/meta)
 *
 * ### How To Use:
 *
 * Subresource to provide metadata about a queried game, including game key, code name, url, type and season.
 *
 *```
 * yf.game.meta(
 *   game_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param game_key Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season)
 * @api public
 */
  this.game.meta = _.bind(this.game.meta, this);

/**
 * @name [game.leagues](http://yfantasysandbox.herokuapp.com/resource/game/leagues)
 *
 * ### How To Use:
 *
 * Leagues that are marked as "public" are publicly queryable, while all other leagues will require a user to be logged in and part of the league to query.
 *
 * You can specify either a single league id, or an array of league id's to return multiple leagues from the same game.
 *
 *```
 * yf.game.leagues(
 *   game_key,
 *   league_key(s),
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param game_key Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season)
 * @param league_key League key format: {game_key}.l.{league_id}. For the purposes of this demo, you can enter a comma separated list of league keys for the array.
 * @api public
 */
  this.game.leagues = _.bind(this.game.leagues, this);

/**
 * @name [game.players](http://yfantasysandbox.herokuapp.com/resource/game/players)
 *
 * ### How To Use:
 *
 * You can use this subresource to query game eligible players.
 *
 * You can specify either a single player id, or an array of player id's to return multiple leagues from the same game.
 *
 *```
 * yf.game.players(
 *   game_key,
 *   player_key(s),
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param game_key Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season)
 * @param player_key Player key format: {game_key}.p.{player_id}. For the purposes of this demo, you can enter a comma separated list of player keys for the array.
 * @api public
 */
  this.game.players = _.bind(this.game.players, this);
  
/**
 * @name [game.game_weeks](http://yfantasysandbox.herokuapp.com/resource/game/game_weeks)
 *
 * ### How To Use:
 *
 * You can use this subresource to query start and end dates for each week in the game.
 *
 *```
 * yf.game.game_weeks(
 *   game_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param game_key Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season)
 * @api public
 */
  this.game.game_weeks = _.bind(this.game.game_weeks, this);
  
/**
 * @name [game.stat_categories](http://yfantasysandbox.herokuapp.com/resource/game/stat_categories)
 *
 * ### How To Use:
 *
 * Subresource to provide a detailed description of all stat categories for a game.
 *
 *```
 * yf.game.stat_categories(
 *   game_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param game_key Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season)
 * @api public
 */
  this.game.stat_categories = _.bind(this.game.stat_categories, this);
  
/**
 * @name [game.position_types](http://yfantasysandbox.herokuapp.com/resource/game/position_types)
 *
 * ### How To Use:
 *
 * Subresource to provide a detailed description of all player position types for the game.
 *
 *```
 * yf.game.position_types(
 *   game_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param game_key Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season)
 * @api public
 */
  this.game.position_types = _.bind(this.game.position_types, this);
  
/**
 * @name [game.roster_positions](http://yfantasysandbox.herokuapp.com/resource/game/roster_positions)
 *
 * ### How To Use:
 *
 * Subresource to provide a detailed description of all roster positions in a game.
 *
 *```
 * yf.game.roster_positions(
 *   game_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param game_key Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season)
 * @api public
 */
  this.game.roster_positions = _.bind(this.game.roster_positions, this);

/**
 * * * *
 * # league
 *
 * With the League API, you can obtain the league related information, like the league name, the number of teams, the draft status, et cetera. Leagues only exist in the context of a particular Game, although you can request a League Resource as the base of your URI by using the global league_key.
 *
 * A particular user can only retrieve data for private leagues of which they are a member, or for public leagues.
 *
 * maps to http://fantasysports.yahooapis.com/fantasy/v2/league/{league_key}/{sub_resource}
 */

/**
 * @name [league.meta](http://yfantasysandbox.herokuapp.com/resource/league/meta)
 *
 * ### How To Use:
 *
 * Subresource to provide metadata about a queried league, including league key, id, name, url, draft status, number of teams, and current week information.
 *
 *```
 * yf.league.meta(
 *   league_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param league_key League key format: {game_key}.l.{league_id}
 * @api public
 */
  this.league.meta = _.bind(this.league.meta, this);

/**
 * @name [league.settings](http://yfantasysandbox.herokuapp.com/resource/league/settings)
 *
 * ### How To Use:
 *
 * Subresource to provide data regarding league settings. For instance, draft type, scoring type, roster positions, stat categories and modifiers, divisions.
 *
 *```
 * yf.league.settings(
 *   league_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param league_key League key format: {game_key}.l.{league_id}
 * @api public
 */
  this.league.settings = _.bind(this.league.settings, this);

/**
 * @name [league.standings](http://yfantasysandbox.herokuapp.com/resource/league/standings)
 *
 * ### How To Use:
 *
 * Subresource to provide ranking of teams within the league.
 *
 * Please note that in the sample output below, the user's nicknames are automatically marked as '--hidden--', if you are not authorized and/or not in the league.
 *
 *```
 * yf.league.standings(
 *   league_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param league_key League key format: {game_key}.l.{league_id}
 * @api public
 */
  this.league.standings = _.bind(this.league.standings, this);

/**
 * @name [league.scoreboard](http://yfantasysandbox.herokuapp.com/resource/league/scoreboard)
 *
 * ### How To Use:
 *
 * Subresource to provide data regarding league matchups.
 *
 * Only works for Head to Head leagues.
 *
 * I hope to add the "week" parameter soon.
 *
 *```
 * yf.league.scoreboard(
 *   league_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param league_key League key format: {game_key}.l.{league_id}
 * @api public
 */
  this.league.scoreboard = _.bind(this.league.scoreboard, this);

/**
 * @name [league.teams](http://yfantasysandbox.herokuapp.com/resource/league/teams)
 *
 * ### How To Use:
 *
 * Subresource to provide data about all teams in a league.
 *
 *```
 * yf.league.teams(
 *   league_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param league_key League key format: {game_key}.l.{league_id}
 * @api public
 */
  this.league.teams = _.bind(this.league.teams, this);
  
  // TODO: Not ready yet?
  this.league.players = _.bind(this.league.players, this);
  
/**
 * @name [league.draft_results](http://yfantasysandbox.herokuapp.com/resource/league/draft_results)
 *
 * ### How To Use:
 *
 * Subresource to provide draft result data from each team in the league.
 *
 *```
 * yf.league.draft_results(
 *   league_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param league_key League key format: {game_key}.l.{league_id}
 * @api public
 */
  this.league.draft_results = _.bind(this.league.draft_results, this);

/**
 * @name [league.transactions](http://yfantasysandbox.herokuapp.com/resource/league/transactions)
 *
 * ### How To Use:
 *
 * Subresource to data about league transactions, including adds, drops, and trades.
 *
 * Please note that this function does return ALL league transactions, so it may take some time to parse based on your league.
 *
 *```
 * yf.league.transactions(
 *   league_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param league_key League key format: {game_key}.l.{league_id}
 * @api public
 */
  this.league.transactions = _.bind(this.league.transactions, this);

/**
 * * * *
 * # player
 *
 * With the Player API, you can obtain the player (athlete) related information, such as their name, professional team, and eligible positions. The player is identified in the context of a particular game, and can be requested as the base of your URI by using the global player_key.
 *
 * maps to http://fantasysports.yahooapis.com/fantasy/v2/player/{player_key}/{sub_resource}
 */

/**
 * @name [player.meta](http://yfantasysandbox.herokuapp.com/resource/player/meta)
 *
 * ### How To Use:
 *
 * Includes player key, id, name, editorial information, image, eligible positions, etc.
 *
 *```
 * yf.player.meta(
 *   player_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param player_key Player key format: {game_key}.p.{player_key}
 * @api public
 */
  this.player.meta = _.bind(this.player.meta, this);

/**
 * @name [player.stats](http://yfantasysandbox.herokuapp.com/resource/player/stats)
 *
 * ### How To Use:
 *
 * layer stats and points (if in a league context).
 *
 * The option for "weekly" stats will be added soon.
 *
 *```
 * yf.player.stats(
 *   player_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param player_key Player key format: {game_key}.p.{player_key}
 * @api public
 */
  this.player.stats = _.bind(this.player.stats, this);

/**
 * @name [player.percent_owned](http://yfantasysandbox.herokuapp.com/resource/player/percent_owned)
 *
 * ### How To Use:
 *
 * Data about ownership percentage of the player.
 *
 *```
 * yf.player.percent_owned(
 *   player_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param player_key Player key format: {game_key}.p.{player_key}
 * @api public
 */
  this.player.percent_owned = _.bind(this.player.percent_owned, this);

/**
 * @name [player.ownership](http://yfantasysandbox.herokuapp.com/resource/player/ownership)
 *
 * ### How To Use:
 *
 * The player ownership status within a league (whether they're owned by a team, on waivers, or free agents).
 *
 * Only relevant within a league.
 *
 *```
 * yf.player.ownership(
 *   player_key,
 *   league_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param player_key Player key format: {game_key}.p.{player_key}
 * @param league_key League key format: {game_key}.l.{league_id}
 * @api public
 */
  this.player.ownership = _.bind(this.player.ownership, this);

/**
 * @name [player.draft_analysis](http://yfantasysandbox.herokuapp.com/resource/player/draft_analysis)
 *
 * ### How To Use:
 *
 * Average pick, Average round and Percent Drafted.
 *
 *```
 * yf.player.draft_analysis(
 *   player_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param player_key Player key format: {game_key}.p.{player_key}
 * @api public
 */
  this.player.draft_analysis = _.bind(this.player.draft_analysis, this);

/**
 * * * *
 * # roster
 *
 * Players on a team are organized into rosters corresponding to certain weeks, in NFL, or certain dates, in MLB, NBA, and NHL. Each player on a roster will be assigned a position if they're in the starting lineup, or will be on the bench. You can only receive credit for stats accumulated by players in your starting lineup.
 *
 * Eventually the PUT functionality may be added.
 *
 * maps to http://fantasysports.yahooapis.com/fantasy/v2/team/{team_key}/roster/{sub_resource}
 */

/**
 * @name [roster.players](http://yfantasysandbox.herokuapp.com/resource/roster/players)
 *
 * ### How To Use:
 *
 * Access the players collection within the roster. Moving forward, the functionality to query a roster by date will be added.
 *
 * For the purposes of this API, we only ever query the "players" subresource.
 *
 *```
 * yf.roster.players(
 *   team_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param team_key Team key format: {game_key}.l.{league_id}.t.{team_id}
 * @api public
 */
  this.roster.players = _.bind(this.roster.players, this);

/**
 * * * *
 * # team
 *
 * The Team APIs allow you to retrieve information about a team within our fantasy games. The team is the basic unit for keeping track of a roster of players, and can be managed by either one or two managers (the second manager being called a co-manager). With the Team APIs, you can obtain team-related information, like the team name, managers, logos, stats and points, and rosters for particular weeks. Teams only exist in the context of a particular League, although you can request a Team Resource as the base of your URI by using the global team_key. A particular user can only retrieve data about a team if that team is part of a private league of which the user is a member, or if it's in a public league.
 *
 * maps to http://fantasysports.yahooapis.com/fantasy/v2/team/{team_key}/{sub_resource}
 */

/**
 * @name [team.meta](http://yfantasysandbox.herokuapp.com/resource/team/meta)
 *
 * ### How To Use:
 *
 * Includes team key, id, name, url, division ID, logos, and team manager information.
 *
 *```
 * yf.team.meta(
 *   team_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param team_key Team key format: {game_key}.l.{league_id}.t.{team_id}
 * @api public
 */
  this.team.meta = _.bind(this.team.meta, this);

/**
 * @name [team.stats](http://yfantasysandbox.herokuapp.com/resource/team/stats)
 *
 * ### How To Use:
 *
 * Team statistical data and points.
 *
 *```
 * yf.team.stats(
 *   team_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param team_key Team key format: {game_key}.l.{league_id}.t.{team_id}
 * @api public
 */
  this.team.stats = _.bind(this.team.stats, this);

/**
 * @name [team.standings](http://yfantasysandbox.herokuapp.com/resource/team/standings)
 *
 * ### How To Use:
 *
 * Team rank, wins, losses, ties, and winning percentage (as well as divisional data if applicable).
 *
 *```
 * yf.team.standings(
 *   team_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param team_key Team key format: {game_key}.l.{league_id}.t.{team_id}
 * @api public
 */
  this.team.standings = _.bind(this.team.standings, this);

/**
 * @name [team.roster](http://yfantasysandbox.herokuapp.com/resource/team/roster)
 *
 * ### How To Use:
 *
 * Team roster.
 *
 * Eventually, I plan to support the "week" parameter.
 *
 *```
 * yf.team.roster(
 *   team_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param team_key Team key format: {game_key}.l.{league_id}.t.{team_id}
 * @api public
 */
  this.team.roster = _.bind(this.team.roster, this);

/**
 * @name [team.draft_results](http://yfantasysandbox.herokuapp.com/resource/team/draft_results)
 *
 * ### How To Use:
 *
 * List of players drafted by the team.
 *
 * I'm using "draft_results" instead of the documented "draftresults" simply for consistency.
 *
 *```
 * yf.team.draft_results(
 *   team_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param team_key Team key format: {game_key}.l.{league_id}.t.{team_id}
 * @api public
 */
  this.team.draft_results = _.bind(this.team.draft_results, this);

/**
 * @name [team.matchups](http://yfantasysandbox.herokuapp.com/resource/team/matchups)
 *
 * ### How To Use:
 *
 * List of players drafted by the team.
 *
 * Subresource to provide data regarding team matchups for each week of the season.
 *
 * Only works for Head to Head leagues.
 *
 * I hope to add the "weeks" parameter soon.
 *
 *```
 * yf.team.matchups(
 *   team_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param team_key Team key format: {game_key}.l.{league_id}.t.{team_id}
 * @api public
 */
  this.team.matchups = _.bind(this.team.matchups, this);

/**
 * * * *
 * # transaction
 *
 * With the Transaction API, you can obtain information about transactions (adds, drops, trades, and league settings changes) performed on a league. A transaction is identified in the context of a particular league, although you can request a particular Transaction Resource as the base of your URI by using the global transaction_key.
 *
 * maps to http://fantasysports.yahooapis.com/fantasy/v2/transaction/{transaction_key}/{sub_resource}
 */

/**
 * @name [transaction.meta](http://yfantasysandbox.herokuapp.com/resource/transaction/meta)
 *
 * ### How To Use:
 *
 * Includes transaction key, id, type, timestamp, status, and players. For the purpose of this API, the players subresource is always called so players always come back by default
 *
 * Keep in mind, if you don't have the transaction_key for a waiver claim or pending trade, the only way to discover these transactions is to filter the league Transactions collection by a particular type (waiver or pending_trade) and by a particular team_key. Pending transactions will not show up if you simply ask for all of the transactions in the league, because they can only be seen by certain teams.
 *
 * At the moment, only "transactions" types are supported. Waiver claims and pending trades will soon be added.
 *
 * In the future, I hope to support more than just the GET requests, but for the time being, they should be fine.
 *
 *```
 * yf.transaction.meta(
 *   transaction_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param transaction_key Transaction key format: {game_key}.l.{league_id}.tr.{transaction_id}
 * @api public
 */
  this.transaction.meta = _.bind(this.transaction.meta, this);

/**
 * @name [transaction.players](http://yfantasysandbox.herokuapp.com/resource/transaction/players)
 *
 * ### How To Use:
 *
 * Includes transaction key, id, type, timestamp, status, and players. For the purpose of this API, the players subresource is always called so players always come back by default
 *
 * Keep in mind, if you don't have the transaction_key for a waiver claim or pending trade, the only way to discover these transactions is to filter the league Transactions collection by a particular type (waiver or pending_trade) and by a particular team_key. Pending transactions will not show up if you simply ask for all of the transactions in the league, because they can only be seen by certain teams.
 *
 * At the moment, only "transactions" types are supported. Waiver claims and pending trades will soon be added.
 *
 * In the future, I hope to support more than just the GET requests, but for the time being, they should be fine.
 *
 *```
 * yf.transaction.players(
 *   transaction_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param transaction_key Transaction key format: {game_key}.l.{league_id}.tr.{transaction_id}
 * @api public
 */
  this.transaction.players = _.bind(this.transaction.players, this);

/**
 * * * *
 * # user
 *
 * With the User API, you can retrieve fantasy information for a particular Yahoo! user. Most usefully, you can see which games a user is playing, and which leagues they belong to and teams that they own within those games.
 *
 * Because you can currently only view user information for the logged in user, this API requires a user to be logged in to query.
 */

/**
 * @name [user.games](http://yfantasysandbox.herokuapp.com/resource/user/games)
 *
 * ### How To Use:
 *
 * Fetch the Games in which the user has played.
 *
 * Will soon add the "is_available" flag.
 *
 *```
 * yf.user.games(
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @api public
 */
  this.user.games = _.bind(this.user.games, this);

/**
 * @name [user.game_leagues](http://yfantasysandbox.herokuapp.com/resource/user/game_leagues)
 *
 * ### How To Use:
 *
 * Fetch leagues that the user belongs to in one or more games. The leagues will be scoped to the user. This will throw an error if any of the specified games do not support league sub-resources.
 *
 *```
 * yf.user.game_leagues(
 *   game_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param game_key Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season). For the purposes of this demo, you can enter a comma separated list of league keys for the array.
 * @api public
 */
  this.user.game_leagues = _.bind(this.user.game_leagues, this);

/**
 * @name [user.game_teams](http://yfantasysandbox.herokuapp.com/resource/user/game_teams)
 *
 * ### How To Use:
 *
 * Fetch teams owned by the user in one or more games. The teams will be scoped to the user. This will throw an error if any of the specified games do not support team sub-resources.
 *
 *```
 * yf.user.game_teams(
 *   game_key,
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param game_key Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season). For the purposes of this demo, you can enter a comma separated list of league keys for the array.
 * @api public
 */
  this.user.game_teams = _.bind(this.user.game_teams, this);

/**
 * * * *
 * # games
 *
 * With the Games API, you can obtain information from a collection of games simultaneously. Each element beneath the Games Collection will be a Game Resource.
 */

/**
 * @name [games.fetch](http://yfantasysandbox.herokuapp.com/resource/games/fetch)
 *
 * ### How To Use:
 *
 * Fetch specific games {game_key1} and {game_key2}.
 *
 * The only required parameters are the game_key(s), and the callback function. If you're only searching for a single game_key, you should probably be using the game resource, but you can pass through the game_key as a string, and not an array.
 *
 * The subresources are the different subresources available for a game resource. This is not a required parameter. If you're only searching for a single subresource, you can simply pass through a string indicating that subresource. The "metadata" subresource comes back by default with all games collection requests.
 *
 * The filters object are the filters you wish to add to the request. This is not a required parameter. Filters are as follows:
 *
 * * is_available (1 to show games currently in season)
 * * game_types (full, pickem-team, pickem-group, pickem-team-list)
 * * game_codes (any valid game codes)
 * * seasons (any valid seasons)
 *
 * Please note, I've found that specifying filters and game_keys will return an empty dataset. Not sure why you cannot use both, but you can't...
 *
 *```
 * yf.games.fetch(
 *   [game_keys] OR {filters},
 *   [subresources], // optional
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param game_key Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season). For the purposes of this demo, you can enter a comma separated list of league keys for the array.
 * @param game_weeks
 * @param stat_categories
 * @param position_types
 * @param roster_positions
 * @api public
 */
  this.games.fetch = _.bind(this.games.fetch, this);

/**
 * @name [games.user](http://yfantasysandbox.herokuapp.com/resource/games/user)
 *
 * ### How To Use:
 *
 * Fetch all games for the logged in user. Requires authentication.
 *
 * The subresources are the different subresources available for a game resource. This is not a required parameter. If you're only searching for a single subresource, you can simply pass through a string indicating that subresource. The "metadata" subresource comes back by default with all games collection requests.
 *
 * The filters object are the filters you wish to add to the request. This is not a required parameter. Filters are as follows:
 *
 * * is_available (1 to show games currently in season)
 * * game_types (full, pickem-team, pickem-group, pickem-team-list)
 * * game_codes (any valid game codes)
 * * seasons (any valid seasons)
 *
 *```
 * yf.games.user(
 *   {filters}, // optional
 *   [subresources], // optional
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param game_key Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season). For the purposes of this demo, you can enter a comma separated list of league keys for the array.
 * @param game_weeks
 * @param leagues
 * @param stat_categories
 * @param position_types
 * @param roster_positions
 * @param teams note: "teams" subresource only available in the games collection for specific users
 * @api public
 */
  this.games.user = _.bind(this.games.user, this);

/**
 * @name [games.userFetch](http://yfantasysandbox.herokuapp.com/resource/games/userFetch)
 *
 * ### How To Use:
 *
 * Fetch specific games {game_key1} and {game_key2}.
 *
 * The only required parameters are the game_key(s), and the callback function. If you're only searching for a single game_key, you should probably be using the game resource, but you can pass through the game_key as a string, and not an array.
 *
 * The subresources are the different subresources available for a game resource. This is not a required parameter. If you're only searching for a single subresource, you can simply pass through a string indicating that subresource. The "metadata" subresource comes back by default with all games collection requests.
 *
 * The filters object are the filters you wish to add to the request. This is not a required parameter. Filters are as follows:
 *
 * * is_available (1 to show games currently in season)
 * * game_types (full, pickem-team, pickem-group, pickem-team-list)
 * * game_codes (any valid game codes)
 * * seasons (any valid seasons)
 * Please note, I've found that specifying filters and game_keys will return an empty dataset. Not sure why you cannot use both, but you can't...
 *
 *```
 * yf.games.userFetch(
 *   [game_keys],
 *   [subresources], // optional
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param game_key Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season). For the purposes of this demo, you can enter a comma separated list of league keys for the array.
 * @param game_weeks
 * @param leagues
 * @param stat_categories
 * @param position_types
 * @param roster_positions
 * @api public
 */
  this.games.userFetch = _.bind(this.games.userFetch, this);

/**
 * * * *
 * # leagues
 *
 * With the Leagues API, you can obtain information from a collection of leagues simultaneously. Each element beneath the Leagues Collection will be a League Resource.
 */

/**
 * @name [leagues.fetch](http://yfantasysandbox.herokuapp.com/resource/leagues/fetch)
 *
 * ### How To Use:
 *
 * Fetch specific leagues {league_key1} and {league_key2}.
 *
 * The only required parameters are the league_key(s), and the callback function. If you're only searching for a single league_key, you should probably be using the league resource, but you can pass through the league_key as a string, and not an array.
 *
 * The subresources are the different subresources available for a league resource. This is not a required parameter. If you're only searching for a single subresource, you can simply pass through a string indicating that subresource. The "metadata" subresource comes back by default with all games collection requests.
 *
 *```
 * yf.leagues.fetch(
 *   [league_keys],
 *   [subresources], // optional
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param league_keys League key format: {game_key}.l.{league_id}
 * @param settings
 * @param standings
 * @param scoreboard
 * @param teams
 * @param draftresults
 * @param transactions
 * @api public
 */
  this.leagues.fetch = _.bind(this.leagues.fetch, this);

/**
 * * * *
 * # players
 *
 * With the Players Collection API, you can obtain information from a collection of players simultaneously. the players collection can be qualified in the URI by a particular game, league or team. To obtain specific league or team related information, the players collection is qualified by the relevant league or team. Each element beneath the Players Collection will be a Player Resource
 *
 * maps to http://fantasysports.yahooapis.com/fantasy/v2/players/{sub_resource}
 */

/**
 * @name [players.fetch](http://yfantasysandbox.herokuapp.com/resource/players/fetch)
 *
 * ### How To Use:
 *
 * Fetch specific players {player_key1} and {player_key2}.
 *
 * The only required parameters are the player_key(s), and the callback function. If you're only searching for a single player_key, you should probably be using the player resource, but you can pass through the player_key as a string, and not an array.
 *
 *```
 * yf.players.fetch(
 *   [player_keys],
 *   [subresources], // optional
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param player_keys Player key format: {game_key}.p.{player_key}
 * @param stats
 * @param percent_owned
 * @param ownership
 * @param draft_analysis
 * @api public
 */
  this.players.fetch = _.bind(this.players.fetch, this);

/**
 * @name [players.leagues](http://yfantasysandbox.herokuapp.com/resource/players/leagues)
 *
 * ### How To Use:
 *
 * Fetch all players from the leagues {league_key1} and {league_key2}.
 *
 * The only required parameters are the league_key(s), and the callback function.
 *
 * All filters can be used within the players.leagues context.
 *
 *```
 * yf.players.leagues(
 *   [league_keys],
 *   {filters}, // optional
 *   [subresources], // optional
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param league_key League key format: {game_key}.l.{league_key}
 * @param position Valid player positions
 * @param status A (all available players), FA (free agents only), W (waivers only), T (all taken players), K (keepers only)
 * @param search Search for a player by name
 * @param sort {stat_id}, NAME (last, first), OR (overall rank), AR (actual rank), PTS (fantasy points)
 * @param sort_type season date (baseball, basketball and hockey only), week (football only), lastweek (baseball, basketball and hockey only), lastmonth
 * @param sort_season year
 * @param sort_week week
 * @param start YYYY-MM-DD
 * @param start first record to start from
 * @param count number of results to retrieve
 * @param stats
 * @param ownership
 * @param percent_owned
 * @param draft_analysis
 * @api public
 */
  this.players.leagues = _.bind(this.players.leagues, this);

/**
 * @name [players.teams](http://yfantasysandbox.herokuapp.com/resource/players/teams)
 *
 * ### How To Use:
 *
 * Fetch all players from the teams {team_key1} and {team_key2}.
 *
 * The only required parameters are the team_key(s), and the callback function.
 *
 * Not all filters are available within the players.teams context.
 *
 *```
 * yf.players.teams(
 *   [team_keys],
 *   {filters}, // optional
 *   [subresources], // optional
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param team_key Team key format: {game_key}.l.{league_key}.t.{team_key}
 * @param start first record to start from
 * @param count number of results to retrieve
 * @param stats
 * @param percent_owned
 * @param draft_analysis
 * @api public
 */
  this.players.teams = _.bind(this.players.teams, this);

/**
 * * * *
 * # teams
 *
 * With the Teams API, you can obtain information from a collection of teams simultaneously. The teams collection is qualified in the URI by a particular league to obtain information about teams within the league, or by a particular user (and optionally, a game) to obtain information about the teams owned by the user. Each element beneath the Teams Collection will be a Team Resource.
 *
 * maps to http://fantasysports.yahooapis.com/fantasy/v2/teams/{sub_resource}
 */

/**
 * @name [teams.fetch](http://yfantasysandbox.herokuapp.com/resource/teams/fetch)
 *
 * ### How To Use:
 *
 * Fetch specific teams {team_key1} and {team_key2}.
 *
 * The only required parameters are the team_key(s), and the callback function. If you're only searching for a single team_key, you should probably be using the team resource, but you can pass through the team_key as a string, and not an array.
 *
 *```
 * yf.teams.fetch(
 *   [team_keys],
 *   [subresources], // optional
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param team_key Team key format: {game_key}.l.{league_key}.t.{team_key}
 * @param stats
 * @param standings
 * @param roster
 * @param draftresults
 * @param matchups
 * @api public
 */
  this.teams.fetch = _.bind(this.teams.fetch, this);

  // TODO: Add doc comments.
  this.teams.userFetch = _.bind(this.teams.userFetch, this);

/**
 * @name [teams.leagues](http://yfantasysandbox.herokuapp.com/resource/teams/leagues)
 *
 * ### How To Use:
 *
 * Fetch teams from specific leagues, using the league keys.
 *
 * The only required parameters are the league_key(s), and the callback function. If you're only searching for teams from a single league, you should probably be using the league resource, but you can pass through the league_key as a string, and not an array.
 *
 *```
 * yf.teams.leagues(
 *   [league_key],
 *   [subresources], // optional
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param league_key League key format: {game_key}.l.{league_key}
 * @param stats
 * @param standings
 * @param roster
 * @param draftresults
 * @param matchups
 * @api public
 */
  this.teams.leagues = _.bind(this.teams.leagues, this);

/**
 * @name [teams.games](http://yfantasysandbox.herokuapp.com/resource/teams/games)
 *
 * ### How To Use:
 *
 * Fetch teams from specific games, using the game keys.

The only required parameters are the game_key(s), and the callback function. If you're only searching for teams from a single game, you should probably be using the game resource, but you can pass through the game_key as a string, and not an array.
 *
 *```
 * yf.teams.games(
 *   [game_keys],
 *   [subresources], // optional
 *   function(err, data) {
 *     if (err)
 *       // handle error
 *       // do your thing
 *   }
 * );
 *```
 *
 * @param game_keys Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season)
 * @param stats
 * @param standings
 * @param roster
 * @param draftresults
 * @param matchups
 * @api public
 */
  this.teams.games = _.bind(this.teams.games, this);

  // this.transactions.fetch = _.bind(this.transactions.fetch, this);
  // this.transactions.leagueFetch = _.bind(this.transactions.leagueFetch, this);

  // this.users.fetch = _.bind(this.users.fetch, this);
}

YahooFantasy.prototype.setUserToken = function(userToken, userSecret, userSession) {
  this.yuser.token = userToken;
  this.yuser.secret = userSecret;
  this.yuser.sessionHandle = userSession;
};

YahooFantasy.prototype.refreshUserToken = function() {
  var deferred = Q.defer();
  var self = this;

  var now = Math.floor(new Date().getTime() / 1000);
  var refresh_data = querystring.stringify({
    oauth_nonce: now.toString(36),
    oauth_consumer_key: self.consumer.key,
    oauth_signature_method: 'plaintext',
    oauth_signature: self.consumer.secret + '&' + self.yuser.secret,
    oauth_version: '1.0',
    oauth_token: self.yuser.token,
    oauth_timestamp: now,
    oauth_session_handle: self.yuser.sessionHandle
  });

  https.get('https://api.login.yahoo.com/oauth/v2/get_token?' + refresh_data, function(res) {
    var s = '';
    res.on('data', function(d) {
      s += d;
    });

    res.on('end', function() {
      var data = querystring.parse(s);
      self.setUserToken(data.oauth_token, data.oauth_token_secret, data.oauth_session_handle);

      return deferred.resolve();
    });
  });

  return deferred.promise;
};

YahooFantasy.prototype.api = function(url, deferred) {
  var self = this;
  deferred = typeof deferred !== 'undefined' ?  deferred : Q.defer();

  this.oauth.get(
    url,
    self.yuser.token,
    self.yuser.secret,
    function(e, data, resp) {
      if (e) {
        if (401 == e.statusCode) {
          return self.refreshUserToken().then(function() {
            return self.api(url, deferred);
            });
        } else {
          deferred.reject(JSON.parse(data));
        }
      } else {
        try {
          data = JSON.parse(data);
        } catch (er) {
          deferred.reject(er);
        }

        deferred.resolve(data);
      }
    }
  );

  return deferred.promise;
};
