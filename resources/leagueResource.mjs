import {
  mapSettings,
  mapStandings,
  mapScoreboard,
  mapTeams,
  mapDraft,
  mapTransactions
} from "../helpers/leagueHelper.mjs";

import { extractCallback } from "../helpers/argsParser.mjs";
// module.exports = LeagueResource;

class LeagueResource {
  constructor(yf) {
    this.yf = yf;
  }

  meta(leagueKey, cb) {
    return this.yf.api(
      {
        method: this.yf.GET,
        url: `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/metadata?format=json`,
        responseMapper: data => data.fantasy_content.league[0]
      }, 
      cb);
  }

  settings(leagueKey, cb) {
    return this.yf.api(
      {
        method: this.yf.GET,
        url: `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/settings?format=json`,
        responseMapper: data => {
          const settings = mapSettings(
            data.fantasy_content.league[1].settings[0]
          );
          const league = data.fantasy_content.league[0];

          league.settings = settings;

          return league;
        }
      }, 
      cb);
  }

  standings(leagueKey, cb) {
    return this.yf.api(
      {
        method: this.yf.GET,
        url: `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/standings?format=json`,
        responseMapper: data => {
          const standings = mapStandings(
            data.fantasy_content.league[1].standings[0].teams
          );
          const league = data.fantasy_content.league[0];

          league.standings = standings;

          return league;
        }
      }, 
      cb);
  }

  // h2h only
  scoreboard(leagueKey, ...args) {
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/scoreboard`;
    const cb = extractCallback(args);

    if (args.length) {
      url += `;week=${args.pop()}`;
    }

    url += "?format=json";

    return this.yf.api(
      {
        method: this.yf.GET,
        url, 
        responseMapper: data => {
          const week = data.fantasy_content.league[1].scoreboard.week;
          const scoreboard = mapScoreboard(
            data.fantasy_content.league[1].scoreboard[0].matchups
          );
          const league = data.fantasy_content.league[0];

          league.scoreboard = scoreboard;
          league.scoreboard.week = week;

          return cb(null, league);
        }
      }, 
      cb);
  }

  teams(leagueKey, cb) {
    return this.yf.api(
      {
        method: this.yf.GET,
        url: `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/teams?format=json`,
        responseMapper: data => {
          const teams = mapTeams(data.fantasy_content.league[1].teams);
          const league = data.fantasy_content.league[0];
          league.teams = teams;

          return league;
        }
      }, 
      cb);
  }

  draft_results(leagueKey, cb) {
    return this.yf.api(
      {
        method: this.yf.GET,
        url: `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/draftresults?format=json`,
        responseMapper: data => {
          const draft = mapDraft(data.fantasy_content.league[1].draft_results);
          const league = data.fantasy_content.league[0];

          league.draft_results = draft;

          return league;
        }
      }, 
      cb);
  }

  transactions(leagueKey, cb) {
    return this.yf.api(
      {
        method: this.yf.GET,
        url: `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/transactions?format=json`,
        responseMapper: data => {
          const transactions = mapTransactions(
            data.fantasy_content.league[1].transactions
          );
          const league = data.fantasy_content.league[0];

          league.transactions = transactions;

          return league;
        }
      }, 
      cb);
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
