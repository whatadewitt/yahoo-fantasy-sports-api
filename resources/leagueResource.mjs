import {
  mapSettings,
  mapStandings,
  mapScoreboard,
  mapTeams,
  mapDraft,
  mapTransactions,
} from "../helpers/leagueHelper.mjs";

import { mapPlayers } from "../helpers/gameHelper.mjs";

import { extractCallback } from "../helpers/argsParser.mjs";

class LeagueResource {
  constructor(yf) {
    this.yf = yf;
  }

  meta(leagueKey, cb = () => {}) {
    return this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/metadata`
      )
      .then((data) => {
        const meta = data.fantasy_content.league[0];

        cb(null, meta);
        return meta;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  settings(leagueKey, cb = () => {}) {
    return this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/settings`
      )
      .then((data) => {
        const settings = mapSettings(
          data.fantasy_content.league[1].settings[0]
        );
        const league = data.fantasy_content.league[0];

        league.settings = settings;
        cb(null, league);
        return league;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  standings(leagueKey, cb = () => {}) {
    return this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/standings`
      )
      .then((data) => {
        const standings = mapStandings(
          data.fantasy_content.league[1].standings[0].teams
        );
        const league = data.fantasy_content.league[0];

        league.standings = standings;
        cb(null, league);
        return league;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  // h2h only
  scoreboard(leagueKey, ...args) {
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/scoreboard`;
    const cb = extractCallback(args);

    if (args.length) {
      url += `;week=${args.pop()}`;
    }

    url += "";

    return this.yf
      .api(this.yf.GET, url)
      .then((data) => {
        const week = data.fantasy_content.league[1].scoreboard.week;
        const scoreboard = mapScoreboard(
          data.fantasy_content.league[1].scoreboard[0].matchups
        );
        const league = data.fantasy_content.league[0];

        league.scoreboard = scoreboard;
        league.scoreboard.week = week;
        cb(null, league);
        return league;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  teams(leagueKey, cb = () => {}) {
    return this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/teams`
      )
      .then((data) => {
        const teams = mapTeams(data.fantasy_content.league[1].teams);
        const league = data.fantasy_content.league[0];
        league.teams = teams;
        cb(null, league);
        return league;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  draft_results(leagueKey, cb = () => {}) {
    return this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/draftresults`
      )
      .then((data) => {
        const draft = mapDraft(data.fantasy_content.league[1].draft_results);
        const league = data.fantasy_content.league[0];

        league.draft_results = draft;
        cb(null, league);
        return league;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  transactions(leagueKey, cb = () => {}) {
    return this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/transactions`
      )
      .then((data) => {
        const transactions = mapTransactions(
          data.fantasy_content.league[1].transactions
        );
        const league = data.fantasy_content.league[0];

        league.transactions = transactions;
        cb(null, league);
        return league;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  // WIP... not sure this is useful... certainly doesn't feel good...
  players(leagueKey, ...args) {
    const cb = extractCallback(args);
    let playerKeys = args.length ? args.shift() : false,
      week = false;

    if (!Array.isArray(playerKeys)) {
      playerKeys = [playerKeys];
    }

    if (args.length) {
      week = args.shift();
    }

    let url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/players;`;

    url += `player_keys=${playerKeys.join(",")}`;

    url += "/stats";

    if (week) {
      url += `;week=${week}`;
    }

    return this.yf
      .api(this.yf.GET, url)
      .then((data) => {
        // TODO: map players stats here as well
        const players = mapPlayers(data.fantasy_content.league[1].players);

        const league = data.fantasy_content.league[0];

        league.players = players;

        cb(null, league);
        return league;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }
}

export default LeagueResource;
