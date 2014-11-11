var transactionHelper = require('./transactionHelper.js');

exports.meta = function(transactionKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/transaction/' + transactionKey + '/metadata?format=json')
    .then(function(data) {
      var transaction = data.fantasy_content.transaction;

      var meta = transaction[0];
      var players = transactionHelper.mapTransactionPlayers(transaction[1].players);

      meta.players = players;

      cb(meta);
    });
};

exports.players = function(transactionKey, cb) {
  // same as meta??
  this.transaction.meta(transactionKey, cb);
};

