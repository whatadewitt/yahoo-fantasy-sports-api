var _ = require('lodash');
var userHelper = require('../helpers/userHelper.js');

module.exports = UsersCollection;

function UsersCollection(yf) {
  this.yf = yf;
}

// this doesn't seem super useful...
UsersCollection.prototype.fetch = function() {
  var subresources = ( arguments.length > 1 ) ? arguments[0] : [],
    cb = arguments[arguments.length - 1],
    apiCallback = this._fetch_callback.bind(this, cb);

  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1';

  if ( !( _.isEmpty(subresources) )  ) {
    if ( _.isString(subresources) ) {
      subresources = [subresources];
    }

    url += ';out=' + subresources.join(',');
  }

  url += '?format=json';

  this
    .yf
    .api(
      this.yf.GET,
      url,
      apiCallback
    );
};

UsersCollection.prototype._fetch_callback = function(cb, e, data) {
  if ( e ) return cb(e);
  
  var user = userHelper.parseCollection(data.fantasy_content.users[0].user);
  return cb(user);
};