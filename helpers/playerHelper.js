var _ = require('lodash');

exports.mapPlayer = function(player) {
  return {
    player_key: player[0].player_key,
    player_id: player[1].player_id,
    name: player[2].name,
    editorial_player_key: player[3].editorial_player_key,
    editorial_team_key: player[4].editorial_team_key,
    editorial_team_full_name: player[5].editorial_team_full_name,
  }
};
