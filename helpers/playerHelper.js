var _ = require('lodash');
var teamHelper = require('./teamHelper.js');

exports.mapPlayer = function(player) {
  var mergeObjects = function(arrayOfObjects) {
    var destinationObj = {};
    var key;

    if(arrayOfObjects){
      _.forEach(arrayOfObjects, function(obj) {
        _.forEach(_.keys(obj), function(key) {
          if (!_.isUndefined(key)) {
            destinationObj[key] = obj[key];
          }
        });
      });
    }
    
    return destinationObj;
  };
  
  var playerObj = mergeObjects(player);

  playerObj.eligible_positions = _.map(
    playerObj.eligible_positions,
    function(p) { return p.position; }
  );
  
  if ( playerObj.selected_position ) {
    playerObj.selected_position = playerObj.selected_position[1].position;
  }
  
  if ( playerObj.starting_status ) {
    playerObj.starting_status = ( playerObj.starting_status ) ? playerObj.starting_status[1].is_starting : 0;
  }

  return playerObj;
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

  players = _.filter(players, function(p) { return typeof(p) === 'object'; });
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

        case 'ownership':
          player.ownership = p[idx + 1].ownership;
          break;

        case 'draft_analysis':
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

exports.parseLeagueCollection = function(leagues, subresources) {
  var self = this;

  leagues = _.filter(leagues, function(l) { return typeof(l) === 'object'; });
  leagues = _.map(leagues, function(l) { return l.league; });
  leagues = _.map(leagues, function(l) {
    var league = l[0];
    league.players = self.parseCollection(l[1].players, subresources);

    return league;
  });

  return leagues;
};

exports.parseTeamCollection = function(teams, subresources) {
  var self = this;

  teams = _.filter(teams, function(t) { return typeof(t) === 'object'; });
  teams = _.map(teams, function(t) { return t.team; });
  teams = _.map(teams, function(t) {
    var team = teamHelper.mapTeam(t[0]);
    team.players = self.parseCollection(t[1].players, subresources);

    return team;
  });

  return teams;
};
