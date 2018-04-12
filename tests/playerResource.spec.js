var YahooFantasy = require("../index.js");
var nock = require("nock");

describe("resource: playerResource", function() {
  var yf = new YahooFantasy("Y!APPLICATION_KEY", "Y!APPLICATION_SECRET"),
    player = yf.player;

  it("should be defined", function() {
    expect(player).not.toBe(null);
  });

  // functions
  it("should have a meta function", function() {
    expect(player.meta).not.toBe(null);
  });

  it("should have a stats function", function() {
    expect(player.stats).not.toBe(null);
  });

  it("should have a percent_owned function", function() {
    expect(player.percent_owned).not.toBe(null);
  });

  it("should have an ownership function", function() {
    expect(player.ownership).not.toBe(null);
  });

  it("should have a teams function", function() {
    expect(player.teams).not.toBe(null);
  });

  it("should have a draft_analysis function", function() {
    expect(player.draft_analysis).not.toBe(null);
  });

  // building urls
  beforeEach(function() {
    spyOn(yf, "api").and.callThrough();
  });

  // meta
  it("should build a proper url to retrieve metadata via a player key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/player/328.p.6619/metadata?format=json")
      .reply(200, require("./nock-data/playerMeta"));

    player.meta("328.p.6619", done);

    expect(yf.api).toHaveBeenCalledWith(
      {
        method: "GET",
        url: "https://fantasysports.yahooapis.com/fantasy/v2/player/328.p.6619/metadata?format=json",
        responseMapper: jasmine.any(Function)
      },
      jasmine.any(Function));
  });

  // stats
  it("should build a proper url to retrieve player stats via a player key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/player/328.p.6619/stats?format=json")
      .reply(200, require("./nock-data/playerStats"));

    player.stats("328.p.6619", done);

    expect(yf.api).toHaveBeenCalledWith(
      {
        method: "GET",
        url: "https://fantasysports.yahooapis.com/fantasy/v2/player/328.p.6619/stats?format=json",
        responseMapper: jasmine.any(Function)
      },
      jasmine.any(Function));
  });

  // percent_owned
  it("should build a proper url to retrieve player ownership percentage via a player key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/player/328.p.6619/percent_owned?format=json")
      .reply(200, require("./nock-data/playerPercentOwned"));

    player.percent_owned("328.p.6619", done);

    expect(yf.api).toHaveBeenCalledWith(
      {
        method: "GET",
        url: "https://fantasysports.yahooapis.com/fantasy/v2/player/328.p.6619/percent_owned?format=json",
        responseMapper: jasmine.any(Function)
      },
      jasmine.any(Function));
  });

  // ownership
  it("should build a proper url to retrieve player ownership in a given league via a player key and a league key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get(
        "/fantasy/v2/league/328.l.34014/players;player_keys=328.p.6619/ownership?format=json"
      )
      .reply(200, require("./nock-data/playerOwnershipOwned"));

    player.ownership("328.p.6619", "328.l.34014", done);

    expect(yf.api).toHaveBeenCalledWith(
      {
        method: "GET",
        url: "https://fantasysports.yahooapis.com/fantasy/v2/league/328.l.34014/players;player_keys=328.p.6619/ownership?format=json",
        responseMapper: jasmine.any(Function)
      },
      jasmine.any(Function));
  });

  // should fail without league key

  // draft_analysis
  it("should build a proper url to retrieve player draft analysis via a player key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/player/328.p.6619/draft_analysis?format=json")
      .reply(200, require("./nock-data/playerDraftAnalysis"));

    player.draft_analysis("328.p.6619", done);

    expect(yf.api).toHaveBeenCalledWith(
      {
        method: "GET",
        url: "https://fantasysports.yahooapis.com/fantasy/v2/player/328.p.6619/draft_analysis?format=json",
        responseMapper: jasmine.any(Function)
      },
      jasmine.any(Function));
  });
});
