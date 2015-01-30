var _ = require('lodash');
var playerHelper = require('../helpers/playerHelper.js');

module.exports = function() {
  return new PlayersCollection();
};

function PlayersCollection() {
  return this;
};

PlayersCollection.prototype.fetch = function() {
  var playerKeys = arguments[0],
    subresources = ( arguments.length > 2 ) ? arguments[1] : [],
    cb = arguments[arguments.length - 1];

  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/players;player_keys='

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

  url += '?format=json'

  this
  .api(url)
  .then(function(data) {
    var players = playerHelper.parseCollection(data.fantasy_content.players, subresources);

    cb(players);
  });
};

// ignoring the single b/c filters
PlayersCollection.prototype.leagues = function() {
  console.log(arguments);
  var playerKeys = arguments[0],
    filters = {},
    subresources = ( arguments.length > 2 ) ? arguments[1] : [],
    cb = arguments[arguments.length - 1];

  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys='

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

  this
  .api(url)
  .then(function(data) {
    var meta = data.fantasy_content;

    cb(meta);
  });
};

PlayersCollection.prototype.team = function(teamKeys, resources, filters, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/teams;team_keys='

  if ( _.isString(teamKeys) ) {
    teamKeys = [teamKeys];
  }

  url += teamKeys.join(',');
  url += '/players';

  if ( !( _.isEmpty(resources) )  ) {
    if ( _.isString(resources) ) {
      resources = [resources];
    }

    url += ';out=' + resources.join(',');
  }

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
