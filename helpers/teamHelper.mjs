import { mapPlayer } from "./playerHelper.mjs";
import { mergeObjects, flattenObject } from "./sharedHelpers.mjs";

export const mapTeam = t => {
  const team = mergeObjects(t);
  // clean up team_logos
  team.team_logos = team.team_logos.map(logo => logo.team_logo);

  // clean up managers
  team.managers = team.managers.map(manager => manager.manager);

  return team;
};

export const mapRoster = r => {
  let players = r[0].players;

  // TODO: clean this up?
  const count = players.count;
  const roster = [];

  for (let i = 0; i < count; i++) {
    let player = players[i].player[0];
    player = mapPlayer(player);

    roster.push(player);
  }

  return roster;
};

export const mapStats = stats => {
  stats = stats.map(s => s.stat);

  return stats;
};

export const mapDraft = d => {
  // TODO: clean this up?
  const count = d.count;
  const draft = [];

  for (let i = 0; i < count; i++) {
    let result = d[i].draft_result;

    draft.push(result);
  }

  return draft;
};

export const mapMatchups = ms => {
  const count = ms.count;
  const matchups = [];

  for (let i = 0; i < count; i++) {
    let matchup = ms[i].matchup;

    // grades seem to be football specific...
    // todo: shared with league helper...
    if (matchup.matchup_grades) {
      matchup.matchup_grades = matchup.matchup_grades.map(grade => {
        return {
          team_key: grade.matchup_grade.team_key,
          grade: grade.matchup_grade.grade
        };
      });
    }

    // TODO: clean this up too...
    let teamCount = matchup[0].teams.count;
    matchup.teams = [];
    for (let j = 0; j < teamCount; j++) {
      let team = mapTeam(matchup[0].teams[j].team[0]);
      team = mapTeamPoints(team, matchup[0].teams[j].team[1]);

      matchup.teams.push(team);
    }

    delete matchup[0];
    matchups.push(matchup);
  }

  return matchups;
};

export const mapTeamPoints = (team, points) => {
  team.points = points.team_points;

  if (points.team_stats) {
    team.stats = mapStats(points.team_stats.stats);
  }

  if (points.team_projected_points) {
    team.projected_points = points.team_projected_points;
  }

  return team;
};

export const parseCollection = (ts, subresources) => {
  const count = ts.count;
  const teams = [];

  for (let i = 0; i < count; i++) {
    teams.push(ts[i]);
  }

  return teams.map(t => {
    // this is only here because user games collection is adding an extra null
    // and I cannot for the life of me figure out why.
    t.team = t.team.filter(o => null !== o);

    let team = mapTeam(t.team[0]);

    subresources.forEach((resource, idx) => {
      switch (resource) {
        case "stats":
          // TODO: this could be cleaner...
          if (t.team[idx + 1].team_stats) {
            team.stats = mapStats(t.team[idx + 1].team_stats.stats);
          }

          if (t.team[idx + 1].team_points) {
            team.points = t.team[idx + 1].team_points;
          }

          break;

        case "standings":
          team.standings = t.team[idx + 1].team_standings;
          break;

        case "roster":
          team.roster = mapRoster(t.team[idx + 1].roster);
          break;

        case "draftresults":
          team.draftresults = mapDraft(t.team[idx + 1].draft_results);
          break;

        case "matchups":
          team.matchups = mapMatchups(t.team[idx + 1].matchups);
          break;

        default:
          break;
      }
    });

    return team;
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
    league.teams = parseCollection(l.league[1].teams, subresources);

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
    let team = teamHelper.mapTeam(t.team[0]);
    team.players = parseCollection(t.team[1].players, subresources);

    return team;
  });
};

export const parseGameCollection = (gs, subresources) => {
  const count = gs.count;
  const games = [];

  for (let i = 0; i < count; i++) {
    games.push(gs[i]);
  }

  return games.map(g => {
    let game = g.game[0];
    game.teams = parseCollection(g.game[1].teams, subresources);

    return game;
  });
};
