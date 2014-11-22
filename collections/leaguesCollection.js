var _ = require('lodash');

module.exports = function() {
  return new LeaguesCollection();
};

function LeaguesCollection() {
  return this;
};

LeaguesCollection.prototype.fetch = function(leagueKeys, resources, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/leagues/;league_keys=';

  if ( _.isString(leagueKeys) ) {
    leagueKeys = [leagueKeys];
  }

  url += leagueKeys.split(',');

  if ( _.isString(resources) ) {
    resources = [resources];
  }

  if ( resources.length > 0 ) {
    url += ';out=' + resources.split(',');
  }

  url += '?format=json'

  this
    .api(url)
    .then(function(data) {
      var meta = data.fantasy_content;

      cb(meta);
    });
};
