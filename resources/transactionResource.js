var transactionHelper = require('../helpers/transactionHelper.js');

module.exports = TransactionResource;

function TransactionResource(yf) {
  this.yf = yf;
}

TransactionResource.prototype.meta = function(transactionKey, cb) {
  this
    .yf
    .api('http://fantasysports.yahooapis.com/fantasy/v2/transaction/' + transactionKey + '/players?format=json')
    .then(function(data) {
      var transaction = data.fantasy_content.transaction;

      var meta = transaction[0];
      var players = transactionHelper.mapTransactionPlayers(transaction[1].players);

      meta.players = players;

      cb(null, meta);
    }, function(e) {
      cb(e, null);
    });
};

TransactionResource.prototype.players = function(transactionKey, cb) {
  // same as meta?? just with the players... which we want...
  this.meta(transactionKey, cb);
};

