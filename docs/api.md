

<!-- Start index.js -->

* * *
# game

With the Game API, you can obtain the fantasy game related information, like the fantasy game name, the Yahoo! game code, and season.

To refer to a Game resource, you'll need to provide a game_key, which will either be a game_id or game_code. The game_id is a unique ID identifying a given fantasy game for a given season. A game_code generally identifies a game, independent of season, and, when used as a game_key, will typically return the current season of that game. For instance, the game_code for the Free NFL game is nfl; using nfl as your game_key during the 2014 season would be the same as providing the game_id for the 2014 season of the NFL game (331). As of the 2010 seasons, the Plus and Free games have been combined into a single code. If you always want the current season of a game, the game_code should be used as a game_key.

You can find a list of common game_ids in the [official Yahoo! Fantasy Sports documentation for the game resource](https://developer.yahoo.com/fantasysports/guide/game-resource.html).

maps to http://fantasysports.yahooapis.com/fantasy/v2/game/{game_key}/{sub_resource}

## [game.meta](http://yfantasysandbox.herokuapp.com/resource/game/meta) 
### How To Use:

Subresource to provide metadata about a queried game, including game key, code name, url, type and season.

```
yf.game.meta(
  game_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *game_key* Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season)

## [game.leagues](http://yfantasysandbox.herokuapp.com/resource/game/leagues) 
### How To Use:

Leagues that are marked as "public" are publicly queryable, while all other leagues will require a user to be logged in and part of the league to query.

You can specify either a single league id, or an array of league id's to return multiple leagues from the same game.

```
yf.game.leagues(
  game_key,
  league_key(s),
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *game_key* Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season)
* *league_key* League key format: {game_key}.l.{league_id}. For the purposes of this demo, you can enter a comma separated list of league keys for the array.

## [game.players](http://yfantasysandbox.herokuapp.com/resource/game/players) 
### How To Use:

You can use this subresource to query game eligible players.

You can specify either a single player id, or an array of player id's to return multiple leagues from the same game.

```
yf.game.players(
  game_key,
  player_key(s),
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *game_key* Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season)
* *player_key* Player key format: {game_key}.p.{player_id}. For the purposes of this demo, you can enter a comma separated list of player keys for the array.

## [game.game_weeks](http://yfantasysandbox.herokuapp.com/resource/game/game_weeks) 
### How To Use:

You can use this subresource to query start and end dates for each week in the game.

```
yf.game.game_weeks(
  game_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *game_key* Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season)

## [game.stat_categories](http://yfantasysandbox.herokuapp.com/resource/game/stat_categories) 
### How To Use:

Subresource to provide a detailed description of all stat categories for a game.

```
yf.game.stat_categories(
  game_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *game_key* Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season)

## [game.position_types](http://yfantasysandbox.herokuapp.com/resource/game/position_types) 
### How To Use:

Subresource to provide a detailed description of all player position types for the game.

```
yf.game.position_types(
  game_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *game_key* Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season)

## [game.roster_positions](http://yfantasysandbox.herokuapp.com/resource/game/roster_positions) 
### How To Use:

Subresource to provide a detailed description of all roster positions in a game.

```
yf.game.roster_positions(
  game_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *game_key* Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season)

* * *
# league

With the League API, you can obtain the league related information, like the league name, the number of teams, the draft status, et cetera. Leagues only exist in the context of a particular Game, although you can request a League Resource as the base of your URI by using the global league_key.

A particular user can only retrieve data for private leagues of which they are a member, or for public leagues.

maps to http://fantasysports.yahooapis.com/fantasy/v2/league/{league_key}/{sub_resource}

## [league.meta](http://yfantasysandbox.herokuapp.com/resource/league/meta) 
### How To Use:

Subresource to provide metadata about a queried league, including league key, id, name, url, draft status, number of teams, and current week information.

```
yf.league.meta(
  league_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *league_key* League key format: {game_key}.l.{league_id}

## [league.settings](http://yfantasysandbox.herokuapp.com/resource/league/settings) 
### How To Use:

Subresource to provide data regarding league settings. For instance, draft type, scoring type, roster positions, stat categories and modifiers, divisions.

```
yf.league.settings(
  league_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *league_key* League key format: {game_key}.l.{league_id}

## [league.standings](http://yfantasysandbox.herokuapp.com/resource/league/standings) 
### How To Use:

Subresource to provide ranking of teams within the league.

Please note that in the sample output below, the user's nicknames are automatically marked as '--hidden--', if you are not authorized and/or not in the league.

```
yf.league.standings(
  league_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *league_key* League key format: {game_key}.l.{league_id}

## [league.scoreboard](http://yfantasysandbox.herokuapp.com/resource/league/scoreboard) 
### How To Use:

Subresource to provide data regarding league matchups.

Only works for Head to Head leagues.

I hope to add the "week" parameter soon.

```
yf.league.scoreboard(
  league_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *league_key* League key format: {game_key}.l.{league_id}

## [league.teams](http://yfantasysandbox.herokuapp.com/resource/league/teams) 
### How To Use:

Subresource to provide data about all teams in a league.

```
yf.league.teams(
  league_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *league_key* League key format: {game_key}.l.{league_id}

## [league.draft_results](http://yfantasysandbox.herokuapp.com/resource/league/draft_results) 
### How To Use:

Subresource to provide draft result data from each team in the league.

```
yf.league.draft_results(
  league_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *league_key* League key format: {game_key}.l.{league_id}

## [league.transactions](http://yfantasysandbox.herokuapp.com/resource/league/transactions) 
### How To Use:

Subresource to data about league transactions, including adds, drops, and trades.

Please note that this function does return ALL league transactions, so it may take some time to parse based on your league.

```
yf.league.transactions(
  league_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *league_key* League key format: {game_key}.l.{league_id}

* * *
# player

With the Player API, you can obtain the player (athlete) related information, such as their name, professional team, and eligible positions. The player is identified in the context of a particular game, and can be requested as the base of your URI by using the global player_key.

maps to http://fantasysports.yahooapis.com/fantasy/v2/player/{player_key}/{sub_resource}

## [player.meta](http://yfantasysandbox.herokuapp.com/resource/player/meta) 
### How To Use:

Includes player key, id, name, editorial information, image, eligible positions, etc.

```
yf.player.meta(
  player_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *player_key* Player key format: {game_key}.p.{player_key}

## [player.stats](http://yfantasysandbox.herokuapp.com/resource/player/stats) 
### How To Use:

layer stats and points (if in a league context).

The option for "weekly" stats will be added soon.

```
yf.player.stats(
  player_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *player_key* Player key format: {game_key}.p.{player_key}

## [player.percent_owned](http://yfantasysandbox.herokuapp.com/resource/player/percent_owned) 
### How To Use:

Data about ownership percentage of the player.

```
yf.player.percent_owned(
  player_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *player_key* Player key format: {game_key}.p.{player_key}

## [player.ownership](http://yfantasysandbox.herokuapp.com/resource/player/ownership) 
### How To Use:

The player ownership status within a league (whether they're owned by a team, on waivers, or free agents).

Only relevant within a league.

```
yf.player.ownership(
  player_key,
  league_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *player_key* Player key format: {game_key}.p.{player_key}
* *league_key* League key format: {game_key}.l.{league_id}

## [player.draft_analysis](http://yfantasysandbox.herokuapp.com/resource/player/draft_analysis) 
### How To Use:

Average pick, Average round and Percent Drafted.

```
yf.player.draft_analysis(
  player_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *player_key* Player key format: {game_key}.p.{player_key}

* * *
# roster

Players on a team are organized into rosters corresponding to certain weeks, in NFL, or certain dates, in MLB, NBA, and NHL. Each player on a roster will be assigned a position if they're in the starting lineup, or will be on the bench. You can only receive credit for stats accumulated by players in your starting lineup.

Eventually the PUT functionality may be added.

maps to http://fantasysports.yahooapis.com/fantasy/v2/team/{team_key}/roster/{sub_resource}

## [roster.players](http://yfantasysandbox.herokuapp.com/resource/roster/players) 
### How To Use:

Access the players collection within the roster. Moving forward, the functionality to query a roster by date will be added.

For the purposes of this API, we only ever query the "players" subresource.

```
yf.roster.players(
  team_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *team_key* Team key format: {game_key}.l.{league_id}.t.{team_id}

* * *
# team

The Team APIs allow you to retrieve information about a team within our fantasy games. The team is the basic unit for keeping track of a roster of players, and can be managed by either one or two managers (the second manager being called a co-manager). With the Team APIs, you can obtain team-related information, like the team name, managers, logos, stats and points, and rosters for particular weeks. Teams only exist in the context of a particular League, although you can request a Team Resource as the base of your URI by using the global team_key. A particular user can only retrieve data about a team if that team is part of a private league of which the user is a member, or if it's in a public league.

maps to http://fantasysports.yahooapis.com/fantasy/v2/team/{team_key}/{sub_resource}

## [team.meta](http://yfantasysandbox.herokuapp.com/resource/team/meta) 
### How To Use:

Includes team key, id, name, url, division ID, logos, and team manager information.

```
yf.team.meta(
  team_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *team_key* Team key format: {game_key}.l.{league_id}.t.{team_id}

## [team.stats](http://yfantasysandbox.herokuapp.com/resource/team/stats) 
### How To Use:

Team statistical data and points.

```
yf.team.stats(
  team_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *team_key* Team key format: {game_key}.l.{league_id}.t.{team_id}

## [team.standings](http://yfantasysandbox.herokuapp.com/resource/team/standings) 
### How To Use:

Team rank, wins, losses, ties, and winning percentage (as well as divisional data if applicable).

```
yf.team.standings(
  team_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *team_key* Team key format: {game_key}.l.{league_id}.t.{team_id}

## [team.roster](http://yfantasysandbox.herokuapp.com/resource/team/roster) 
### How To Use:

Team roster.

Eventually, I plan to support the "week" parameter.

```
yf.team.roster(
  team_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *team_key* Team key format: {game_key}.l.{league_id}.t.{team_id}

## [team.draft_results](http://yfantasysandbox.herokuapp.com/resource/team/draft_results) 
### How To Use:

List of players drafted by the team.

I'm using "draft_results" instead of the documented "draftresults" simply for consistency.

```
yf.team.draft_results(
  team_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *team_key* Team key format: {game_key}.l.{league_id}.t.{team_id}

## [team.matchups](http://yfantasysandbox.herokuapp.com/resource/team/matchups) 
### How To Use:

List of players drafted by the team.

Subresource to provide data regarding team matchups for each week of the season.

Only works for Head to Head leagues.

I hope to add the "weeks" parameter soon.

```
yf.team.matchups(
  team_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *team_key* Team key format: {game_key}.l.{league_id}.t.{team_id}

* * *
# transaction

With the Transaction API, you can obtain information about transactions (adds, drops, trades, and league settings changes) performed on a league. A transaction is identified in the context of a particular league, although you can request a particular Transaction Resource as the base of your URI by using the global transaction_key.

maps to http://fantasysports.yahooapis.com/fantasy/v2/transaction/{transaction_key}/{sub_resource}

## [transaction.meta](http://yfantasysandbox.herokuapp.com/resource/transaction/meta) 
### How To Use:

Includes transaction key, id, type, timestamp, status, and players. For the purpose of this API, the players subresource is always called so players always come back by default

Keep in mind, if you don't have the transaction_key for a waiver claim or pending trade, the only way to discover these transactions is to filter the league Transactions collection by a particular type (waiver or pending_trade) and by a particular team_key. Pending transactions will not show up if you simply ask for all of the transactions in the league, because they can only be seen by certain teams.

At the moment, only "transactions" types are supported. Waiver claims and pending trades will soon be added.

In the future, I hope to support more than just the GET requests, but for the time being, they should be fine.

```
yf.transaction.meta(
  transaction_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *transaction_key* Transaction key format: {game_key}.l.{league_id}.tr.{transaction_id}

## [transaction.players](http://yfantasysandbox.herokuapp.com/resource/transaction/players) 
### How To Use:

Includes transaction key, id, type, timestamp, status, and players. For the purpose of this API, the players subresource is always called so players always come back by default

Keep in mind, if you don't have the transaction_key for a waiver claim or pending trade, the only way to discover these transactions is to filter the league Transactions collection by a particular type (waiver or pending_trade) and by a particular team_key. Pending transactions will not show up if you simply ask for all of the transactions in the league, because they can only be seen by certain teams.

At the moment, only "transactions" types are supported. Waiver claims and pending trades will soon be added.

In the future, I hope to support more than just the GET requests, but for the time being, they should be fine.

```
yf.transaction.players(
  transaction_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *transaction_key* Transaction key format: {game_key}.l.{league_id}.tr.{transaction_id}

* * *
# user

With the User API, you can retrieve fantasy information for a particular Yahoo! user. Most usefully, you can see which games a user is playing, and which leagues they belong to and teams that they own within those games.

Because you can currently only view user information for the logged in user, this API requires a user to be logged in to query.

## [user.games](http://yfantasysandbox.herokuapp.com/resource/user/games) 
### How To Use:

Fetch the Games in which the user has played.

Will soon add the "is_available" flag.

```
yf.user.games(
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

## [user.game_leagues](http://yfantasysandbox.herokuapp.com/resource/user/game_leagues) 
### How To Use:

Fetch leagues that the user belongs to in one or more games. The leagues will be scoped to the user. This will throw an error if any of the specified games do not support league sub-resources.

```
yf.user.game_leagues(
  game_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *game_key* Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season). For the purposes of this demo, you can enter a comma separated list of league keys for the array.

## [user.game_teams](http://yfantasysandbox.herokuapp.com/resource/user/game_teams) 
### How To Use:

Fetch teams owned by the user in one or more games. The teams will be scoped to the user. This will throw an error if any of the specified games do not support team sub-resources.

```
yf.user.game_teams(
  game_key,
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *game_key* Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season). For the purposes of this demo, you can enter a comma separated list of league keys for the array.

* * *
# games

With the Games API, you can obtain information from a collection of games simultaneously. Each element beneath the Games Collection will be a Game Resource.

## [games.fetch](http://yfantasysandbox.herokuapp.com/resource/games/fetch) 
### How To Use:

Fetch specific games {game_key1} and {game_key2}.

The only required parameters are the game_key(s), and the callback function. If you're only searching for a single game_key, you should probably be using the game resource, but you can pass through the game_key as a string, and not an array.

The subresources are the different subresources available for a game resource. This is not a required parameter. If you're only searching for a single subresource, you can simply pass through a string indicating that subresource. The "metadata" subresource comes back by default with all games collection requests.

The filters object are the filters you wish to add to the request. This is not a required parameter. Filters are as follows:

* is_available (1 to show games currently in season)
* game_types (full, pickem-team, pickem-group, pickem-team-list)
* game_codes (any valid game codes)
* seasons (any valid seasons)

Please note, I've found that specifying filters and game_keys will return an empty dataset. Not sure why you cannot use both, but you can't...

```
yf.games.fetch(
  [game_keys] OR {filters},
  [subresources], // optional
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *game_key* Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season). For the purposes of this demo, you can enter a comma separated list of league keys for the array.
* *game_weeks* 
* *stat_categories* 
* *position_types* 
* *roster_positions* 

## [games.user](http://yfantasysandbox.herokuapp.com/resource/games/user) 
### How To Use:

Fetch all games for the logged in user. Requires authentication.

The subresources are the different subresources available for a game resource. This is not a required parameter. If you're only searching for a single subresource, you can simply pass through a string indicating that subresource. The "metadata" subresource comes back by default with all games collection requests.

The filters object are the filters you wish to add to the request. This is not a required parameter. Filters are as follows:

* is_available (1 to show games currently in season)
* game_types (full, pickem-team, pickem-group, pickem-team-list)
* game_codes (any valid game codes)
* seasons (any valid seasons)

```
yf.games.user(
  {filters}, // optional
  [subresources], // optional
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *game_key* Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season). For the purposes of this demo, you can enter a comma separated list of league keys for the array.
* *game_weeks* 
* *leagues* 
* *stat_categories* 
* *position_types* 
* *roster_positions* 
* *teams* note: "teams" subresource only available in the games collection for specific users

## [games.userFetch](http://yfantasysandbox.herokuapp.com/resource/games/userFetch) 
### How To Use:

Fetch specific games {game_key1} and {game_key2}.

The only required parameters are the game_key(s), and the callback function. If you're only searching for a single game_key, you should probably be using the game resource, but you can pass through the game_key as a string, and not an array.

The subresources are the different subresources available for a game resource. This is not a required parameter. If you're only searching for a single subresource, you can simply pass through a string indicating that subresource. The "metadata" subresource comes back by default with all games collection requests.

The filters object are the filters you wish to add to the request. This is not a required parameter. Filters are as follows:

* is_available (1 to show games currently in season)
* game_types (full, pickem-team, pickem-group, pickem-team-list)
* game_codes (any valid game codes)
* seasons (any valid seasons)
Please note, I've found that specifying filters and game_keys will return an empty dataset. Not sure why you cannot use both, but you can't...

```
yf.games.userFetch(
  [game_keys],
  [subresources], // optional
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *game_key* Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season). For the purposes of this demo, you can enter a comma separated list of league keys for the array.
* *game_weeks* 
* *leagues* 
* *stat_categories* 
* *position_types* 
* *roster_positions* 

* * *
# leagues

With the Leagues API, you can obtain information from a collection of leagues simultaneously. Each element beneath the Leagues Collection will be a League Resource.

## [leagues.fetch](http://yfantasysandbox.herokuapp.com/resource/leagues/fetch) 
### How To Use:

Fetch specific leagues {league_key1} and {league_key2}.

The only required parameters are the league_key(s), and the callback function. If you're only searching for a single league_key, you should probably be using the league resource, but you can pass through the league_key as a string, and not an array.

The subresources are the different subresources available for a league resource. This is not a required parameter. If you're only searching for a single subresource, you can simply pass through a string indicating that subresource. The "metadata" subresource comes back by default with all games collection requests.

```
yf.leagues.fetch(
  [league_keys],
  [subresources], // optional
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *league_keys* League key format: {game_key}.l.{league_id}
* *settings* 
* *standings* 
* *scoreboard* 
* *teams* 
* *draftresults* 
* *transactions* 

* * *
# players

With the Players Collection API, you can obtain information from a collection of players simultaneously. the players collection can be qualified in the URI by a particular game, league or team. To obtain specific league or team related information, the players collection is qualified by the relevant league or team. Each element beneath the Players Collection will be a Player Resource

maps to http://fantasysports.yahooapis.com/fantasy/v2/players/{sub_resource}

## [players.fetch](http://yfantasysandbox.herokuapp.com/resource/players/fetch) 
### How To Use:

Fetch specific players {player_key1} and {player_key2}.

The only required parameters are the player_key(s), and the callback function. If you're only searching for a single player_key, you should probably be using the player resource, but you can pass through the player_key as a string, and not an array.

```
yf.players.fetch(
  [player_keys],
  [subresources], // optional
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *player_keys* Player key format: {game_key}.p.{player_key}
* *stats* 
* *percent_owned* 
* *ownership* 
* *draft_analysis* 

## [players.leagues](http://yfantasysandbox.herokuapp.com/resource/players/leagues) 
### How To Use:

Fetch all players from the leagues {league_key1} and {league_key2}.

The only required parameters are the league_key(s), and the callback function.

All filters can be used within the players.leagues context.

```
yf.players.leagues(
  [league_keys],
  {filters}, // optional
  [subresources], // optional
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *league_key* League key format: {game_key}.l.{league_key}
* *position* Valid player positions
* *status* A (all available players), FA (free agents only), W (waivers only), T (all taken players), K (keepers only)
* *search* Search for a player by name
* *sort* {stat_id}, NAME (last, first), OR (overall rank), AR (actual rank), PTS (fantasy points)
* *sort_type* season date (baseball, basketball and hockey only), week (football only), lastweek (baseball, basketball and hockey only), lastmonth
* *sort_season* year
* *sort_week* week
* *start* YYYY-MM-DD
* *start* first record to start from
* *count* number of results to retrieve
* *stats* 
* *ownership* 
* *percent_owned* 
* *draft_analysis* 

## [players.teams](http://yfantasysandbox.herokuapp.com/resource/players/teams) 
### How To Use:

Fetch all players from the teams {team_key1} and {team_key2}.

The only required parameters are the team_key(s), and the callback function.

Not all filters are available within the players.teams context.

```
yf.players.teams(
  [team_keys],
  {filters}, // optional
  [subresources], // optional
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *team_key* Team key format: {game_key}.l.{league_key}.t.{team_key}
* *start* first record to start from
* *count* number of results to retrieve
* *stats* 
* *percent_owned* 
* *draft_analysis* 

* * *
# teams

With the Teams API, you can obtain information from a collection of teams simultaneously. The teams collection is qualified in the URI by a particular league to obtain information about teams within the league, or by a particular user (and optionally, a game) to obtain information about the teams owned by the user. Each element beneath the Teams Collection will be a Team Resource.

maps to http://fantasysports.yahooapis.com/fantasy/v2/teams/{sub_resource}

## [teams.fetch](http://yfantasysandbox.herokuapp.com/resource/teams/fetch) 
### How To Use:

Fetch specific teams {team_key1} and {team_key2}.

The only required parameters are the team_key(s), and the callback function. If you're only searching for a single team_key, you should probably be using the team resource, but you can pass through the team_key as a string, and not an array.

```
yf.teams.fetch(
  [team_keys],
  [subresources], // optional
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *team_key* Team key format: {game_key}.l.{league_key}.t.{team_key}
* *stats* 
* *standings* 
* *roster* 
* *draftresults* 
* *matchups* 

## [teams.leagues](http://yfantasysandbox.herokuapp.com/resource/teams/leagues) 
### How To Use:

Fetch teams from specific leagues, using the league keys.

The only required parameters are the league_key(s), and the callback function. If you're only searching for teams from a single league, you should probably be using the league resource, but you can pass through the league_key as a string, and not an array.

```
yf.teams.leagues(
  [league_key],
  [subresources], // optional
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *league_key* League key format: {game_key}.l.{league_key}
* *stats* 
* *standings* 
* *roster* 
* *draftresults* 
* *matchups* 

## [teams.games](http://yfantasysandbox.herokuapp.com/resource/teams/games) 
### How To Use:

Fetch teams from specific games, using the game keys.

The only required parameters are the game_key(s), and the callback function. If you're only searching for teams from a single game, you should probably be using the game resource, but you can pass through the game_key as a string, and not an array.

```
yf.teams.games(
  [game_keys],
  [subresources], // optional
  function(err, data) {
    if (err)
      // handle error
      // do your thing
  }
);
```

### Params:

* *game_keys* Game key examples: 'mlb', 'nfl', 328 (2014 MLB season), 242 (2010 NFL season)
* *stats* 
* *standings* 
* *roster* 
* *draftresults* 
* *matchups* 

<!-- End index.js -->

