exports.games = function(cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games?format=json')
    .then(function(data) {
      var meta = data.fantasy_content;

      cb(meta);
    });
}

exports.leagues = function(gameKeys, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=' + gameKeys.split(',') + ' /leagues')
    .then(function(data) {
      var meta = data.fantasy_content;

      cb(meta);
    });
}

exports.teams = function(gameKeys, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=' + gameKeys.split(',') + '/teams')
    .then(function(data) {
      var meta = data.fantasy_content;

      cb(meta);
    });
}
