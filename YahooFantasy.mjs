/* global module, require */
import https from "https";
import { stringify } from "querystring";
import crypto from "crypto";
// TODO: we can remove this fairly easily: https://medium.com/@pandeysoni/how-to-create-oauth-1-0a-signature-in-node-js-7d477dead170
// just make sure that each param is fully encoded (ie/ format=json not just the json piece)
import oauthSignature from "oauth-signature";

import {
  Game,
  League,
  Player,
  Roster,
  Team,
  Transaction,
  User,
} from "./resources/index.mjs";

import {
  Games,
  Leagues,
  Players,
  Teams,
  Transactions,
} from "./collections/index.mjs"; // Users } from "./collections";

class YahooFantasy {
  // redirect only needed if you're handling the auth with this lib
  constructor(consumerKey, consumerSecret, tokenCallbackFn, redirectUri) {
    this.CONSUMER_KEY = consumerKey;
    this.CONSUMER_SECRET = consumerSecret;
    this.REDIRECT_URI = redirectUri;

    this.refreshTokenCallback = () => {};

    if (tokenCallbackFn) {
      this.refreshTokenCallback = tokenCallbackFn;
    }

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
    this.transactions = new Transactions(this);

    this.roster = new Roster(this);

    this.user = new User(this);
    // this.users = new Users(); // TODO

    this.yahooUserToken = null;
    this.yahooRefreshToken = null;
  }

  // oauth2 authenticatiocn function -- follow redirect to yahoo login
  auth(res, state = null) {
    const authData = {
      client_id: this.CONSUMER_KEY,
      redirect_uri: this.REDIRECT_URI,
      response_type: "code",
    };

    if (state) {
      authData.state = state;
    }

    const options = {
      hostname: "api.login.yahoo.com",
      port: 443,
      path: `/oauth2/request_auth?${stringify(authData)}`,
      method: "GET",
    };

    const authRequest = https.request(options, (authResponse) => {
      let data;
      authResponse.on("data", (chunk) => {
        // process.stdout.write(d);
        data += chunk;
      });

      authResponse.on("end", () => {
        if (302 === authResponse.statusCode) {
          res.redirect(authResponse.headers.location);
        } else {
          res.send(data);
        }
      });
    });

    authRequest.on("error", (e) => {
      throw new Error(e);
    });

    authRequest.end();
  }

  authCallback(req, cb) {
    const tokenData = {
      client_id: this.CONSUMER_KEY,
      client_secret: this.CONSUMER_SECRET,
      redirect_uri: this.REDIRECT_URI,
      code: req.query.code,
      grant_type: "authorization_code",
    };

    let state = req.query.state;
    if (state) {
      tokenData.state = state;
    }

    const options = {
      hostname: "api.login.yahoo.com",
      port: 443,
      path: `/oauth2/get_token`,
      method: this.POST,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${this.CONSUMER_KEY}:${this.CONSUMER_SECRET}`
        ).toString("base64")}`,
      },
    };

    const tokenRequest = https.request(options, (tokenReponse) => {
      const chunks = [];
      tokenReponse.on("data", (d) => {
        chunks.push(d);
      });

      tokenReponse.on("end", async () => {
        const { access_token, refresh_token } = JSON.parse(
          Buffer.concat(chunks)
        );

        this.yahooUserToken = access_token;
        this.yahooRefreshToken = refresh_token;

        if (this.refreshTokenCallback) {
          // run the callback before moving on
          await this.refreshTokenCallback({
            access_token,
            refresh_token,
          });
        }

        cb(null, { access_token, refresh_token, state });
      });
    });

    tokenRequest.on("error", (e) => {
      cb(e);
    });

    tokenRequest.write(stringify(tokenData));
    tokenRequest.end();
  }

  setUserToken(token) {
    this.yahooUserToken = token;
  }

  setRefreshToken(token) {
    this.yahooRefreshToken = token;
  }

  refreshToken(cb) {
    const refreshData = stringify({
      grant_type: "refresh_token",
      redirect_uri: this.REDIRECT_URI,
      refresh_token: this.yahooRefreshToken,
    });

    const options = {
      hostname: "api.login.yahoo.com",
      port: 443,
      path: "/oauth2/get_token",
      method: this.POST,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${this.CONSUMER_KEY}:${this.CONSUMER_SECRET}`
        ).toString("base64")}`,
      },
    };

    const tokenRequest = https.request(options, (tokenReponse) => {
      const chunks = [];
      tokenReponse.on("data", (d) => {
        chunks.push(d);
      });

      tokenReponse.on("end", async () => {
        const tokenData = JSON.parse(Buffer.concat(chunks));

        this.setUserToken(tokenData.access_token);
        this.setRefreshToken(tokenData.refresh_token);

        if (this.refreshTokenCallback) {
          // run the callback before moving on
          await this.refreshTokenCallback(tokenData);
        }

        cb(null, tokenData);
      });
    });

    tokenRequest.on("error", (e) => {
      cb(e);
    });

    tokenRequest.write(refreshData);
    tokenRequest.end();
  }

  api(...args) {
    const method = args.shift();
    const url = args.shift();
    let postData = false;

    if (args.length && args[0]) {
      postData = args.pop();
    }

    let params = {
      format: "json",
    };

    const headers = {};

    if (!this.yahooUserToken) {
      params = {
        ...params,
        oauth_consumer_key: this.CONSUMER_KEY,
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: Math.floor(Date.now() / 1000),
        oauth_nonce: crypto.randomBytes(12).toString("base64"),
        oauth_version: "1.0",
      };

      const signature = oauthSignature.generate(
        method,
        url,
        params,
        this.CONSUMER_SECRET
      );

      params = {
        ...params,
        oauth_signature: decodeURIComponent(signature),
      };
    } else {
      headers.Authorization = `Bearer ${this.yahooUserToken}`;
    }

    const options = {
      hostname: "fantasysports.yahooapis.com",
      path: `${url.replace(
        "https://fantasysports.yahooapis.com",
        ""
      )}?${stringify(params)}`,
      method: method,
      headers,
    };

    return new Promise((resolve, reject) => {
      https
        .request(options, (resp) => {
          let data = "";

          resp.on("data", (chunk) => {
            data += chunk;
          });

          resp.on("end", () => {
            data = JSON.parse(data);

            if (data.error) {
              if (/"token_expired"/i.test(data.error.description)) {
                return this.refreshToken((err, data) => {
                  if (err) {
                    return reject(err);
                  }

                  return resolve(this.api(method, url, postData));
                });
              } else {
                return reject(data.error);
              }
            }

            return resolve(data);
          });
        })
        .on("error", (err) => {
          return reject(err.message);
        })
        .end();
    });
  }
}

export default YahooFantasy;
