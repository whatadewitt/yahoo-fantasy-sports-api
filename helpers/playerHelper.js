var _ = require('lodash');

exports.mapPlayer = function(player) {
  // why this is necessary i will never understand
  var offset = 0;
  if ( 15 < player.length ) {
    offset = 1;
  }

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
    headshot: player[9 + offset].headshot.url,
    is_undroppable: player[10 + offset].is_undroppable,
    position_type: player[11 + offset].position_type,
    eligible_positions: _.map(player[12 + offset].eligible_positions, function(p) { return p.position; })
  };
};

exports.transactionPlayerMap = function(player) {
  return {
    player_key: player[0].player_key,
    player_id: player[1].player_id,
    name: player[2].name,
    editorial_team_abbr: player[3].editorial_team_abbr,
    display_position: player[4].display_position,
    position_type: player[5].position_type
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
};

exports.parseCollection = function(players, subresources) {
  var self = this;

  players = _.filter(players, function(p) { return typeof(p) == 'object'; });
  players = _.map(players, function(p) { return p.player; });
  players = _.map(players, function(p) {
    var player = self.mapPlayer(p[0]);

    _.forEach(subresources, function(resource, idx) {
      switch (resource) {
        case 'stats':
          player.stats = self.mapStats(p[idx + 1].player_stats);
          break;

        case 'percent_owned': // todo: clean this up and in resource
          player.percent_owned = p[idx + 1].percent_owned;
          break;

        case 'draft_analysis':
          console.log(p[idx + 1]);
          player.draft_analysis = self.mapDraftAnalysis(p[idx + 1].draft_analysis);
          break;

        default:
          break;
      }
    });

    return player;
  });

  return players;
};
