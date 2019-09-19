# Yahoo! Fantasy API Node Module

This is a node module created to wrap the Yahoo! Fantasy Sports API ([link](https://developer.yahoo.com/fantasysports/guide/index.html)). At the moment, not all subresources are available, nor are any of the 'collection' elements. I do hope to add them, and they have been added to the code, but as of now this project is very much in an open beta phase.

The API is designed to act as a helper for those interacting with the Y! Fantasy API. The goal is for ease of use for the user, both in terms of querying endpoints and parsing responses. I've noticed that in working with the API, the data is not always the easiest to understand, so hopefully what I have created here will help people out.

## Installation

You can install the module via npm by running:

    $ npm install yahoo-fantasy

## Usage Note

<s>I've created a customized version of the [Passport Strategy for Yahoo! OAuth](https://github.com/whatadewitt/passport-yahoo-oauth) to help me when I developed this module. It's a fork of the strategy on the PassportJS homepage, which simply fixed a couple of issues. It would appear that the original creator is no longer supporting the strategy, and I may have missed some things, but it has worked as much as I've needed it. Please let me know if you have any questions about it.</s>

I recommend using the Passport Strategy for OAuth2 with the updates I've made to this project over the... years now... wow...

## Licence

This module is available under the [MIT Licence](http://opensource.org/licenses/MIT)

## Documentation

More complete documentation can be found using the application sandbox. This sandbox is also a work in progress, but it is my hope going forward to complete it.

The API can be used by simply importing the module and querying data

    const YahooFantasy = require('yahoo-fantasy');
    // you can get an application key/secret by creating a new application on Yahoo!
    const yf = new YahooFantasy(
      Y!APPLICATION_KEY,
      Y!APPLICATION_SECRET
    );

    // if a user has logged in (not required for all endpoints)
    yf.setUserToken(
      Y!CLIENT_TOKEN,
      Y!CLIENT_SECRET
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
