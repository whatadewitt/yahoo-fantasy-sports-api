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

import { extractCallback } from "./helpers/argsParser.mjs";

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
    const cb = extractCallback(args);
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

    return new Promise((resolve, reject) => {
      request(options, (e, body, data) => {
        const err = e || data.error;
        if (err) {
          reject(err);
          return cb(err);
        }
        resolve(data);
        return cb(null, data);
      });
    });
  }
}

export default YahooFantasy;
