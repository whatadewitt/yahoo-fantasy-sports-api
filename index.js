/* global module, require */

'use strict';

module.exports = YahooFantasy;

var OAuth = require('oauth').OAuth,
  https = require('https'),
  querystring = require('querystring'),
  util = require('util'),
  Q = require('q'),
  GameResource = require('./resources/gameResource.js'),
  LeagueResource = require('./resources/leagueResource.js'),
  PlayerResource = require('./resources/playerResource.js'),
  RosterResource = require('./resources/rosterResource.js'),
  TeamResource = require('./resources/teamResource.js'),
  TransactionResource = require('./resources/transactionResource.js'),
  UserResource = require('./resources/userResource.js'),
  PlayersCollection = require('./collections/playersCollection.js'),
  GamesCollection = require('./collections/gamesCollection.js'),
  TeamsCollection = require('./collections/teamsCollection.js'),
  LeaguesCollection = require('./collections/leaguesCollection.js');
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

  this.oauth = oauth;
  this.game = new GameResource(this);
  this.games = new GamesCollection(this);
  this.league = new LeagueResource(this);
  this.leagues = new LeaguesCollection(this);
  this.player = new PlayerResource(this);
  this.players = new PlayersCollection(this);
  this.team = new TeamResource(this);
  this.teams = new TeamsCollection(this);
  this.transaction = new TransactionResource(this);
  // this.transactions = new TransactionsCollection(this);
  this.roster = new RosterResource(this);
  this.user = new UserResource(this);
  // this.users = new UsersCollection();
  this.yuser = {
    token: null,
    secret: null,
    sessionHandle: null
  };
  this.consumer = {
    key: consumerKey,
    secret: consumerSecret
  };
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
  deferred = typeof deferred !== 'undefined' ?  deferred : Q.defer();

  this.oauth.get(
    url,
    this.yuser.token,
    this.yuser.secret,
    this.apiCallback.bind(this, url, deferred)
  );

  return deferred.promise;
};

YahooFantasy.prototype.apiCallback = function(url, deferred, e, data, resp) {
  if (e) {
    if (401 === e.statusCode) {
      return this.refreshUserToken().then(function() {
        return this.api(url, deferred);
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
};
