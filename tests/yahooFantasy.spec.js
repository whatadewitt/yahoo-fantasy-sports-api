const YahooFantasy = require("../index.js");
const nock = require("nock");

describe("YahooFantasy error handling", function () {
  afterEach(function () {
    nock.cleanAll();
  });

  describe("api(): token refresh retry", function () {
    it("retries once after refresh, then surfaces token_expired", function () {
      const yf = new YahooFantasy("Y!KEY", "Y!SECRET");
      yf.setUserToken("expiredtoken==");
      yf.setRefreshToken("refreshtoken==");

      let apiHits = 0;
      let refreshHits = 0;

      nock("https://fantasysports.yahooapis.com")
        .persist()
        .get("/fantasy/v2/game/nfl?format=json")
        .reply(401, () => {
          apiHits++;
          return {
            error: {
              name: "YahooAuthError",
              description:
                'Please provide valid credentials. OAuth oauth_problem="token_expired", realm="yahooapis.com"',
            },
          };
        });

      nock("https://api.login.yahoo.com")
        .persist()
        .post("/oauth2/get_token")
        .reply(200, () => {
          refreshHits++;
          return {
            access_token: "stillexpiredtoken==",
            refresh_token: "refreshtoken==",
          };
        });

      return yf
        .api(yf.GET, "https://fantasysports.yahooapis.com/fantasy/v2/game/nfl")
        .then(
          () => {
            throw new Error("expected api() to reject");
          },
          (err) => {
            expect(err.message).toContain("token_expired");
            expect(apiHits).toBe(2);
            expect(refreshHits).toBe(1);
          }
        );
    });
  });

  describe("api(): error detail surfacing", function () {
    function failingCall(status, body) {
      const yf = new YahooFantasy("Y!KEY", "Y!SECRET");

      nock("https://fantasysports.yahooapis.com")
        .get(/\/fantasy\/v2\/game\/mlb\.l\.3555\/metadata/)
        .reply(status, body);

      return yf
        .api("GET", "https://fantasysports.yahooapis.com/fantasy/v2/game/mlb.l.3555/metadata")
        .then(
          () => Promise.reject(new Error("expected api() to reject")),
          (e) => e,
        );
    }

    it("surfaces the Yahoo description, status, code and path", function () {
      return failingCall(401, {
        error: {
          "xml:lang": "en-us",
          "yahoo:uri":
            "/fantasy/v2/game/mlb.l.3555/metadata?format=json&amp;oauth_consumer_key=SECRETKEY&amp;oauth_signature=SECRETSIG",
          name: "YahooAuthError",
          description: "This application is not authorized to perform this action.",
          detail: "",
        },
      }).then((e) => {
        expect(e.name).toBe("YahooFantasyError");
        expect(e.description).toBe(
          "This application is not authorized to perform this action.",
        );
        expect(e.statusCode).toBe(401);
        expect(e.code).toBe("YahooAuthError");
        expect(e.method).toBe("GET");
        expect(e.message).toContain(
          "This application is not authorized to perform this action.",
        );
        expect(e.message).toContain("HTTP 401");
        expect(e.message).toContain("GET /fantasy/v2/game/mlb.l.3555/metadata");
      });
    });

    it("redacts oauth credentials from details and response body", function () {
      return failingCall(401, {
        error: {
          "yahoo:uri":
            "/fantasy/v2/game/mlb.l.3555/metadata?format=json&amp;oauth_consumer_key=SECRETKEY&amp;oauth_signature=SECRETSIG",
          description: "This application is not authorized to perform this action.",
        },
      }).then((e) => {
        const serialized = JSON.stringify(e.toJSON()) + e.responseBody;
        expect(serialized).not.toContain("SECRETKEY");
        expect(serialized).not.toContain("SECRETSIG");
        expect(e.details["yahoo:uri"]).toContain("oauth_consumer_key=REDACTED");
        expect(e.responseBody).toContain("oauth_signature=REDACTED");
      });
    });

    it("gives a non-empty message for string-shaped oauth errors", function () {
      return failingCall(401, {
        error: "invalid_token",
        error_description: "The access token is expired",
      }).then((e) => {
        expect(e.message).not.toBe("");
        expect(e.description).toBe("The access token is expired");
        expect(e.code).toBe("invalid_token");
        expect(e.statusCode).toBe(401);
      });
    });

    it("fails loudly on a non-JSON error body instead of a bare parse error", function () {
      return failingCall(503, "<html><body>Service Unavailable</body></html>").then(
        (e) => {
          expect(e.name).toBe("YahooFantasyError");
          expect(e.statusCode).toBe(503);
          expect(e.message).toContain("non-JSON");
          expect(e.responseBody).toContain("Service Unavailable");
        },
      );
    });

    it("throws on a 4xx whose JSON body has no error key", function () {
      return failingCall(429, { message: "slow down" }).then((e) => {
        expect(e.name).toBe("YahooFantasyError");
        expect(e.statusCode).toBe(429);
      });
    });

    it("preserves the network error code", function () {
      const yf = new YahooFantasy("Y!KEY", "Y!SECRET");
      const netErr = new Error("getaddrinfo ENOTFOUND");
      netErr.code = "ENOTFOUND";

      nock("https://fantasysports.yahooapis.com")
        .get(/\/fantasy\/v2\/game\/nfl/)
        .replyWithError(netErr);

      return yf
        .api("GET", "https://fantasysports.yahooapis.com/fantasy/v2/game/nfl")
        .then(
          () => Promise.reject(new Error("expected api() to reject")),
          (e) => {
            expect(e.code).toBe("ENOTFOUND");
            expect(e.message).toContain("ENOTFOUND");
            expect(e.method).toBe("GET");
          },
        );
    });
  });

  describe("refreshToken(): failure surfacing", function () {
    it("rejects instead of silently setting an undefined token", function () {
      const yf = new YahooFantasy("Y!KEY", "Y!SECRET");
      yf.setUserToken("expiredtoken==");
      yf.setRefreshToken("badrefresh==");

      nock("https://fantasysports.yahooapis.com")
        .persist()
        .get("/fantasy/v2/game/nfl?format=json")
        .reply(401, {
          error: {
            name: "YahooAuthError",
            description:
              'Please provide valid credentials. OAuth oauth_problem="token_expired"',
          },
        });

      nock("https://api.login.yahoo.com")
        .post("/oauth2/get_token")
        .reply(400, {
          error: "invalid_grant",
          error_description: "Invalid refresh token",
        });

      return yf
        .api("GET", "https://fantasysports.yahooapis.com/fantasy/v2/game/nfl")
        .then(
          () => Promise.reject(new Error("expected api() to reject")),
          (e) => {
            expect(e.message).toContain("Invalid refresh token");
            expect(yf.yahooUserToken).toBe("expiredtoken==");
          },
        );
    });
  });

  describe("auth(): request error", function () {
    it("responds via res.send instead of throwing", function () {
      const yf = new YahooFantasy("Y!KEY", "Y!SECRET");

      nock("https://api.login.yahoo.com")
        .get(/\/oauth2\/request_auth/)
        .replyWithError("socket hang up");

      return new Promise((resolve) => {
        const res = {
          redirect: () => resolve("unexpected redirect"),
          send: (msg) => resolve(msg),
        };
        yf.auth(res);
      }).then((msg) => {
        expect(String(msg)).toContain("socket hang up");
      });
    });
  });
});
