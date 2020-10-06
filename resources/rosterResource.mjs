import { mapTeam, mapRoster } from "../helpers/teamHelper.mjs";

import { extractCallback } from "../helpers/argsParser.mjs";

class RosterResource {
  constructor(yf) {
    this.yf = yf;
  }

  players(teamKey, ...args) {
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/roster`;
    const cb = extractCallback(args);

    if (args.length) {
      let date = args.pop();
      if (date.indexOf("-") > 0) {
        // string is date, of format y-m-d
        url += `;date=${date}`;
      } else {
        // number is week...
        url += `;week=${date}`;
      }
    }

    return this.yf
      .api(this.yf.GET, url)
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
}

export default RosterResource;
