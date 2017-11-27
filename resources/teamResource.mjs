import {
  mapTeam,
  mapStats,
  mapRoster,
  mapDraft,
  mapMatchups
} from "../helpers/teamHelper.mjs";

class TeamResource {
  constructor(yf) {
    this.yf = yf;
  }

  meta(teamKey, cb) {
    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/team/${
        teamKey
      }/metadata?format=json`,
      (err, data) => {
        if (err) {
          return cb(err);
        }

        const meta = mapTeam(data.fantasy_content.team[0]);
        return cb(null, meta);
      }
    );
  }

  stats(teamKey, cb) {
    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/team/${
        teamKey
      }/stats?format=json`,
      (err, data) => {
        if (err) {
          return cb(err);
        }

        const stats = mapStats(data.fantasy_content.team[1].team_stats.stats);
        const team = mapTeam(data.fantasy_content.team[0]);

        team.stats = stats;

        return cb(null, team);
      }
    );
  }

  standings(teamKey, cb) {
    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/team/${
        teamKey
      }/standings?format=json`,
      (err, data) => {
        if (err) {
          return cb(err);
        }

        const standings = data.fantasy_content.team[1].team_standings;
        const team = mapTeam(data.fantasy_content.team[0]);

        team.standings = standings;

        return cb(null, team);
      }
    );
  }

  roster(teamKey, cb) {
    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/team/${
        teamKey
      }/roster?format=json`,
      (err, data) => {
        if (err) {
          return cb(err);
        }

        const team = mapTeam(data.fantasy_content.team[0]);
        const roster = mapRoster(data.fantasy_content.team[1].roster);

        team.roster = roster;

        return cb(null, team);
      }
    );
  }

  draft_results(teamKey, cb) {
    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/team/${
        teamKey
      }/draftresults?format=json`,
      (err, data) => {
        if (err) {
          return cb(err);
        }

        const draft_results = mapDraft(
          data.fantasy_content.team[1].draft_results
        );
        const team = mapTeam(data.fantasy_content.team[0]);

        team.draft_results = draft_results;

        return cb(null, team);
      }
    );
  }

  // h2h leagues only...
  matchups(teamKey, ...args) {
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${
      teamKey
    }/matchups`;

    const cb = args.pop();

    if (args.length) {
      let weeks = args.pop();

      if (Array.isArray(weeks)) {
        weeks = weeks.join(",");
      }

      url += ";weeks=" + weeks;
    }

    url += "?format=json";

    this.yf.api(this.yf.GET, url, (err, data) => {
      if (err) {
        return cb(err);
      }

      const matchups = mapMatchups(data.fantasy_content.team[1].matchups);
      const team = mapTeam(data.fantasy_content.team[0]);

      team.matchups = matchups;

      return cb(null, team);
    });
  }
}

export default TeamResource;
