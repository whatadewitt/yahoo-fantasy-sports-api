exports.meta = function(transactionKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/transaction/' + transactionKey + '/metadata?format=json')
    .then(function(data) {
      var meta = data.fantasy_content;

      cb(meta);
    });
};

exports.players = function(transactionKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/transaction/' + transactionKey + '/players?format=json')
    .then(function(data) {
      var players = data.fantasy_content;

      cb(players);
    });
};

