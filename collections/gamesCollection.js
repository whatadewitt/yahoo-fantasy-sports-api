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
  var gameKeys = arguments[0],
    subresources = '',
    filters = {},
    cb = arguments[arguments.length - 1];

  switch ( arguments.length ) {
    case 3 :
      if ( _.isArray(arguments[1]) ) {
        // subresources are the param
        subresources = arguments[1];
      } else if ( _.isObject(arguments[1]) ) {
        filters = arguments[1];
      }
      break;

    case 4 :
      subresources = arguments[1];
      filters = arguments[2];

      break;

    default:
    // todo: throw error
      break;
  }

  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/games;game_keys=';

  if ( _.isString(gameKeys) ) {
    gameKeys = [gameKeys];
  }

  url += gameKeys.join(',');

  if ( _.isString(subresources) ) {
    subresources = [subresources];
  }

  url += ';out=' + subresources.join(',');

  if ( !( _.isEmpty(filters) )  ) {
    _.each(Object.keys(filters), function(key) {
      url += ';' + key + '=' + filters[key];
    });
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
