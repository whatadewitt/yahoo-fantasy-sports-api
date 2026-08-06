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
