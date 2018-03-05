import { mapTeam } from "./teamHelper.mjs";

export const mapGames = gs => {
  // TODO: clean this up?
  const count = gs.count;
  const games = [];

  for (let i = 0; i < count; i++) {
    let game = Array.isArray(gs[i].game) ? gs[i].game[0] : gs[i].game;

    games.push(game);
  }

  return games;
};

export const mapUserLeagues = gs => {
  // TODO: clean this up?
  const count = gs.count;
  const games = [];

  for (let i = 0; i < count; i++) {
    let game = gs[i].game[0];

    const ls = gs[i].game[1].leagues;
    const leagueCount = ls.count;
    const leagues = [];
    for (let j = 0; j < leagueCount; j++) {
      leagues.push(ls[j].league);
    }

    game.leagues = leagues;
    games.push(game);
  }

  return games;
};

export const mapUserTeams = gs => {
  // TODO: clean this up?
  const count = gs.count;
  const games = [];

  for (let i = 0; i < count; i++) {
    let game = gs[i].game[0];

    const ts = gs[i].game[1].teams;
    const teamCount = ts.count;
    const teams = [];
    for (let j = 0; j < teamCount; j++) {
      const team = mapTeam(ts[j].team[0]);

      teams.push(team);
    }

    game.teams = teams;
    games.push(game);
  }

  return games;
};
/**
exports.parseCollection = function(user, subresources) {
  var self = this;

  _.forEach(subresources, function(resource, idx) {
    switch (resource) {
      case 'games':
        user.games = self.mapGames(t[idx + 1].games);
        break;

      case 'leagues':
        user.leagues = self.mapUserLeagues(t[idx + 1].leagues);
        break;

      case 'teams':
        user.teams = self.mapUserTeams(t[idx + 1].teams);
        break;

      default:
        break;
    }
  });

  return user;
};
 */
