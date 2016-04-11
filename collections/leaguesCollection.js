var _ = require('lodash');
var leagueHelper = require('../helpers/leagueHelper.js');

module.exports = function() {
  return new LeaguesCollection();
};

function LeaguesCollection() {
  return this;
};

// totally making "fetch" happen...
LeaguesCollection.prototype.fetch = function() {
  var leagueKeys = arguments[0],
    subresources = ( arguments.length > 2 ) ? arguments[1] : [],
    cb = arguments[arguments.length - 1];

  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=';

  if ( _.isString(leagueKeys) ) {
    leagueKeys = [leagueKeys];
  }

  url += leagueKeys.join(',');

  if ( _.isString(subresources) ) {
    subresources = [subresources];
  }

  if ( subresources.length > 0 ) {
    url += ';out=' + subresources.join(',');
  }

  url += '?format=json';

  this
    .api(url)
    .then(function(data) {
      var leagues = leagueHelper.parseCollection(data.fantasy_content.leagues, subresources);

      cb(null, leagues);
    }, function(e) {
      cb(e, null);
    });
};
