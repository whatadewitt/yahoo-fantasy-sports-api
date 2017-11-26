import { mapTeam, mapRoster } from "../helpers/teamHelper.mjs";

class RosterResource {
  constructor(yf) {
    this.yf = yf;
  }

  players(teamKey, ...args) {
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${
      teamKey
    }/roster`;

    const cb = args.pop();

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

    url += "?format=json";

    this.yf.api(this.yf.GET, url, (err, data) => {
      if (err) {
        return cb(err);
      }

      const team = mapTeam(data.fantasy_content.team[0]);
      const roster = mapRoster(data.fantasy_content.team[1].roster);
      team.roster = roster;

      return cb(null, team);
    });
  }
}

export default RosterResource;
