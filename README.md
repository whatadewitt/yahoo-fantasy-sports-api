Yahoo! Fantasy API Node Module
======

This is a node module created to wrap the Yahoo! Fantasy Sports API ([link](https://developer.yahoo.com/fantasysports/guide/index.html)). At the moment, not all subresources are available, nor are any of the 'collection' elements. I do hope to add them, and they have been added to the code, but as of now this project is very much in an open beta phase.

The API is designed to act as a helper for those interacting with the Y! Fantasy API. The goal is for ease of use for the user, both in terms of querying endpoints and parsing responses. I've noticed that in working with the API, the data is not always the easiest to understand, so hopefully what I have created here will help people out.

Installation
-------
You can install the module via npm by running:

    $ npm install yahoo-fantasy

Usage Note
-------
I've created a customized version of the [Passport Strategy for Yahoo! OAuth](https://github.com/whatadewitt/passport-yahoo-oauth) to help me when I developed this module. It's a fork of the strategy on the PassportJS homepage, which simply fixed a couple of issues. It would appear that the original creator is no longer supporting the strategy, and I may have missed some things, but it has worked as much as I've needed it. Please let me know if you have any questions about it.

Licence
-------
This module is available under the [MIT Licence](http://opensource.org/licenses/MIT)

Documentation
-------
More complete documentation can be found using the application sandbox. This sandbox is also a work in progress, but it is my hope going forward to complete it.

The API can be used by simply importing the module and querying data

    var YahooFantasy = require('yahoo-fantasy');
    // you can get an application key/secret by creating a new application on Yahoo!
    var yf = new YahooFantasy(
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

Bugs & Issues
-------
This project is very much still a work in progress, please report any issues via the [GitHub issues page](https://github.com/whatadewitt/yfsapi/issues).

Changelog
-------

#### 0.5.3
  * Fixed a bug where leagueFetch was throwing an error, thanks [danielspector](https://github.com/danielspector)!

#### 0.5.2
  * Fixed a bug where player stats by week url was not being created properly, thanks [withsmilo](https://github.com/withsmilo)!

#### 0.5.1
  * Fixed a bug where collections that contained subresources would return no data.

#### 0.5.0
  * Added "Transactions" collection with functionality to add players, drop players, and add/drop players, thanks again [githubsmilo](https://github.com/githubsmilo)!

#### 0.4.4
  * Fixed a bug in player.draft_analysis, thanks [githubsmilo](https://github.com/githubsmilo)!

#### 0.4.3
  * Added weeks param for league.scoreboard
  * Added weeks param for team.matchups
  * Fixed a bug where individual players weren't mapping properly
  * Minor code cleanup

#### 0.4.2
  * Added the ability to specify a date or week when querying the roster resource.
  * Cleaned up the player normalization model
  * Fixed a bug where the team.roster call was erroring

#### 0.4.1
  * Fixes to how POST data is handled

#### 0.4.0
  * Significantly restructured the code to have more consistency and set it up better for future plans, namely POST methods and proper unit testing
  * Removed the "refresh user token" and instead return the error to the user who can handle the refresh within their application. 

#### 0.3.1
  * Additional player attributes added, thanks [ryus08](https://github.com/ryus08)!

#### 0.3.0
  * Added a method to refresh the user's token if it has expired.

#### 0.2.2
  * Hotfix to fix "Teams" collection - use error first convention

#### 0.2.0
  * Made helper classes more consistent
  * Added collections for games, leagues, players, and teams
  * Moved to error first convention because JavaScript

#### 0.1.2
  * Added 'Team Matchups' subresource
  * Added 'League Scoreboard' subresource
  * Minor code cleanup and improvements

#### 0.1.1
  * Refactored module to fix a bug where user sessions were not necessarily unique because of require caching.

#### 0.1
  * Initial release.
