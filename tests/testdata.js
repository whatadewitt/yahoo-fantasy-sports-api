module.exports = {
  "game": {
    "meta": require('./nock-data/gameMeta.js'),
    "leagues": require('./nock-data/gameLeagues.js'),
    "players": require('./nock-data/gamePlayers.js'),
    "game_weeks": require('./nock-data/gameWeeks.js'),
    "stat_categories": require('./nock-data/gameStatCategories.js'),
    "position_types": require('./nock-data/gamePositionTypes.js'),
    "roster_positions": require('./nock-data/gameRosterPositions.js')
  },
  "league": {
    "meta": require('./nock-data/leagueMeta.js'),
    "settings": require('./nock-data/leagueSettings.js'),
    "standings": require('./nock-data/leagueStandings.js'),
    "scoreboard": require('./nock-data/leagueScoreboard.js'),
    "teams": require('./nock-data/leagueTeams.js'),
    "draft_results": require('./nock-data/leagueDraftResults.js'),
    "transactions": require('./nock-data/leagueTransactions.js'),
    // invalid league stuff
  },
  "player": {
    "meta": require('./nock-data/playerMeta.js'),
    "stats": require('./nock-data/playerStats.js'),
    "ownershipOwned": require('./nock-data/playerOwnershipOwned.js'),
    "ownershipUnowned": require('./nock-data/playerOwnershipUnowned.js'),
    "percent_owned": require('./nock-data/playerPercentOwned.js'),
    "draft_analysis": require('./nock-data/playerDraftAnalysis.js'),
    // should look into "player doesn't exist"
  },
  "roster": {
    "players": require('./nock-data/rosterPlayers.js')
    // invalid team
  },
  "team": {
    "meta": require('./nock-data/teamMeta.js'),
    "stats": require('./nock-data/teamStats.js'),
    "standings": require('./nock-data/teamStandings.js'),
    "roster": require('./nock-data/teamRoster.js'),
    "draft_reuslts": require('./nock-data/teamDraftResults.js'),
    "matchups": require('./nock-data/teamMatchups.js')
    // invalid team
  },
  "transaction": {
    "meta": require('./nock-data/transactionMeta.js'),
    "players": require('./nock-data/transactionPlayers.js')
    // invalid transaction id
  },
  "user": {
    "games": require('./nock-data/userGames.js'),
    "leagues": require('./nock-data/userLeagues.js'),
    "teams": require('./nock-data/userTeams.js'),
    "not_logged_in": require('./nock-data/userNotAuthorized.js'),
    "not_logged_in_leagues": require('./nock-data/userNotAuthorizedLeagues.js'),
    "not_logged_in_teams": require('./nock-data/userNotAuthorizedTeams.js')
  },
  "games": {
    "fetch": {
    },
    "user": {
    },
    "userFetch": {
    }
  },
  "leagues": {
    "fetch": {
    }
  },
  "players": {
    "fetch": {
    },
    "leagues": {
    },
    "teams": {
    }
  },
  "teams": {
    "fetch": {
    },
    "leagues": {
    },
    "userFetch": {
    },
    "games": {
    }
  },
  "transactions": {
    "fetch": {
    },
    "leagueFetch": {
    }
  },
  "users": {
    "fetch": {
    }
  }
};
