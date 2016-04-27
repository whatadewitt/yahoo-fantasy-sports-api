var transactionHelper = require('../helpers/transactionHelper.js');

module.exports = TransactionResource;

function TransactionResource(yf) {
  this.yf = yf;
}

TransactionResource.prototype.meta = function(transactionKey, cb) {
  var apiCallback = this._meta_callback.bind(this, cb);
  
  this
    .yf
    .api(
      'http://fantasysports.yahooapis.com/fantasy/v2/transaction/' + transactionKey + '/players?format=json',
      apiCallback
    );
};

TransactionResource.prototype._meta_callback = function(cb, e, data) {
  if ( e ) return cb(e);
  
  var transaction = data.fantasy_content.transaction;
  var meta = transaction[0];
  var players = transactionHelper.mapTransactionPlayers(transaction[1].players);
  meta.players = players;

  return cb(null, meta);
};

TransactionResource.prototype.players = function(transactionKey, cb) {
  // same as meta?? just with the players... which we want...
  this.meta(transactionKey, cb);
};

