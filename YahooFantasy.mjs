/* global module, require */
import https from "https";

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
    let postData = false;

    if (args.length) {
      postData = args.pop();
    }

    const options = {
      hostname: "fantasysports.yahooapis.com",
      path: url.replace("https://fantasysports.yahooapis.com", ""),
      method: method,
      headers: {
        Authorization: ` Bearer ${this.yahooUserToken}`
      }
    };

    return new Promise((resolve, reject) => {
      https
        .request(options, resp => {
          let data = "";

          resp.on("data", chunk => {
            data += chunk;
          });

          resp.on("end", () => {
            data = JSON.parse(data);

            if (data.error) {
              return reject(data.error);
            }

            return resolve(data);
          });
        })
        .on("error", err => {
          return reject(err.message);
        })
        .end();
    });
  }
}

export default YahooFantasy;
