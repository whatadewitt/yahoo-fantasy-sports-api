import YahooFantasy from "../YahooFantasy.mjs";
var nock = require("nock");

describe("collection: gamesCollection", function() {
  var yf = new YahooFantasy("Y!APPLICATION_KEY", "Y!APPLICATION_SECRET"),
    games = yf.games;

  it("should be defined", function() {
    expect(games).not.toBe(null);
  });

  // functions
  it("should have a fetch function", function() {
    expect(games.fetch).not.toBe(null);
  });

  it("should have a user function", function() {
    expect(games.user).not.toBe(null);
  });

  it("should have a userFetch function", function() {
    expect(games.userFetch).not.toBe(null);
  });

  // building urls
  beforeEach(function() {
    yf.setUserToken("testuser.token==");
    spyOn(yf, "api").and.callThrough();
  });

  // fetch
  it("should build a proper url to retrieve metadata via a numeric game key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/games?format=json")
      .reply(200, { fantasy_content: { games: [] } });

    games.fetch(328, done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/games"
    );
  });
});
