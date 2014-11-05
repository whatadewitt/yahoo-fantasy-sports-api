'use strict';

module.exports = YahooFantasy;

var OAuth = require('oauth').OAuth,
  util = require('util'),
  _ = require('lodash'),
  Q = require('q'),
  gameResource = require('./resources/gameResource.js'),
  leagueResource = require('./resources/leagueResource.js'),
  playerResource = require('./resources/playerResource.js'),
  rosterResource = require('./resources/rosterResource.js'),
  teamResource = require('./resources/teamResource.js'),
  transactionResource = require('./resources/transactionResource.js'),
  userResource = require('./resources/userResource.js'),
  playersCollection = require('./collections/playersCollection.js'),
  gamesCollection = require('./collections/gamesCollection.js'),
  teamsCollection = require('./collections/teamsCollection.js'),
  leaguesCollection = require('./collections/leaguesCollection.js'),
  transactionsCollection = require('./collections/transactionsCollection.js'),
  usersCollection = require('./collections/transactionsCollection.js');

function YahooFantasy(consumerKey, consumerSecret) {
  var oauth = new OAuth(
    'https://api.login.yahoo.com/oauth/v2/get_request_token',
    'https://api.login.yahoo.com/oauth/v2/get_token',
    consumerKey,
    consumerSecret,
    '1.0',
    null,
    'HMAC-SHA1'
  );

  _.extend(this, {
    oauth: oauth,
    game: gameResource,
    games: gamesCollection,
    league: leagueResource,
    leagues: leaguesCollection,
    player: playerResource,
    players: playersCollection,
    team: teamResource,
    teams: teamsCollection,
    transaction: transactionResource,
    transactions: transactionsCollection,
    roster: rosterResource,
    user: userResource,
    users: usersCollection,
    yuser: {
      token: null,
      secret: null,
      sessionHandle: null
    }
  });

  // binding everything... is there really not a better way?

  // resources
  this.game.meta = _.bind(this.game.meta, this);
  this.game.leagues = _.bind(this.game.leagues, this);
  this.game.players = _.bind(this.game.players, this);
  this.game.weeks = _.bind(this.game.weeks, this);
  this.game.stat_categories = _.bind(this.game.stat_categories, this);
  this.game.position_types = _.bind(this.game.position_types, this);
  this.game.roster_positions = _.bind(this.game.roster_positions, this);

  this.league.meta = _.bind(this.league.meta, this);
  this.league.settings = _.bind(this.league.settings, this);
  this.league.standings = _.bind(this.league.standings, this);
  this.league.scoreboard = _.bind(this.league.scoreboard, this);
  this.league.teams = _.bind(this.league.teams, this);
  this.league.players = _.bind(this.league.players, this);
  this.league.draft_results = _.bind(this.league.draft_results, this);
  this.league.transactions = _.bind(this.league.transactions, this);

  this.player.meta = _.bind(this.player.meta, this);
  this.player.stats = _.bind(this.player.stats, this);
  this.player.percent_owned = _.bind(this.player.percent_owned, this);
  this.player.ownership = _.bind(this.player.ownership, this);
  this.player.draft_analysis = _.bind(this.player.draft_analysis, this);

  this.roster.players = _.bind(this.roster.players, this);

  this.team.meta = _.bind(this.team.meta, this);
  this.team.stats = _.bind(this.team.stats, this);
  this.team.standings = _.bind(this.team.standings, this);
  this.team.roster = _.bind(this.team.roster, this);
  this.team.draft_results = _.bind(this.team.draft_results, this);
  this.team.matchups = _.bind(this.team.matchups, this);

  this.transaction.meta = _.bind(this.transaction.meta, this);
  this.transaction.players = _.bind(this.transaction.players, this);

  this.user.games = _.bind(this.user.games, this);
  this.user.leagues = _.bind(this.user.leagues, this);
  this.user.teams = _.bind(this.user.teams, this);

  // collections
  this.games.fetch = _.bind(this.games.fetch, this);
  this.games.user = _.bind(this.games.user, this);
  this.games.userFetch = _.bind(this.games.userFetch, this);

  this.leagues.fetch = _.bind(this.leagues.fetch, this);

  this.players.fetch = _.bind(this.players.fetch, this);
  this.players.leagueFetch = _.bind(this.players.leagueFetch, this);
  this.players.teamFetch = _.bind(this.players.teamFetch, this);

  this.transactions.fetch = _.bind(this.transactions.fetch, this);
  this.transactions.leagueFetch = _.bind(this.transactions.leagueFetch, this);

  this.users.fetch = _.bind(this.users.fetch, this);
}

