var _ = require('lodash');
var userHelper = require('../helpers/userHelper.js');

import { extractCallback } from "../helpers/argsParser.mjs";

module.exports = UsersCollection;

function UsersCollection(yf) {
  this.yf = yf;
}

// this doesn't seem super useful...
UsersCollection.prototype.fetch = function() {
  var subresources = ( arguments.length > 1 ) ? arguments[0] : [];
  const cb = extractCallback(args);

  var url = 'https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1';

  if ( !( _.isEmpty(subresources) )  ) {
    if ( _.isString(subresources) ) {
      subresources = [subresources];
    }

    url += ';out=' + subresources.join(',');
  }

  url += '?format=json';

  return this.yf.api(this.yf.GET, url)
    .then(data => {
      const user = userHelper.parseCollection(data.fantasy_content.users[0].user);
      cb(null, user);
      return user;
    })
    .catch(e => {
      cb(e);
      throw e;
    });
};