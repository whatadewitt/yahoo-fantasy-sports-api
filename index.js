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

  this.player.stats = _.bind(this.player.stats, this);

  this.team.meta = _.bind(this.team.meta, this);

  this.roster.players = _.bind(this.roster.players, this);

  this.players.fetch = _.bind(this.players.fetch, this);
  this.players.leagueFetch = _.bind(this.players.leagueFetch, this);

  /*
   * Helper function to map data to a "team"
   */
  this.helperTeamMap = function(teams) {
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
        managers: t[13].managers // could make this an array...
      }
    });
    return teams;
  };

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
        if (401 == e.statusCode) {
          // need to re-authorize the user token

        } else {
          defer.reject(e);
        }
      } else {
        try {
          data = JSON.parse(data);
        } catch (er) {
          deferred.reject(er);
        }

        console.log(data);
        deferred.resolve(data);
      }
    }
  );

  return deferred.promise;
};
