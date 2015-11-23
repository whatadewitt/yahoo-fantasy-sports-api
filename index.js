'use strict';

module.exports = YahooFantasy;

var OAuth = require('oauth').OAuth,
  https = require('https'),
  querystring = require('querystring'),
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
  leaguesCollection = require('./collections/leaguesCollection.js');
  // transactionsCollection = require('./collections/transactionsCollection.js')
  // usersCollection = require('./collections/usersCollection.js');

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
    // transactions: transactionsCollection(),
    roster: rosterResource(),
    user: userResource(),
    // users: usersCollection(),
    yuser: {
      token: null,
      secret: null,
      sessionHandle: null
    },
    consumer: {
      key: consumerKey,
      secret: consumerSecret
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
  this.players.leagues = _.bind(this.players.leagues, this);
  this.players.teams = _.bind(this.players.teams, this);

  this.teams.fetch = _.bind(this.teams.fetch, this);
  this.teams.userFetch = _.bind(this.teams.userFetch, this);
  this.teams.leagues = _.bind(this.teams.leagues, this);
  this.teams.games = _.bind(this.teams.games, this);

  // this.transactions.fetch = _.bind(this.transactions.fetch, this);
  // this.transactions.leagueFetch = _.bind(this.transactions.leagueFetch, this);

  // this.users.fetch = _.bind(this.users.fetch, this);
}

YahooFantasy.prototype.setUserToken = function(userToken, userSecret, userSession) {
  this.yuser.token = userToken;
  this.yuser.secret = userSecret;
  this.yuser.sessionHandle = userSession;
};

YahooFantasy.prototype.refreshUserToken = function() {
  var deferred = Q.defer();
  var self = this;

  var now = Math.floor(new Date().getTime() / 1000);
  var refresh_data = querystring.stringify({
    oauth_nonce: now.toString(36),
    oauth_consumer_key: self.consumer.key,
    oauth_signature_method: 'plaintext',
    oauth_signature: self.consumer.secret + '&' + self.yuser.secret,
    oauth_version: '1.0',
    oauth_token: self.yuser.token,
    oauth_timestamp: now,
    oauth_session_handle: self.yuser.sessionHandle
  });

  https.get('https://api.login.yahoo.com/oauth/v2/get_token?' + refresh_data, function(res) {
    var s = '';
    res.on('data', function(d) {
      s += d;
    });

    res.on('end', function() {
      var data = querystring.parse(s);
      self.setUserToken(data.oauth_token, data.oauth_token_secret, data.oauth_session_handle);

      return deferred.resolve();
    });
  });

  return deferred.promise;
};

YahooFantasy.prototype.api = function(url, deferred) {
  var self = this;
  deferred = typeof deferred !== 'undefined' ?  deferred : Q.defer();

  this.oauth.get(
    url,
    self.yuser.token,
    self.yuser.secret,
    function(e, data, resp) {
      if (e) {
        if (401 == e.statusCode) {
          return self.refreshUserToken().then(function() {
            return self.api(url, deferred);
            });
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
