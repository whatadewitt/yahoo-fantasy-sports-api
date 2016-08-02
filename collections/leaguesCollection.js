var _ = require('lodash');
var leagueHelper = require('../helpers/leagueHelper.js');

module.exports = LeaguesCollection;

function LeaguesCollection(yf) {
  this.yf = yf;
}

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

  var apiCallback = this._fetch_callback.bind(this, cb, subresources);

  this
    .yf
    .api(
      this.yf.GET,
      url,
      apiCallback
    );
};

LeaguesCollection.prototype._fetch_callback = function(cb, subresources, e, data) {
  if ( e ) return cb(e);
  
  var leagues = leagueHelper.parseCollection(data.fantasy_content.leagues, subresources);
  return cb(null, leagues);
};