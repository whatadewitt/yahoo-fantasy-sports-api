import {
  mapTeam,
  mapStats,
  mapRoster,
  mapDraft,
  mapMatchups,
} from "../helpers/teamHelper.mjs";

import { extractCallback } from "../helpers/argsParser.mjs";

class TeamResource {
  constructor(yf) {
    this.yf = yf;
  }

  meta(teamKey, cb = () => {}) {
    return this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/metadata`
      )
      .then((data) => mapTeam(data.fantasy_content.team[0]))
      .then((meta) => {
        cb(null, meta);
        return meta;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  stats(teamKey, ...args) {
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/stats`;
    const cb = extractCallback(args);

    if (args.length) {
      let date = args.pop();
      if (date.indexOf("-") > 0) {
        // string is date, of format y-m-d
        url += `;type=date;date=${date}`;
      } else {
        // number is week...
        url += `;type=week;week=${date}`;
      }
    }

    return this.yf
      .api(this.yf.GET, url)
      .then((data) => {
        const stats = mapStats(data.fantasy_content.team[1].team_stats.stats);
        const team = mapTeam(data.fantasy_content.team[0]);

        team.stats = stats;
        cb(null, team);
        return team;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  standings(teamKey, cb = () => {}) {
    return this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/standings`
      )
      .then((data) => {
        const standings = data.fantasy_content.team[1].team_standings;
        const team = mapTeam(data.fantasy_content.team[0]);

        team.standings = standings;
        cb(null, team);
        return team;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  roster(teamKey, cb = () => {}) {
    return this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/roster`
      )
      .then((data) => {
        const team = mapTeam(data.fantasy_content.team[0]);
        const roster = mapRoster(data.fantasy_content.team[1].roster);

        team.roster = roster;
        cb(null, team);
        return team;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  draft_results(teamKey, cb = () => {}) {
    return this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/draftresults`
      )
      .then((data) => {
        const draft_results = mapDraft(
          data.fantasy_content.team[1].draft_results
        );
        const team = mapTeam(data.fantasy_content.team[0]);

        team.draft_results = draft_results;
        cb(null, team);
        return team;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  // h2h leagues only...
  matchups(teamKey, ...args) {
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/matchups`;
    const cb = extractCallback(args);

    if (args.length) {
      let weeks = args.pop();

      if (Array.isArray(weeks)) {
        weeks = weeks.join(",");
      }

      url += ";weeks=" + weeks;
    }

    return this.yf
      .api(this.yf.GET, url)
      .then((data) => {
        const matchups = mapMatchups(data.fantasy_content.team[1].matchups);
        const team = mapTeam(data.fantasy_content.team[0]);

        team.matchups = matchups;
        cb(null, team);
        return team;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }
}

export default TeamResource;
