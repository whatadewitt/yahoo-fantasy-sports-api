const YahooFantasy = require("../index.js");
const nock = require("nock");

describe("collection: gamesCollection", function() {
  const yf = new YahooFantasy("Y!APPLICATION_KEY", "Y!APPLICATION_SECRET"),
    games = yf.games;

  it("should be defined", function() {
    expect(games).not.toBe(null);
  });

  it("should have a fetch function", function() {
    expect(games.fetch).not.toBe(null);
  });

  it("should have a user function", function() {
    expect(games.user).not.toBe(null);
  });

  beforeEach(function() {
    yf.setUserToken("testuser.token==");
    spyOn(yf, "api").and.callThrough();
  });

  it("should build a proper url to retrieve metadata via a numeric game key", function() {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/games;game_keys=328?format=json")
      .reply(200, { fantasy_content: { games: [] } });

    const result = games.fetch(328);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/games;game_keys=328"
    );
    return result;
  });
});
