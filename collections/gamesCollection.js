var _ = require('lodash');

exports.fetch = function(gameKeys, filters, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/games;game_keys=';

  if ( _.isString(gameKeys) ) {
    gameKeys = [gameKeys];
  }

  url += gameKeys.join(',');

  if ( !( _.isEmpty(filters) )  ) {
    _.each(Object.keys(filters), function(key) {
      url += ';' + key + '=' + filters[key];
    });
  }

  url += '?format=json';

  this
    .api(url)
    .then(function(data) {
      var meta = data.fantasy_content;

      cb(meta);
    });
};

exports.user = function(filters, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games';

  if ( !( _.isEmpty(filters) )  ) {
    _.each(Object.keys(filters), function(key) {
      url += ';' + key + '=' + filters[key];
    });
  }

  url += '?format=json';

  this
    .api(url)
    .then(function(data) {
      var meta = data.fantasy_content;

      cb(meta);
    });
};

exports.userFetch = function(filters, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=';

  if ( _.isString(gameKeys) ) {
    gameKeys = [gameKeys];
  }

  url += gameKeys.join(',');

  if ( !( _.isEmpty(filters) )  ) {
    _.each(Object.keys(filters), function(key) {
      url += ';' + key + '=' + filters[key];
    });
  }

  url += '?format=json';

  this
    .api(url)
    .then(function(data) {
      var meta = data.fantasy_content;

      cb(meta);
    });
};
