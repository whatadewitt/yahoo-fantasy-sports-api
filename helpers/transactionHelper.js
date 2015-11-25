var _ = require('lodash');
var playerHelper = require('../helpers/playerHelper.js');

exports.mapTransactionPlayers = function(players) {
  players = _.filter(players, function(p) { return typeof(p) === 'object'; });
  players = _.map(players, function(p) { return p.player; });
  players = _.map(players, function(p) {
    var player = playerHelper.transactionPlayerMap(p[0]);
    player.transaction_data = p[1].transaction_data[0];
    return player;
  });

  return players;
};
