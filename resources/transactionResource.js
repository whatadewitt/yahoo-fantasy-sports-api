var transactionHelper = require('../helpers/transactionHelper.js');

exports.meta = function(transactionKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/transaction/' + transactionKey + '/players?format=json')
    .then(function(data) {
      var transaction = data.fantasy_content.transaction;

      var meta = transaction[0];
      var players = transactionHelper.mapTransactionPlayers(transaction[1].players);

      meta.players = players;

      cb(meta);
    }, function(data) {
      cb(data);
    });
};

exports.players = function(transactionKey, cb) {
  // same as meta?? just with the players...
  this.transaction.meta(transactionKey, cb);
};

