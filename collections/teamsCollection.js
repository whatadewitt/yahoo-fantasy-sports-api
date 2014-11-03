var _ = require('lodash');

exports.fetch = function(teamKeys, resources, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/teams;team_keys=';

  if ( _.isString(teamKeys) ) {
    teamKeys = [teamKeys]
  }

  url += teamKeys.join(',');

  if ( !( _.isEmpty(resources) )  ) {
    if ( _.isString(resources) ) {
      resources = [resources];
    }

    url += ';out=' + resources.join(',');
  }

  url += '?format=json'

  this
  .api(url)
  .then(function(data) {
    var meta = data.fantasy_content;

    cb(meta);
  });
};

exports.leagueFetch = function(leagueKeys, resources, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=';

  if ( _.isString(leagueKeys) ) {
    leagueKeys = [leagueKeys];
  }

  url += leagueKeys.join(',');
  url += '/teams';

  if ( !( _.isEmpty(resources) )  ) {
    if ( _.isString(resources) ) {
      resources = [resources];
    }

    url += ';out=' + resources.join(',');
  }

  url += '?format=json'

  this
  .api(url)
  .then(function(data) {
    var meta = data.fantasy_content;

    cb(meta);
  });
};

exports.usersFetch = function(resources, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/teams';

  if ( !( _.isEmpty(resources) )  ) {
    if ( _.isString(resources) ) {
      resources = [resources];
    }

    url += ';out=' + resources.join(',');
  }

  url += '?format=json'

  this
  .api(url)
  .then(function(data) {
    var meta = data.fantasy_content;

    cb(meta);
  });
};

exports.gameFetch = function(gameKeys, resources, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=';

  if ( _.isString(gameKeys) ) {
    gameKeys = [gameKeys];
  }

  url += gameKeys.join(',');
  url += '/teams';

  if ( !( _.isEmpty(resources) )  ) {
    if ( _.isString(resources) ) {
      resources = [resources];
    }

    url += ';out=' + resources.join(',');
  }

  url += '?format=json'

  this
  .api(url)
  .then(function(data) {
    var meta = data.fantasy_content;

    cb(meta);
  });
};


