/* global module, require */

'use strict';

module.exports = YahooFantasy;

var OAuth = require('oauth').OAuth,
  https = require('https'),
  querystring = require('querystring'),
  util = require('util'),
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
  LeaguesCollection = require('./collections/leaguesCollection.js'),
  TransactionsCollection = require('./collections/transactionsCollection.js');
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
  
  this.GET = 'get';
  this.POST = 'post';

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
  this.transactions = new TransactionsCollection(this);
  this.roster = new RosterResource(this);
  this.user = new UserResource(this);
  // this.users = new UsersCollection(); // TODO
  
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

YahooFantasy.prototype.api = function(method, url, postData, cb) {
  if ( arguments.length == 3 ) {
    cb = postData;
    postData = null;
  }
  
  var callback = this.apiCallback.bind(this, method, url, postData, cb);
  
  if ( this.POST == method ) {
    this.oauth.post(
      url,
      this.yuser.token,
      this.yuser.secret,
      postData,
      'application/xml',
      callback
    );
  } else {
    this.oauth.get(
      url,
      this.yuser.token,
      this.yuser.secret,
      callback
    ); 
  }
};

YahooFantasy.prototype.apiCallback = function(method, url, postData, cb, e, data, resp) {
  try {
    data = JSON.parse(data);
    
    if (e) {
      return cb(e);
    } else {
      if ( data.error ) {
        return cb(data.error);
      }
      
      return cb(null, data);
    }
  } catch (error) {
    return cb(error);
  }
};
