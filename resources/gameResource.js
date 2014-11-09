var gameHelper = require('../helpers/gameHelper.js');

/* gameKey can be game_key or league (ie/ nfl, mlb) */
exports.meta = function(gameKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/metadata?format=json')
    .then(function(data) {
      var meta = data.game[0];

      cb(meta);
    });
};

/* league key can be an array of keys */
exports.leagues = function(gameKey, leagueKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/leagues;league_keys=' + leagueKey.join(',') + '?format=json')
    .then(function(data) {
      var leagues = gameHelper.leaguesMap(data.game[1].leagues);
      var game = data.game[0];

      game.leagues = leagues;

      cb(game);
    });
};

exports.players = function(gameKey, playerKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/players;player_keys=' + playerKey.join(',') + '?format=json')
    .then(function(data) {
      var players = gameHelper.playersMap(data.game[1].players);
      var game = data.game[0];

      game.players = players;

      cb(game);
    });
};

exports.weeks = function(gameKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/game_weeks?format=json')
    .then(function(data) {
      var weeks = gameHelper.weeksMap(data.game[1].game_weeks);
      var game = data.game[0];

      game.weeks = weeks;

      cb(game);
    });
};

exports.stat_categories = function(gameKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/stat_categories?format=json')
    .then(function(data) {
      var stat_categories = gameHelper.statCategoriesMap(data.game[1].stat_categories.stats);
      var game = data.game[0];

      game.stat_categories = stat_categories;

      cb(game);
    });
};

exports.position_types = function(gameKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/position_types?format=json')
    .then(function(data) {
      var position_types = gameHelper.positionTypesMap(data.game[1].position_types);
      var game = data.game[0];

      game.position_types = position_types;

      cb(game);
    });
};

exports.roster_positions = function(gameKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/roster_positions?format=json')
    .then(function(data) {
      var roster_positions = gameHelper.rosterPositionsMap(data.game[1].roster_positions);
      var game = data.game[0];

      game.roster_positions = roster_positions;

      cb(game);
    });
};
