var playerHelper = require('../helpers/playerHelper.js');

/*
 * Includes player key, id, name, editorial information, image, eligible positions, etc.
*/
exports.meta = function(playerKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/player/' + playerKey + '/metadata?format=json')
    .then(function(data) {
      // var meta = data.fantasy_content.player;
      var meta = playerHelper.mapPlayer(data.player[0]);

      cb(meta);
    });
};

/*
 * Player stats and points (if in a league context).
 */
exports.stats = function(playerKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/player/' + playerKey + '/stats?format=json')
    .then(function(data) {
      var stats = data.fantasy_content;

      cb(stats);
    });
};

/*
 * Data about ownership percentage of the player
 */
exports.percent_owned = function(playerKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/player/' + playerKey + '/percent_owned?format=json')
    .then(function(data) {
      var ownership = data.fantasy_content;

      cb(ownership);
    });
};

/*
 * The player ownership status within a league (whether they're owned by a team, on waivers, or free agents). Only relevant within a league.
 */
exports.ownership = function(leagueKey, playerKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + leagueKey + '/players;player_keys=' + playerKey + '/ownership?format=json')
    .then(function(data) {
      var isOwned = data.fantasy_content;

      cb(isOwned);
    });
};

/*
 * Average pick, Average round and Percent Drafted.
 */
exports.draft_analysis = function(playerKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/player/' + playerKey + '/draft_analysis?format=json')
    .then(function(data) {
      var draft = data.fantasy_content;

      cb(draft);
    });
};
