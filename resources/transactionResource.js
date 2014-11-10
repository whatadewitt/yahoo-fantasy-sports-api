var _ = require('lodash');
var playerHelper = require('../helpers/playerHelper.js');

exports.meta = function(transactionKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/transaction/' + transactionKey + '/metadata?format=json')
    .then(function(data) {
      var transaction = data.fantasy_content.transaction;

      var meta = transaction[0];
      var players = transaction[1].players;

      // clean up this map
      players = _.filter(players, function(p) { return typeof(p) == 'object'; });
      players = _.map(players, function(p) { return p.player; });
      players = _.map(players, function(p) {
        var player = playerHelper.transactionPlayerMap(p[0]);
        player.transaction_data = p[1].transaction_data[0];
        return player;
      })

      meta.players = players;

      cb(meta);
    });
};

exports.players = function(transactionKey, cb) {
  // same as meta??
  this.transaction.meta(transactionKey, cb);
};

