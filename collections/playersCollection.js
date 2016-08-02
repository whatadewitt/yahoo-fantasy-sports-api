var _ = require('lodash');
var playerHelper = require('../helpers/playerHelper.js');

module.exports = PlayersCollection;

function PlayersCollection(yf) {
  this.yf = yf;
}

PlayersCollection.prototype.fetch = function() {
  var playerKeys = arguments[0],
    subresources = ( arguments.length > 2 ) ? arguments[1] : [],
    cb = arguments[arguments.length - 1];

  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/players;player_keys=';

  if ( _.isString(playerKeys) ) {
    playerKeys = [playerKeys];
  }

  url += playerKeys.join(',');

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

PlayersCollection.prototype._fetch_callback = function(cb, subresources, e, data) {
  if ( e ) return cb(e);

  var players = playerHelper.parseCollection(data.fantasy_content.players, subresources);
  return cb(null, players);
};

// ignoring the single b/c filters
PlayersCollection.prototype.leagues = function() {
  var leagueKeys = arguments[0],
    filters = ( arguments.length > 3 ) ? arguments[1] : ( arguments.length > 2 && _.isObject( arguments[1]) ) ? arguments[1] : {},
    subresources = ( arguments.length > 3 ) ? arguments[2] : ( arguments.length > 2 && _.isArray( arguments[1]) ) ? arguments[1] : [], // ugliest line of code ever?
    cb = arguments[arguments.length - 1];

  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=';

  if ( _.isString(leagueKeys) ) {
    leagueKeys = [leagueKeys];
  }

  url += leagueKeys.join(',');
  url += '/players';

  if ( !( _.isEmpty(subresources) )  ) {
    if ( _.isString(subresources) ) {
      subresources = [subresources];
    }

    url += ';out=' + subresources.join(',');
  }

  if ( !( _.isEmpty(filters) )  ) {
    _.each(Object.keys(filters), function(key) {
      url += ';' + key + '=' + filters[key];
    });
  }

  url += '?format=json';

  apiCallback = this._leagues_callback.bind(this, cb, subresources);

  this
    .yf
    .api(
      this.yf.GET,
      url,
      apiCallback
    );
};

PlayersCollection.prototype._leagues_callback = function(cb, subresources, e, data) {
  if ( e ) return cb(e);
  
  var leagues = playerHelper.parseLeagueCollection(data.fantasy_content.leagues, subresources);
  return cb(null, leagues);
};

PlayersCollection.prototype.teams = function() {
  var teamKeys = arguments[0],
    filters = ( arguments.length > 3 ) ? arguments[1] : ( arguments.length > 2 && _.isObject( arguments[1]) ) ? arguments[1] : {},
    subresources = ( arguments.length > 3 ) ? arguments[2] : ( arguments.length > 2 && _.isArray( arguments[1]) ) ? arguments[1] : [], // ugliest line of code ever?
    cb = arguments[arguments.length - 1];

  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/teams;team_keys=';

  if ( _.isString(teamKeys) ) {
    teamKeys = [teamKeys];
  }

  url += teamKeys.join(',');
  url += '/players';

  if ( !( _.isEmpty(subresources) )  ) {
    if ( _.isString(subresources) ) {
      subresources = [subresources];
    }

    url += ';out=' + subresources.join(',');
  }

  if ( !( _.isEmpty(filters) )  ) {
    _.each(Object.keys(filters), function(key) {
      url += ';' + key + '=' + filters[key];
    });
  }

  url += '?format=json';

  var apiCallback = this._teams_callback.bind(this, cb, subresources);

  this
    .yf
    .api(
      this.yf.GET,
      url,
      apiCallback
    );
};

PlayersCollection.prototype._teams_callback = function(cb, subresources, e, data) {
  if ( e ) return cb(e);
  
  var teams = playerHelper.parseTeamCollection(data.fantasy_content.teams, subresources);
  return cb(null, teams);
};
