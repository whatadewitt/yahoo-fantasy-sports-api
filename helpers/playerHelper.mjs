import { mergeObjects } from "./sharedHelpers.mjs";
import { mapTeam } from "./teamHelper.mjs";

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

export const parseCollection = (ps, subresources) => {
  const count = ps.count;
  const players = [];

  for (let i = 0; i < count; i++) {
    players.push(ps[i]);
  }

  return players.map(p => {
    let player = mapPlayer(p.player[0]);

    subresources.forEach((resource, idx) => {
      switch (resource) {
        case "stats":
          player.stats = mapStats(p.player[idx + 1].player_stats);
          break;

        case "percent_owned": // todo: clean this up and in resource
          player.percent_owned = p.player[idx + 1].percent_owned;
          break;

        case "ownership":
          player.ownership = mapOwnership(p.player[idx + 1].ownership);
          break;

        case "draft_analysis":
          player.draft_analysis = mapDraftAnalysis(
            p.player[idx + 1].draft_analysis
          );
          break;

        default:
          break;
      }
    });

    return player;
  });
};

export const parseLeagueCollection = (ls, subresources) => {
  const count = ls.count;
  const leagues = [];

  for (let i = 0; i < count; i++) {
    leagues.push(ls[i]);
  }

  return leagues.map(l => {
    let league = l.league[0];
    league.players = parseCollection(l.league[1].players, subresources);

    return league;
  });
};

export const parseTeamCollection = (ts, subresources) => {
  const count = ts.count;
  const teams = [];

  for (let i = 0; i < count; i++) {
    teams.push(ts[i]);
  }

  return teams.map(t => {
    let team = mapTeam(t.team[0]);
    team.players = this.parseCollection(t.team[1].players, subresources);

    return team;
  });
};