YahooFantasy.prototype.setUserToken = function(userToken, userSecret, userSession) {
  this.yuser.token = userToken;
  this.yuser.secret = userSecret;
  this.yuser.sessionHandle = userSession;
};

YahooFantasy.prototype.api = function(url) {
  var self = this;
  var deferred = Q.defer();

  this.oauth.get(
    url,
    self.yuser.token,
    self.yuser.secret,
    function(e, data, resp) {
      if (e) {
        console.log(e);
        if (401 == e.statusCode) {
          // need to re-authorize the user token

        } else {
          defer.reject(e);
        }
      } else {
        try {
          data = JSON.parse(data);
        } catch (er) {
          console.log(er);
          deferred.reject(er);
        }

        deferred.resolve(data);
      }
    }
  );

  return deferred.promise;
};

// helper functions -- move these to "helper" dir
/*
 * Helper function to map data to a "team"
 */
YahooFantasy.prototype.helperTeamMap = function(teams) {
  teams = _.filter(teams, function(t) { return typeof(t) == 'object'; });
  teams = _.map(teams, function(t) { return t.team[0]; });
  teams = _.map(teams, function(t) {
    return {
      team_key: t[0].team_key,
      team_id: t[1].team_id,
      name: t[2].name,
      is_owned_by_current_login: t[3].is_owned_by_current_login,
      url: t[4].url,
      team_logo: t[5].team_logos[0].team_logo.url,
      waiver_priority: t[7].waiver_priority,
      number_of_moves: t[9].number_of_moves,
      number_of_trades: t[10].number_of_trades,
      // wtf is "roster adds" object?
      clinched_playoffs: t[12].clinched_playoffs,
      managers: _.map(t[13].managers, function(m) {
        return m.manager;
      })
    };
  });
  return teams;
};

YahooFantasy.prototype.helperSettingsMap = function(settings) {
  settings.stat_categories = _.map(
    settings.stat_categories.stats,
    function(s) {
      return s.stat;
    });

  settings.roster_positions = _.map(
    settings.roster_positions,
    function(p) {
      return p.roster_positions;
    });

  return settings;
};

YahooFantasy.prototype.helperDraftMap = function(draft) {
  draft = _.filter(draft, function(d) { return typeof(d) == 'object'; });
  draft = _.map(draft, function(d) { return d.draft_result; })

  return draft;
};

YahooFantasy.prototype.helperScoreboardMap = function(scoreboard) {
  // is this only for h2h? what about roto, and points?
  var matchups = _.filter(scoreboard, function(s) { return typeof(s) == 'object'; });
  matchups = _.map(matchups, function(m) { return m.matchup; });

  _.each(matchups, function(matchup) {
    // clean this up, but time...
    matchup.teams = [];

    var teams_data = matchup[0].teams;
    teams_data = _.filter(teams_data, function(t) { return typeof(t) == 'object'; });
    var teams = _.map(teams_data, function(t) { return t.team[0]; });
    teams = _.map(teams, function(t) {
      return {
        team_key: t[0].team_key,
        team_id: t[1].team_id,
        name: t[2].name,
        is_owned_by_current_login: t[3].is_owned_by_current_login,
        url: t[4].url,
        team_logo: t[5].team_logos[0].team_logo.url,
        waiver_priority: t[7].waiver_priority,
        number_of_moves: t[9].number_of_moves,
        number_of_trades: t[10].number_of_trades,
        // wtf is "roster adds" object?
        clinched_playoffs: t[12].clinched_playoffs,
        managers: _.map(t[13].managers, function(mgr) {
          return mgr.manager; // managers still may not be right
        })
      };
    }); // good, but ugly...

    var scoring_data = _.map(teams_data, function(t) { return t.team[1]; });

    var team_points = _.map(scoring_data, function(s) { return s.team_points; });

    var team_stats = _.map(scoring_data, function(s) { return s.team_stats; });
    var stats = _.map(team_stats.stats, function(s) { console.log(s.stat); return s.stat; });

    console.log(stats);

    // remove ugly data;
    delete matchup[0];

    // gotta be a better way...
    matchup.teams.push({
      team: teams[0],
      team_points: team_points[0],
      team_stats: team_stats[0]
    });

    matchup.teams.push({
      team: teams[1],
      team_points: team_points[1],
      team_stats: team_stats[1]
    });
  });

  return matchups;
};
