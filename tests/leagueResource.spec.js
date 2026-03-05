const YahooFantasy = require("../index.js");
const nock = require("nock");

describe("resource: leagueResource", function() {
  const yf = new YahooFantasy("Y!APPLICATION_KEY", "Y!APPLICATION_SECRET"),
    league = yf.league;

  it("should be defined", function() {
    expect(league).not.toBe(null);
  });

  it("should have a meta function", function() {
    expect(league.meta).not.toBe(null);
  });

  it("should have a settings function", function() {
    expect(league.settings).not.toBe(null);
  });

  it("should have a standings function", function() {
    expect(league.standings).not.toBe(null);
  });

  it("should have a scoreboard function", function() {
    expect(league.scoreboard).not.toBe(null);
  });

  it("should have a teams function", function() {
    expect(league.teams).not.toBe(null);
  });

  it("should have a players function", function() {
    expect(league.players).not.toBe(null);
  });

  it("should have a draft_results function", function() {
    expect(league.draft_results).not.toBe(null);
  });

  it("should have a transactions function", function() {
    expect(league.transactions).not.toBe(null);
  });

  beforeEach(function() {
    yf.setUserToken("testusertoken==");
    spyOn(yf, "api").and.callThrough();
  });

  it("should build a proper url to retrieve metadata via a league key", function() {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/league/328.l.34014/metadata?format=json")
      .reply(200, require("./nock-data/leagueMeta").meta);

    const result = league.meta("328.l.34014");

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/league/328.l.34014/metadata"
    );

    return result;
  });

  it("should build a proper url to retrieve settings via a league key", function() {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/league/328.l.34014/settings?format=json")
      .reply(200, require("./nock-data/leagueSettings"));

    const result = league.settings("328.l.34014");

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/league/328.l.34014/settings"
    );

    return result;
  });

  it("should build a proper url to retrieve standings via a league key", function() {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/league/328.l.34014/standings?format=json")
      .reply(200, require("./nock-data/leagueStandings"));

    const result = league.standings("328.l.34014");

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/league/328.l.34014/standings"
    );

    return result;
  });

  it("should build a proper url to retrieve scoreboard via a league key", function() {
    const mockLeagueScoreboard = require("./nock-data/leagueScoreboard");
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/league/328.l.34014/scoreboard?format=json")
      .reply(200, mockLeagueScoreboard);

    const result = league.scoreboard("328.l.34014").then(data => {
      expect(data.league_key).toEqual("328.l.34014");
      expect(data.scoreboard.matchups[0].teams[0].name).toEqual(
        mockLeagueScoreboard.fantasy_content.league[1].scoreboard[0].matchups[0]
          .matchup[0].teams[0].team[0][2].name
      );
    });

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/league/328.l.34014/scoreboard"
    );

    return result;
  });

  it("should build a proper url to retrieve teams via a league key", function() {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/league/328.l.34014/teams?format=json")
      .reply(200, require("./nock-data/leagueTeams"));

    const result = league.teams("328.l.34014");

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/league/328.l.34014/teams"
    );

    return result;
  });

  // // players
  // it("should build a proper url to retrieve players via a league key", function(done) {
  //   nock("https://fantasysports.yahooapis.com")
  //     .get("/fantasy/v2/league/328.l.34014/players?format=json")
  //     .reply(200, {});

  //   league.players("328.l.34014", done);

  //   expect(yf.api).toHaveBeenCalledWith(
  //     "GET",
  //     "https://fantasysports.yahooapis.com/fantasy/v2/league/328.l.34014/players"
  //   );
  // });

  it("should build a proper url to retrieve draft_results via a league key", function() {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/league/328.l.34014/draftresults?format=json")
      .reply(200, require("./nock-data/leagueDraftResults"));

    const result = league.draft_results("328.l.34014");

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/league/328.l.34014/draftresults"
    );

    return result;
  });

  it("should build a proper url to retrieve transactions via a league key", function() {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/league/328.l.34014/transactions?format=json")
      .reply(200, require("./nock-data/leagueTransaction"));

    const result = league.transactions("328.l.34014");

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/league/328.l.34014/transactions"
    );

    return result;
  });
});
