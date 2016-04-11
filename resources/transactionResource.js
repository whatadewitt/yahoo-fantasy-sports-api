var transactionHelper = require('../helpers/transactionHelper.js');

module.exports = function() {
  return new TransactionResource();
};

function TransactionResource() {
  return this;
};

TransactionResource.prototype.meta = function(transactionKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/transaction/' + transactionKey + '/players?format=json')
    .then(function(data) {
      var transaction = data.fantasy_content.transaction;

      var meta = transaction[0];
      var players = transactionHelper.mapTransactionPlayers(transaction[1].players);

      meta.players = players;

      cb(null, meta);
    }, function(e) {
      // self.err(e, cb);
      cb(e, null);
    });
};

TransactionResource.prototype.players = function(transactionKey, cb) {
  // same as meta?? just with the players... which we want...
  this.transaction.meta(transactionKey, cb);
};

