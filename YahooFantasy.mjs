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
    var options = {};
    let cb = () => {};
    let responseMapper = x => x;
    if (typeof args[0] === "object") {
      const argOptions = args.shift();
      options.method = argOptions.method;
      options.url = argOptions.url;
      responseMapper = argOptions.responseMapper;
      cb = args.pop() || cb;
    } else {
      options = {};
      options.method = args.shift();
      options.url = args.shift();
  
      if (args.length) {
        if (typeof args[args.length - 1] === "function") {
          cb = args.pop();
        }

        if (args.length) {
          options.body = args.pop();
        }
      }
    }

    if (!options.body) {
      options.json = true;
    }

    options.auth = { bearer: this.yahooUserToken };
    return new Promise((resolve, reject) => {
      request(options, (e, body, data) => {
        if (e) {
          reject(e);
          return cb(e);
        } else {
          if (data.error) {
            reject(data.error);
            return cb(data.error);
          }
          const result = responseMapper(data);
          resolve(result);
          return cb(null, result);
        }
      });
    });
  }
}

export default YahooFantasy;
