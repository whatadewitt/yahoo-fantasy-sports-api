var _ = require('lodash');
var gameHelper = require('../helpers/gameHelper.js');

module.exports = GamesCollection;

function GamesCollection(yf) {
  this.yf = yf;
}

// params: game keys or filters, subresources (optional), callback
GamesCollection.prototype.fetch = function() {
  var gameKeys = '',
    subresources = [],
    filters = {},
    cb = arguments[arguments.length - 1];

  // there should be a better way...
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

  var apiCallback = this._fetch_callback.bind(this, cb, subresources);

  this
    .yf
    .api(
      this.yf.GET,
      url,
      apiCallback
    );
};

GamesCollection.prototype._fetch_callback = function(cb, subresources, e, data) {
  if ( e ) return cb(e);
  
  var games = gameHelper.parseCollection(data.fantasy_content.games, subresources);
  return cb(null, games);
};

GamesCollection.prototype.user = function() {
  // no gamekeys...
  var subresources = [],
    filters = {},
    cb = arguments[arguments.length - 1];

  switch (arguments.length) {
    case 2:
      if ( _.isObject(arguments[0]) ) {
        filters = arguments[0];
      } else {
        subresources = arguments[0];
      }

      break;

    case 3:
      filters = arguments[0];
      subresources = arguments[1];
      break;

    default:
      break;
  }

  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games';

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

  var apiCallback = this._user_callback.bind(this, cb, subresources);

  this
    .yf
    .api(
      this.yf.GET,
      url,
      apiCallback
    );
};

GamesCollection.prototype._user_callback = function(cb, subresources, e, data) {
  if ( e ) return cb(e);
  
  var games = gameHelper.parseCollection(data.fantasy_content.users[0].user[1].games, subresources);
  return cb(null, games);
};

GamesCollection.prototype.userFetch = function() {
  // no filters...
  var gameKeys = arguments[0],
    subresources = ( arguments.length > 2 ) ? arguments[1] : [],
    cb = arguments[arguments.length - 1];

  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=';

  if ( _.isString(gameKeys) ) {
    gameKeys = [gameKeys];
  }

  url += gameKeys.join(',');

  if ( !(_.isEmpty(subresources)) ) {
    url += ';out=' + subresources.join(',');
  }

  url += '?format=json';

  var apiCallback = this._userFetch_callback.bind(this, cb, subresources);

  this
    .yf
    .api(
      this.yf.GET,
      url,
      apiCallback
    );
};

GamesCollection.prototype._userFetch_callback = function(cb, subresources, e, data) {
  if ( e ) return cb(e);
  
  var user = data.fantasy_content.users[0].user[0];
  var games = gameHelper.parseCollection(data.fantasy_content.users[0].user[1].games, subresources);
  user.games = games;

  return cb(null, user);
};