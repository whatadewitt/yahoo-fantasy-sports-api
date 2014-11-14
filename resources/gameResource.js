var _ = require('lodash');
var gameHelper = require('../helpers/gameHelper.js');

/* gameKey can be game_key or league (ie/ nfl, mlb) */
exports.meta = function(gameKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/metadata?format=json')
    .then(function(data) {
      var meta = data.fantasy_content.game[0];

      cb(meta);
    }, function(e) {
      self.err(e, cb);
    });
};

/* league key can be an array of keys */
exports.leagues = function(gameKey, leagueKey, cb) {
  var self = this;

  if ( _.isString(leagueKey) ) {
    leagueKey = [leagueKey];
  }

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/leagues;league_keys=' + leagueKey.join(',') + '?format=json')
    .then(function(data) {
      var leagues = gameHelper.leaguesMap(data.fantasy_content.game[1].leagues);
      var game = data.fantasy_content.game[0];

      game.leagues = leagues;

      cb(game);
    }, function(e) {
      self.err(e, cb);
    });
};

exports.players = function(gameKey, playerKey, cb) {
  var self = this;

  if ( _.isString(playerKey) ) {
    playerKey = [playerKey];
  }

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/players;player_keys=' + playerKey.join(',') + '?format=json')
    .then(function(data) {
      var players = gameHelper.playersMap(data.fantasy_content.game[1].players);
      var game = data.fantasy_content.game[0];

      game.players = players;

      cb(game);
    }, function(e) {
      self.err(e, cb);
    });
};

exports.game_weeks = function(gameKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/game_weeks?format=json')
    .then(function(data) {
      var weeks = gameHelper.weeksMap(data.fantasy_content.game[1].game_weeks);
      var game = data.fantasy_content.game[0];

      game.weeks = weeks;

      cb(game);
    }, function(e) {
      self.err(e, cb);
    });
};

exports.stat_categories = function(gameKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/stat_categories?format=json')
    .then(function(data) {
      var stat_categories = gameHelper.statCategoriesMap(data.fantasy_content.game[1].stat_categories.stats);
      var game = data.fantasy_content.game[0];

      game.stat_categories = stat_categories;

      cb(game);
    }, function(e) {
      self.err(e, cb);
    });
};

exports.position_types = function(gameKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/position_types?format=json')
    .then(function(data) {
      var position_types = gameHelper.positionTypesMap(data.game[1].position_types);
      var game = data.game[0];

      game.position_types = position_types;

      cb(game);
    }, function(e) {
      self.err(e, cb);
    });
};

exports.roster_positions = function(gameKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/roster_positions?format=json')
    .then(function(data) {
      var roster_positions = gameHelper.rosterPositionsMap(data.game[1].roster_positions);
      var game = data.game[0];

      game.roster_positions = roster_positions;

      cb(game);
    }, function(e) {
      self.err(e, cb);
    });
};
