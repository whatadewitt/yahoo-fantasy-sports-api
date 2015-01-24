var _ = require('lodash');
var gameHelper = require('../helpers/gameHelper.js');

module.exports = function() {
  return new GamesCollection();
};

function GamesCollection() {
  return this;
};

// params: game keys, subresources (optional), filters (optional), callback
GamesCollection.prototype.fetch = function() {
  var gameKeys = '', //arguments[0],
    subresources = '',
    filters = {},
    cb = arguments[arguments.length - 1];

  if ( _.isObject(arguments[0]) ) {
    // filters
    filters = arguments[0];
  } else {
    // game key(s)
    gameKeys = arguments[0];
  }

  subresources = arguments[1];

  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/games';

  if ( _.isString(gameKeys)  && !_.isEmpty(gameKeys) ) {
    gameKeys = [gameKeys];
  }

  if ( !(_.isEmpty(gameKeys)) ) {
    url += ';game_keys=' + gameKeys.join(',');
  }

  if ( !( _.isEmpty(filters) )  ) {
    _.each(Object.keys(filters), function(key) {
      url += ';' + key + '=' + filters[key];
    });
  }

  if ( _.isString(subresources) && !_.isEmpty(subresources) ) {
    subresources = [subresources];
  }

  if ( !(_.isEmpty(subresources)) ) {
    url += ';out=' + subresources.join(',');
  }

  url += '?format=json';

  this
    .api(url)
    .then(function(data) {
      var games = gameHelper.parseCollection(data.fantasy_content.games, subresources);

      cb(games);
    });
};

GamesCollection.prototype.user = function(filters, cb) {
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

GamesCollection.prototype.userFetch = function(filters, cb) {
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
