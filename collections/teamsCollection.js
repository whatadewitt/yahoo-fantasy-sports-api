var _ = require('lodash');
var teamHelper = require('../helpers/teamHelper.js');

module.exports = TeamsCollection;

function TeamsCollection(yf) {
  this.yf = yf;
}

TeamsCollection.prototype.fetch = function() {
  var teamKeys = arguments[0],
    subresources = ( arguments.length > 2 ) ? arguments[1] : [],
    cb = arguments[arguments.length - 1];

  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/teams;team_keys=';

  if ( _.isString(teamKeys) ) {
    teamKeys = teamKeys.split(',');
  }

  url += teamKeys.join(',');

  if ( !( _.isEmpty(subresources) )  ) {
    if ( _.isString(subresources) ) {
      subresources = [subresources];
    }

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

TeamsCollection.prototype._fetch_callback = function(cb, subresources, e, data) {
  if ( e ) return cb(e);
  
  var teams = teamHelper.parseCollection(data.fantasy_content.teams, subresources);
  return cb(null, teams);
};

TeamsCollection.prototype.leagues = function() {
  var leagueKeys = arguments[0],
    subresources = ( arguments.length > 2 ) ? arguments[1] : [],
    cb = arguments[arguments.length - 1];

  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=';

  if ( _.isString(leagueKeys) ) {
    leagueKeys = [leagueKeys];
  }

  url += leagueKeys.join(',');
  url += '/teams';

  if ( !( _.isEmpty(subresources) )  ) {
    if ( _.isString(subresources) ) {
      subresources = [subresources];
    }

    url += ';out=' + subresources.join(',');
  }

  url += '?format=json';

  var apiCallback = this._leagues_callback.bind(this, cb, subresources);

  this
    .yf
    .api(
      this.yf.GET,
      url,
      apiCallback
    );
};

TeamsCollection.prototype._leagues_callback = function(cb, subresources, e, data) {
  if ( e ) return cb(e);
  
  var leagues = teamHelper.parseLeagueCollection(data.fantasy_content.leagues, subresources);
  return cb(null, leagues);
};

TeamsCollection.prototype.userFetch = function() {
  var subresources = ( arguments.length > 1 ) ? arguments[1] : [],
    cb = arguments[arguments.length - 1];

  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/teams';

  if ( !( _.isEmpty(subresources) )  ) {
    if ( _.isString(subresources) ) {
      subresources = [subresources];
    }

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

TeamsCollection.prototype._userFetch_callback = function(cb, subresources, e, data) {
  if ( e ) return cb(e);
  
  var games = teamHelper.parseGameCollection(data.fantasy_content.users[0].user[1].games, subresources);
  return cb(null, games);
};

TeamsCollection.prototype.games = function() {
  var gameKeys = arguments[0],
    subresources = ( arguments.length > 2 ) ? arguments[1] : [],
    cb = arguments[arguments.length - 1];

  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=';

  if ( _.isString(gameKeys) ) {
    gameKeys = [gameKeys];
  }

  url += gameKeys.join(',');
  url += '/teams';

  if ( !( _.isEmpty(subresources) )  ) {
    if ( _.isString(subresources) ) {
      subresources = [subresources];
    }

    url += ';out=' + subresources.join(',');
  }

  url += '?format=json';

  var apiCallback = this._games_callback.bind(this, cb, subresources);

  this
    .yf
    .api(
      this.yf.GET,
      url,
      apiCallback
    );
};

TeamsCollection.prototype._games_callback = function(cb, subresources, e, data) {
  if ( e ) return cb(e);
  
  var games = teamHelper.parseGameCollection(data.fantasy_content.users[0].user[1].games, subresources);
  return cb(null, games);
};
