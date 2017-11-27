/* global module, require */
// ("use strict");

import {
  Game,
  League,
  Player,
  Roster,
  Team,
  Transaction
  // User
} from "./resources";

// import { Games, Teams, Leagues, Transactions, Users } from "./collections";

import request from "request";
//   GameResource = require("./resources/gameResource.js"),
//   LeagueResource = require("./resources/leagueResource.js"),
//   PlayerResource = require("./resources/playerResource.js"),
//   RosterResource = require("./resources/rosterResource.js"),
//   TeamResource = require("./resources/teamResource.js"),
//   TransactionResource = require("./resources/transactionResource.js"),
//   UserResource = require("./resources/userResource.js"),
//   PlayersCollection = require("./collections/playersCollection.js"),
//   GamesCollection = require("./collections/gamesCollection.js"),
//   TeamsCollection = require("./collections/teamsCollection.js"),
//   LeaguesCollection = require("./collections/leaguesCollection.js"),
//   TransactionsCollection = require("./collections/transactionsCollection.js");
// usersCollection = require('./collections/usersCollection.js');

class YahooFantasy {
  constructor(consumerKey, consumerSecret) {
    this.GET = "GET";
    this.POST = "POST";

    this.game = new Game(this);
    // this.games = new Games(this);

    this.league = new League(this);
    // this.leagues = new Leagues(this);

    this.player = new Player(this);
    // this.players = new Players(this);

    this.team = new Team(this);
    // this.teams = new Teams(this);

    this.transaction = new Transaction(this);
    // this.transactions = new Transactions(this);

    this.roster = new Roster(this);

    // this.user = new User(this);
    // this.users = new Users(); // TODO

    this.yahooUserToken = null;
  }

  setUserToken(token) {
    this.yahooUserToken = token;
  }

  api(method, url, postData, cb) {
    if (arguments.length == 3) {
      cb = postData;
      postData = null;
    }

    var options = {
      url: url,
      method: method,
      json: true,
      auth: {
        bearer: this.yahooUserToken
      }
    };

    request(options, (e, body, data) => {
      if (e) {
        return cb(e);
      } else {
        if (data.error) {
          return cb(data.error);
        }

        return cb(null, data);
      }
    });
  }
}

export default YahooFantasy;
