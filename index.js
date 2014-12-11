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
    game: gameResource(),
    games: gamesCollection(),
    league: leagueResource(),
    leagues: leaguesCollection(),
    player: playerResource(),
    players: playersCollection(),
    team: teamResource(),
    teams: teamsCollection(),
    transaction: transactionResource(),
    transactions: transactionsCollection(),
    roster: rosterResource(),
    user: userResource(),
    users: usersCollection(),
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
  this.game.game_weeks = _.bind(this.game.game_weeks, this);
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
  this.user.game_leagues = _.bind(this.user.game_leagues, this);
  this.user.game_teams = _.bind(this.user.game_teams, this);

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
          // todo: not done yet.
        } else {
          deferred.reject(JSON.parse(data));
        }
      } else {
        try {
          data = JSON.parse(data);
        } catch (er) {
          deferred.reject(er);
        }

        deferred.resolve(data);
      }
    }
  );

  return deferred.promise;
};

YahooFantasy.prototype.err = function(e, cb) {
  cb({
    error: e.error.description
  });
};
