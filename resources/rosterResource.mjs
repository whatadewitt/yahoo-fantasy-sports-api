import { mapTeam, mapRoster } from "../helpers/teamHelper.mjs";

import { extractCallback } from "../helpers/argsParser.mjs";
import { parseResourceArgs } from "../helpers/resourceHelper.mjs";

class RosterResource {
  constructor(yf) {
    this.yf = yf;
  }

  fetch(teamKey, ...args) {
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/roster`;
    const cb = extractCallback(args);

    if (args.length) {
      let date = args.shift();
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

  // players will allow us to specify a subresource to append
  players(teamKey, ...args) {
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/roster`;
    const cb = extractCallback(args);

    const [date, dateType, subresource] = parseResourceArgs(args);

    if (subresource && dateType) {
      if (dateType !== "season") {
        url += `;${dateType}=${date}`;
      }
      url += `/players/${subresource};type=${dateType}`;

      if (dateType !== "season") {
        url += `;${dateType}=${date}`;
      }
    } else if (dateType !== "season") {
      url += `;${dateType}=${date}`;
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
