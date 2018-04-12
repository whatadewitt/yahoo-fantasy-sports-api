import {
  mapTeam,
  mapStats,
  mapRoster,
  mapDraft,
  mapMatchups
} from "../helpers/teamHelper.mjs";
import { extractCallback } from "../helpers/argsParser.mjs";

class TeamResource {
  constructor(yf) {
    this.yf = yf;
  }

  meta(teamKey, cb) {
    return this.yf.api(
      {
        method: this.yf.GET,
        url: `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/metadata?format=json`,
        responseMapper: data => mapTeam(data.fantasy_content.team[0])
      }, 
      cb);
  }

  stats(teamKey, cb) {
    return this.yf.api(
      {
        method: this.yf.GET,
        url: `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/stats?format=json`,
        responseMapper: data => {
          const stats = mapStats(data.fantasy_content.team[1].team_stats.stats);
          const team = mapTeam(data.fantasy_content.team[0]);

          team.stats = stats;

          return team;
        }
      }, 
      cb);
  }

  standings(teamKey, cb) {
    return this.yf.api(
      {
        method: this.yf.GET,
        url: `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/standings?format=json`,
        responseMapper: data => {
          const standings = data.fantasy_content.team[1].team_standings;
          const team = mapTeam(data.fantasy_content.team[0]);

          team.standings = standings;

          return team;
        }
      }, 
      cb);
  }

  roster(teamKey, cb) {
    return this.yf.api(
      {
        method: this.yf.GET,
        url: `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/roster?format=json`,
        responseMapper: data => {
          const team = mapTeam(data.fantasy_content.team[0]);
          const roster = mapRoster(data.fantasy_content.team[1].roster);

          team.roster = roster;

          return team;
        }
      }, 
      cb);
  }

  draft_results(teamKey, cb) {
    return this.yf.api(
      {
        method: this.yf.GET,
        url: `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/draftresults?format=json`,
        responseMapper: data => {
          const draft_results = mapDraft(
            data.fantasy_content.team[1].draft_results
          );
          const team = mapTeam(data.fantasy_content.team[0]);

          team.draft_results = draft_results;

          return team;
        }
      }, 
      cb);
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

    url += "?format=json";

    return this.yf.api(
      {
        method: this.yf.GET, 
        url,
        responseMapper: data => {
          const matchups = mapMatchups(data.fantasy_content.team[1].matchups);
          const team = mapTeam(data.fantasy_content.team[0]);

          team.matchups = matchups;

          return team;
        }
      }, 
      cb);
  }
}

export default TeamResource;
