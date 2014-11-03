/* gameKey can be game_key or league (ie/ nfl, mlb) */
exports.meta = function(gameKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/metadata?format=json')
    .then(function(data) {
      var meta = data.fantasy_content;

      cb(meta);
    });
};

/* league key can be an array of keys */
exports.leagues = function(gameKey, leagueKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/leagues;league_keys=' + leagueKey.join(',') + '?format=json')
    .then(function(data) {
      var leagues = data.fantasy_content;

      cb(leagues);
    });
};

exports.players = function(gameKey, playerKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/players;player_keys=' + playerKey.join(',') + '?format=json')
    .then(function(data) {
      var players = data.fantasy_content;

      cb(players);
    });
};

exports.weeks = function(gameKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/game_weeks?format=json')
    .then(function(data) {
      var weeks = data.fantasy_content;

      cb(weeks);
    });
};

exports.stat_categories = function(gameKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/stat_categories?format=json')
    .then(function(data) {
      var stat_categories = data.fantasy_content;

      cb(stat_categories);
    });
};

exports.position_types = function(gameKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/position_types?format=json')
    .then(function(data) {
      var position_types = data.fantasy_content;

      cb(position_types);
    });
};

exports.roster_positions = function(gameKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/game/' + gameKey + '/roster_positions?format=json')
    .then(function(data) {
      var roster_positions = data.fantasy_content;

      cb(roster_positions);
    });
};
