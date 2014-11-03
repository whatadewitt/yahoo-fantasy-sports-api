var util = require('util');

exports.fetch = function(resources, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1';

  if ( util.isArray(resources) ) {
    url += ';out=' + resources.split(,);
  } else if ( 'string' == typeof(resources) ) {
    url += ';out=' + resources
  }

  url += '?format=json'

  this
    .api(url)
    .then(function(data) {
      var meta = data.fantasy_content;

      cb(meta);
    });
};
