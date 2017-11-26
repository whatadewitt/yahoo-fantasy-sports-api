import { mergeObjects } from "./sharedHelpers.mjs";

export const mapPlayer = p => {
  const player = mergeObjects(p);

  if (player.eligible_positions) {
    player.eligible_positions = player.eligible_positions.map(p => p.position);
  }

  if (player.selected_position) {
    player.selected_position = player.selected_position[1].position;
  }

  if (player.starting_status) {
    player.starting_status = player.starting_status
      ? player.starting_status[1].is_starting
      : 0;

    if (player.batting_order) {
      player.batting_order = player.batting_order[0].order_num;
    }
  }

  return player;
};

export const mapStats = stats => {
  const coverage_type = stats[0].coverage_type;
  return {
    coverage_type: coverage_type,
    coverage_value: stats[0][coverage_type],
    stats: stats.stats.map(s => s.stat)
  };
};

export const mapOwnership = ownership => {
  var o = {
    ownership_type: ownership.ownership_type
  };

  if ("team" === o.ownership_type) {
    o.owner_team_key = ownership.owner_team_key;
    o.owner_team_name = ownership.owner_team_name;
  }

  return o;
};

export const mapDraftAnalysis = da => {
  return mergeObjects(da);
};
/**
exports.parseCollection = function(players, subresources) {
  var self = this;

  players = _.filter(players, function(p) {
    return typeof p === "object";
  });
  players = _.map(players, function(p) {
    return p.player;
  });
  players = _.map(players, function(p) {
    var player = self.mapPlayer(p[0]);

    _.forEach(subresources, function(resource, idx) {
      switch (resource) {
        case "stats":
          player.stats = self.mapStats(p[idx + 1].player_stats);
          break;

        case "percent_owned": // todo: clean this up and in resource
          player.percent_owned = p[idx + 1].percent_owned;
          break;

        case "ownership":
          player.ownership = self.mapOwnership(p[idx + 1].ownership);
          break;

        case "draft_analysis":
          player.draft_analysis = self.mapDraftAnalysis(
            p[idx + 1].draft_analysis
          );
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

  leagues = _.filter(leagues, function(l) {
    return typeof l === "object";
  });
  leagues = _.map(leagues, function(l) {
    return l.league;
  });
  leagues = _.map(leagues, function(l) {
    var league = l[0];
    league.players = self.parseCollection(l[1].players, subresources);

    return league;
  });

  return leagues;
};

exports.parseTeamCollection = function(teams, subresources) {
  var self = this;

  teams = _.filter(teams, function(t) {
    return typeof t === "object";
  });
  teams = _.map(teams, function(t) {
    return t.team;
  });
  teams = _.map(teams, function(t) {
    var team = teamHelper.mapTeam(t[0]);
    team.players = self.parseCollection(t[1].players, subresources);

    return team;
  });

  return teams;
};
 */
