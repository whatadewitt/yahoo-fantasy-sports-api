import {
  mapSettings,
  mapStandings,
  mapScoreboard,
  mapTeams,
  mapDraft,
  mapTransactions
} from "../helpers/leagueHelper.mjs";

// module.exports = LeagueResource;

class LeagueResource {
  constructor(yf) {
    this.yf = yf;
  }

  meta(leagueKey, cb) {
    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${
        leagueKey
      }/metadata?format=json`,
      (e, data) => {
        if (e) {
          return cb(e);
        }

        const meta = data.fantasy_content.league[0];
        return cb(null, meta);
      }
    );
  }

  settings(leagueKey, cb) {
    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${
        leagueKey
      }/settings?format=json`,
      (e, data) => {
        if (e) {
          return cb(e);
        }

        const settings = mapSettings(
          data.fantasy_content.league[1].settings[0]
        );
        const league = data.fantasy_content.league[0];

        league.settings = settings;

        return cb(null, league);
      }
    );
  }

  standings(leagueKey, cb) {
    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${
        leagueKey
      }/standings?format=json`,
      (e, data) => {
        if (e) {
          return cb(e);
        }

        const standings = mapStandings(
          data.fantasy_content.league[1].standings[0].teams
        );
        const league = data.fantasy_content.league[0];

        league.standings = standings;

        return cb(null, league);
      }
    );
  }

  // h2h only
  scoreboard(leagueKey, ...args) {
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${
      leagueKey
    }/scoreboard`;
    const cb = args.pop();

    if (args.length) {
      url += `;week=${args.pop()}`;
    }

    url += "?format=json";

    this.yf.api(this.yf.GET, url, (e, data) => {
      if (e) {
        return cb(e);
      }

      const week = data.fantasy_content.league[1].scoreboard.week;
      const scoreboard = mapScoreboard(
        data.fantasy_content.league[1].scoreboard[0].matchups
      );
      const league = data.fantasy_content.league[0];

      league.scoreboard = scoreboard;
      league.scoreboard.week = week;

      return cb(null, league);
    });
  }

  teams(leagueKey, cb) {
    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${
        leagueKey
      }/teams?format=json`,
      (e, data) => {
        if (e) {
          return cb(e);
        }

        const teams = mapTeams(data.fantasy_content.league[1].teams);
        const league = data.fantasy_content.league[0];
        league.teams = teams;

        return cb(null, league);
      }
    );
  }

  draft_results(leagueKey, cb) {
    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${
        leagueKey
      }/draftresults?format=json`,
      (e, data) => {
        if (e) {
          return cb(e);
        }

        const draft = mapDraft(data.fantasy_content.league[1].draft_results);
        const league = data.fantasy_content.league[0];

        league.draft_results = draft;

        return cb(null, league);
      }
    );
  }

  transactions(leagueKey, cb) {
    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${
        leagueKey
      }/transactions?format=json`,
      (err, data) => {
        if (err) {
          return cb(err);
        }

        const transactions = mapTransactions(
          data.fantasy_content.league[1].transactions
        );
        const league = data.fantasy_content.league[0];

        league.transactions = transactions;

        return cb(null, league);
      }
    );
  }
}

// LeagueResource.prototype._transactions_callback = function(cb, e, data) {
//   if (e) return cb(e);

//   var transactions = leagueHelper.mapTransactions(
//     data.fantasy_content.league[1].transactions
//   );
//   var league = data.fantasy_content.league[0];

//   league.transactions = transactions;

//   return cb(null, league);
// };

export default LeagueResource;

// not quite sure how to wrap this yet...
// LeagueResource.prototype.players = function(leagueKey, cb) {
//   var apiCallback = this._players_callback.bind(this, cb);

//   this.yf.api(
//     this.yf.GET,
//     "https://fantasysports.yahooapis.com/fantasy/v2/league/" +
//       leagueKey +
//       "/players?format=json",
//     apiCallback
//   );
// };

// LeagueResource.prototype._players_callback = function(cb, e, data) {
//   if (e) return cb(e);

//   var players = data.fantasy_content.league[1].players;
//   return cb(null, players);
// };
