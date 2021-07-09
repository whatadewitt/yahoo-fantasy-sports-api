# Yahoo! Fantasy API Node Module

This is a node module created to wrap the Yahoo! Fantasy Sports API ([link](https://developer.yahoo.com/fantasysports/guide/index.html)). At the moment, not all subresources are available, nor are any of the 'collection' elements. I do hope to add them, and they have been added to the code, but as of now this project is very much in an open beta phase.

The API is designed to act as a helper for those interacting with the Y! Fantasy API. The goal is for ease of use for the user, both in terms of querying endpoints and parsing responses. I've noticed that in working with the API, the data is not always the easiest to understand, so hopefully what I have created here will help people out.

## Installation

You can install the module via npm by running:

    $ npm install yahoo-fantasy

## Licence

This module is available under the [MIT Licence](http://opensource.org/licenses/MIT)

## Documentation

More complete documentation can be found using the application sandbox. This sandbox is always a work in progress, if I've learned anything it's that nothing is ever complete.

The API can be used by simply importing the module and querying data, since version 4.0 the authentication flow has been built into the library to make things easier for users.

    // import the library
    const YahooFantasy = require('yahoo-fantasy');

    // you can get an application key/secret by creating a new application on Yahoo!
    const yf = new YahooFantasy(
      Y!APPLICATION_KEY, // Yahoo! Application Key
      Y!APPLICATION_SECRET, // Yahoo! Application Secret
      tokenCallbackFunction, // callback function when user token is refreshed (optional)
      redirectUri // redirect endpoint when user authenticates (optional)
    );

    // you can authenticate a user by setting a route to call the auth function
    // note: from v4.0 on, public queries are now supported; that is, you can query
    // public resources without authenticating a user (ie/ game meta, player meta,
    // and information from public leagues)
    yf.auth(
      response // response object to redirect the user to the Yahoo! login screen
    )

    // you also need to set up the callback route (defined as the redirect uri above)
    // note: this will automatically set the user and refresh token if the request is
    // successful, but you can also call them manually, described below
    yf.authCallback(
      request, // the request will contain the auth code from Yahoo!
      callback // callback function that will be called after the token has been retrieved
    )

    // if you're not authenticating via the library you'll need to set the Yahoo!
    // token for the user
    yf.setUserToken(
      Y!CLIENT_TOKEN
    );

    // you can do the same for the refresh token...
    // if you set this and the token expires (lasts an hour) then the token will automatically
    // refresh and call the above "tokenCallbackFunction" that you've specified to persist the
    // token elsewhere
    yf.setRefreshToken(
      Y!CLIENT_REFRESH_TOKEN
    );

    // query a resource/subresource
    yf.{resource}.{subresource} (
      {possible argument(s)},
      function cb(err, data) {
        // handle error
        // callback function
        // do your thing
      }
    );

### Starting with v3.1.0 you can also use a promise chain to query resources and subresources

    yf.{resource}.{subresource} (
      {possible argument(s)}
    )
    .then(data => // do your thing)
    .catch(err => // handle error)

### This also opens the door to use async/await in version of node that support it

    try {
      let data = await yf.{resource}.{subresource} (
        {possible argument(s)}
      )

      // do your thing
    } catch(err) {
      // handle error
    }

## Bugs & Issues

This project is very much still a work in progress, please report any issues via the [GitHub issues page](https://github.com/whatadewitt/yfsapi/issues).

## Changelog

### 4.1.5

- Fixed a bug where certain league settings were not loading properly for some older leagues. (merge [PR #80](https://github.com/whatadewitt/yahoo-fantasy-sports-api/pull/80)) (Thanks [connor4312](https://github.com/connor4312))

### 4.1.4

- Fixed a bug where the response from the token refresh was not being included in the promise chain. (merge [PR #78](https://github.com/whatadewitt/yahoo-fantasy-sports-api/pull/78)) (Thanks [connor4312](https://github.com/connor4312))

### 4.1.3

- Fixed a bug where Yahoo! apparently no longer requires `;type=week` when building a URL for team.stats and player.stats, leading to no stats coming back for those resources ([Issue #70](https://github.com/whatadewitt/yfsapi/issues/70"))

#### 4.1.2

- Fixed bug where "selected position" was no longer working due to a change in the data format coming from Yahoo! (merge [PR #69](https://github.com/whatadewitt/yahoo-fantasy-sports-api/pull/69)) (Thanks [brisberg](https://github.com/brisberg))

#### 4.1.1

- Small change to the way the resource and collection files are being imported as it was causing issues on some hosts...

#### 4.1.0

- Maybe would have made sense as a 5.0.0 as there may be breaking changes, but I haven't been able to find any yet...
- the authCallback() function will now return an object with the user's access_token and refresh_token
- the auth() function will accept a "state" string, allowing for state persistence through the authentication process
- re-enabled the transactions.fetch() collection call
- cleaned up the "wavier_days" and "stat_categories" objects on league resources
- added deprecation warnings to the game.leagues and game.players functions as they're not very useful in that context

#### 4.0.0

- Added auth(), authCallback, setRefreshToken() functions to the library
- Automatically handle refreshing of the token and call a user defined function when the token has expired
- Added support for public queries
- General cleanup

#### 3.2.0

- Added "players" subresource to "league" in order to obtain weekly / season stats for a player based on league settings
- Fixed a bug where the starting status wasn't properly being returned due to a shift in how the data was being returned
- Removed use of "request" library for size and performance reasons
- General code optimizations and improvements

#### 3.1.2

- Updated outdated dependencies

#### 3.1.1

- Resolve error when no team logo is present ([Issue #42](https://github.com/whatadewitt/yfsapi/issues/42))

#### 3.1.0

- Introduced `promise` based flow for all endpoints as an alternative to callbacks. Thanks [Marois](https://github.com/ryus08)!

#### 3.0.4

- Fixed a bug in the players.league collection call where it was trying to use split on an array... ([Issue #46](https://github.com/whatadewitt/yfsapi/pull/46")).
- Fixed similar bugs in other places...

#### 3.0.3

- Added the ability to specify a date or week when querying the `team.stats` resource.
- Unit test fixes ([Issue #42](https://github.com/whatadewitt/yfsapi/issues/42)). Thanks [Marios](https://github.com/ryus08)!
- Updated "vulnerable" dependencies.

#### 3.0.2

- Fixed an issue with the `user.game_leagues` resource, where the data was not at all user friendly (renamed `leagues` to `games` at the top level of the return object)

#### 3.0.1

- Fixed some typos in some import statements which caused issues on some servers

#### 3.0.0

- Major refactor to use ES6?... 2015? ...2018? Whatever the hell they're calling it now...
- Using ES Modules (mjs) files where possible
- Removed transactions collections (they'll be back!)

#### 2.0.4

- Added a fix to give a cleaner value for the new "batting order" attribute in the player oject.

#### 2.0.3

- Fixed a bug where the league players collection was not properly parsing the ownership subresource

#### 2.0.2

- Fixed a bug where "mapTeamPoints" helper function was not defining "self". Thanks [platky](https://github.com/platky)!

#### 2.0.1

- Removed the code that added a "reason" to errors coming from Yahoo! as it was breaking other errors. Retry notifications should now be handled within the application using the module.

#### 2.0.0

- Moved to Yahoo!'s OAuth2.0 authentication mechanism.

#### 1.0.2

- Fixed game resource roster postions callback bug.

#### 1.0.1

- Fixed a typo that was breaking team mapping.

#### 1.0.0

- Breaking changes
- Fixed NFL scoreboard/matchups bug ([Issue #19](https://github.com/whatadewitt/yfsapi/issues/19))
- In fixing this bug I realized that my "team" set up was really only useful for MLB fantasy, so I rewrote team mapping to work better across all sports and give additional details that weren't previously reported. This will cause errors if you are using the team.manager attribute in your code.

#### 0.5.3

- Fixed a bug where leagueFetch was throwing an error, thanks [danielspector](https://github.com/danielspector)!

#### 0.5.2

- Fixed a bug where player stats by week url was not being created properly, thanks [withsmilo](https://github.com/withsmilo)!

#### 0.5.1

- Fixed a bug where collections that contained subresources would return no data.

#### 0.5.0

- Added "Transactions" collection with functionality to add players, drop players, and add/drop players, thanks again [githubsmilo](https://github.com/githubsmilo)!

#### 0.4.4

- Fixed a bug in player.draft_analysis, thanks [githubsmilo](https://github.com/githubsmilo)!

#### 0.4.3

- Added weeks param for league.scoreboard
- Added weeks param for team.matchups
- Fixed a bug where individual players weren't mapping properly
- Minor code cleanup

#### 0.4.2

- Added the ability to specify a date or week when querying the roster resource.
- Cleaned up the player normalization model
- Fixed a bug where the team.roster call was erroring

#### 0.4.1

- Fixes to how POST data is handled

#### 0.4.0

- Significantly restructured the code to have more consistency and set it up better for future plans, namely POST methods and proper unit testing
- Removed the "refresh user token" and instead return the error to the user who can handle the refresh within their application.

#### 0.3.1

- Additional player attributes added, thanks [ryus08](https://github.com/ryus08)!

#### 0.3.0

- Added a method to refresh the user's token if it has expired.

#### 0.2.2

- Hotfix to fix "Teams" collection - use error first convention

#### 0.2.0

- Made helper classes more consistent
- Added collections for games, leagues, players, and teams
- Moved to error first convention because JavaScript

#### 0.1.2

- Added 'Team Matchups' subresource
- Added 'League Scoreboard' subresource
- Minor code cleanup and improvements

#### 0.1.1

- Refactored module to fix a bug where user sessions were not necessarily unique because of require caching.

#### 0.1

- Initial release.
