/* global module, require */

'use strict';

module.exports = YahooFantasy;

var request = require('request'),
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
  this.GET = 'GET';
  this.POST = 'POST';

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
  
  this.yahooUserToken = null;
}

YahooFantasy.prototype.setUserToken = function(token) {
  this.yahooUserToken = token;
};

YahooFantasy.prototype.api = function(method, url, postData, cb) {
  if ( arguments.length == 3 ) {
    cb = postData;
    postData = null;
  }
  
  var callback = this.apiCallback.bind(this, method, url, postData, cb);
  var options = {
    url: url,
    method: method,
    json: true,
    auth: {
      'bearer': this.yahooUserToken
    }
  };

  request(options, callback);
};

YahooFantasy.prototype.apiCallback = function(method, url, postData, cb, e, resp, data) {
  if (e) {
    return cb(e);
  } else {
    if ( data.error ) {
      // i hate regex so if anyone has a better way to do this...
      data.error.reason = String(data.error.description).match( /"(.*?)"/ )[1];
      return cb(data.error);
    }
    
    return cb(null, data);
  }
};
