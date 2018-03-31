/* global module, require */
// ("use strict");

import {
  Game,
  League,
  Player,
  Roster,
  Team,
  Transaction,
  User
} from "./resources";

import { Games, Leagues, Players, Teams } from "./collections"; // Transactions, Users } from "./collections";

import request from "request";

class YahooFantasy {
  constructor(consumerKey, consumerSecret) {
    this.GET = "GET";
    this.POST = "POST";

    this.game = new Game(this);
    this.games = new Games(this);

    this.league = new League(this);
    this.leagues = new Leagues(this);

    this.player = new Player(this);
    this.players = new Players(this);

    this.team = new Team(this);
    this.teams = new Teams(this);

    this.transaction = new Transaction(this);
    // this.transactions = new Transactions(this);

    this.roster = new Roster(this);

    this.user = new User(this);
    // this.users = new Users(); // TODO

    this.yahooUserToken = null;
  }

  setUserToken(token) {
    this.yahooUserToken = token;
  }

  api(...args) {
    const method = args.shift();
    const url = args.shift();
    const cb = args.pop();
    let postData = false;

    if (args.length) {
      postData = args.pop();
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
