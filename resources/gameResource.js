var _ = require('lodash');
var gameHelper = require('../helpers/gameHelper.js');

module.exports = function() {
  return new GameResource();
};

function GameResource() {
  return this;
};

/* gameKey can be game_key or league (ie/ nfl, mlb) */
GameResource.prototype.meta = function(gameKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/metadata?format=json')
    .then(function(data) {
      var meta = data.fantasy_content.game[0];

      cb(null, meta);
    }, function(e) {
      // self.err(e, cb);
      cb(e, null);
    });
};

/* league key can be an array of keys */
GameResource.prototype.leagues = function(gameKey, leagueKey, cb) {
  var self = this;

  if ( _.isString(leagueKey) ) {
    leagueKey = [leagueKey];
  }

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/leagues;league_keys=' + leagueKey.join(',') + '?format=json')
    .then(function(data) {
      var leagues = gameHelper.mapLeagues(data.fantasy_content.game[1].leagues);
      var game = data.fantasy_content.game[0];

      game.leagues = leagues;

      cb(null, game);
    }, function(e) {
      // self.err(e, cb);
      cb(e, null);
    });
};

GameResource.prototype.players = function(gameKey, playerKey, cb) {
  var self = this;

  if ( _.isString(playerKey) ) {
    playerKey = [playerKey];
  }

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/players;player_keys=' + playerKey.join(',') + '?format=json')
    .then(function(data) {
      var players = gameHelper.mapPlayers(data.fantasy_content.game[1].players);
      var game = data.fantasy_content.game[0];

      game.players = players;

      cb(null, game);
    }, function(e) {
      // self.err(e, cb);
      cb(e, null);
    });
};

GameResource.prototype.game_weeks = function(gameKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/game_weeks?format=json')
    .then(function(data) {
      var weeks = gameHelper.mapWeeks(data.fantasy_content.game[1].game_weeks);
      var game = data.fantasy_content.game[0];

      game.weeks = weeks;

      cb(null, game);
    }, function(e) {
      // self.err(e, cb);
      cb(e, null);
    });
};

GameResource.prototype.stat_categories = function(gameKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/stat_categories?format=json')
    .then(function(data) {
      var stat_categories = gameHelper.mapStatCategories(data.fantasy_content.game[1].stat_categories.stats);
      var game = data.fantasy_content.game[0];

      game.stat_categories = stat_categories;

      cb(null, game);
    }, function(e) {
      // self.err(e, cb);
      cb(e, null);
    });
};

GameResource.prototype.position_types = function(gameKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/position_types?format=json')
    .then(function(data) {
      var position_types = gameHelper.mapPositionTypes(data.fantasy_content.game[1].position_types);
      var game = data.fantasy_content.game[0];

      game.position_types = position_types;

      cb(null, game);
    }, function(e) {
      // self.err(e, cb);
      cb(e, null);
    });
};

GameResource.prototype.roster_positions = function(gameKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/roster_positions?format=json')
    .then(function(data) {
      var roster_positions = gameHelper.mapRosterPositions(data.fantasy_content.game[1].roster_positions);
      var game = data.fantasy_content.game[0];

      game.roster_positions = roster_positions;

      cb(null, game);
    }, function(e) {
      // self.err(e, cb);
      cb(e, null);
    });
};
