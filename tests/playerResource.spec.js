const YahooFantasy = require("../index.js");
const nock = require("nock");

describe("resource: playerResource", function() {
  const yf = new YahooFantasy("Y!APPLICATION_KEY", "Y!APPLICATION_SECRET"),
    player = yf.player;

  it("should be defined", function() {
    expect(player).not.toBe(null);
  });

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

  beforeEach(function() {
    yf.setUserToken("testusertoken==");
    spyOn(yf, "api").and.callThrough();
  });

  it("should build a proper url to retrieve metadata via a player key", function() {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/player/328.p.6619/metadata?format=json")
      .reply(200, require("./nock-data/playerMeta"));

    const result = player.meta("328.p.6619");

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/player/328.p.6619/metadata"
    );

    return result;
  });

  it("should build a proper url to retrieve player stats via a player key", function() {
    const mockPlayerStats = require("./nock-data/playerStats");
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/player/328.p.6619/stats?format=json")
      .reply(200, mockPlayerStats);

    const result = player.stats("328.p.6619").then((data) => {
      expect(data.stats.coverage_type).toEqual(
        mockPlayerStats.fantasy_content.player[1].player_stats[0].coverage_type
      );
    });

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/player/328.p.6619/stats"
    );

    return result;
  });

  it("should build a proper url to retrieve player ownership percentage via a player key", function() {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/player/328.p.6619/percent_owned?format=json")
      .reply(200, require("./nock-data/playerPercentOwned"));

    const result = player.percent_owned("328.p.6619");

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/player/328.p.6619/percent_owned"
    );

    return result;
  });

  it("should build a proper url to retrieve player ownership in a given league via a player key and a league key", function() {
    nock("https://fantasysports.yahooapis.com")
      .get(
        "/fantasy/v2/league/328.l.34014/players;player_keys=328.p.6619/ownership?format=json"
      )
      .reply(200, require("./nock-data/playerOwnershipOwned"));

    const result = player.ownership("328.p.6619", "328.l.34014");

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/league/328.l.34014/players;player_keys=328.p.6619/ownership"
    );

    return result;
  });

  it("should build a proper url to retrieve player draft analysis via a player key", function() {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/player/328.p.6619/draft_analysis?format=json")
      .reply(200, require("./nock-data/playerDraftAnalysis"));

    const result = player.draft_analysis("328.p.6619");

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/player/328.p.6619/draft_analysis"
    );

    return result;
  });
});
