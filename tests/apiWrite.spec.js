const YahooFantasy = require("../index.js");
const nock = require("nock");

describe("api(): write methods", function () {
  const yf = new YahooFantasy("Y!KEY", "Y!SECRET");

  beforeEach(function () {
    yf.setUserToken("testusertoken==");
  });

  it("exposes PUT and DELETE method constants", function () {
    expect(yf.PUT).toBe("PUT");
    expect(yf.DELETE).toBe("DELETE");
  });

  it("exposes auth as a public OAuth method", function () {
    expect(typeof yf.auth).toBe("function");
  });

  it("sends an XML body with Content-Type for PUT", function () {
    const body = "<?xml version='1.0'?><fantasy_content></fantasy_content>";
    let sentCT;
    nock("https://fantasysports.yahooapis.com", {
      reqheaders: {
        "content-type": (v) => {
          sentCT = v;
          return true;
        },
      },
    })
      .put("/fantasy/v2/team/x/roster?format=json", body)
      .reply(200, { ok: true });

    return yf
      .api(
        yf.PUT,
        "https://fantasysports.yahooapis.com/fantasy/v2/team/x/roster",
        body,
      )
      .then((res) => {
        expect(res.ok).toBe(true);
        expect(sentCT).toBe("application/xml");
      });
  });

  it("sends a DELETE with no body", function () {
    nock("https://fantasysports.yahooapis.com")
      .delete("/fantasy/v2/transaction/y?format=json")
      .reply(200, { ok: true });

    return yf
      .api(
        yf.DELETE,
        "https://fantasysports.yahooapis.com/fantasy/v2/transaction/y",
      )
      .then((res) => expect(res.ok).toBe(true));
  });
});
