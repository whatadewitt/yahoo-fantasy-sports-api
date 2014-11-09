var _ = require('lodash');

exports.mapPlayer = function(player) {
  return {
    player_key: player[0].player_key,
    player_id: player[1].player_id,
    name: player[2].name,
    editorial_player_key: player[3].editorial_player_key,
    editorial_team_key: player[4].editorial_team_key,
    editorial_team_full_name: player[5].editorial_team_full_name,
    editorial_team_abbr: player[6].editorial_team_abbr,
    uniform_number: player[7].uniform_number,
    display_position: player[8].display_position,
    headshot: player[9].headshot.url,
    is_undroppable: player[10].is_undroppable,
    position_type: player[11].position_type,
    eligible_positions: _.map(player[12].eligible_positions, function(p) { return p.position; })
  };
};

exports.mapStats = function(stats) {
  var coverage_type = stats[0].coverage_type;
  return {
    coverage_type: coverage_type,
    coverage_value: stats[0][coverage_type],
    stats: _.map(stats.stats, function(s) { return s.stat; })
  };
};

exports.mapDraftAnalysis = function(da) {
  return {
    average_pick: da[0].average_pick,
    average_round: da[1].average_round,
    average_cost: da[2].average_cost,
    percent_drafted: da[3].percent_drafted
  }
}
