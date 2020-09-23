import YahooFantasy from "../YahooFantasy.mjs";
var nock = require("nock");

describe("resource: leagueResource", function() {
  var yf = new YahooFantasy("Y!APPLICATION_KEY", "Y!APPLICATION_SECRET"),
    league = yf.league;

  it("should be defined", function() {
    expect(league).not.toBe(null);
  });

  // functions
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

  // building urls
  beforeEach(function() {
    yf.setUserToken("testusertoken==");
    spyOn(yf, "api").and.callThrough();
  });

  // meta
  it("should build a proper url to retrieve metadata via a league key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/league/328.l.34014/metadata?format=json")
      .reply(200, require("./nock-data/leagueMeta").meta);

    league.meta("328.l.34014", done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/league/328.l.34014/metadata"
    );
  });

  // settings
  it("should build a proper url to retrieve settings via a league key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/league/328.l.34014/settings?format=json")
      .reply(200, require("./nock-data/leagueSettings"));

    league.settings("328.l.34014", done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/league/328.l.34014/settings"
    );
  });

  // standings
  it("should build a proper url to retrieve standings via a league key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/league/328.l.34014/standings?format=json")
      .reply(200, require("./nock-data/leagueStandings"));

    league.standings("328.l.34014", done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/league/328.l.34014/standings"
    );
  });

  // scoreboard
  it("should build a proper url to retrieve scoreboard via a league key", function(done) {
    var mockLeagueScoreboard = require("./nock-data/leagueScoreboard");
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/league/328.l.34014/scoreboard?format=json")
      .reply(200, mockLeagueScoreboard);

    league.scoreboard("328.l.34014", function(e, data) {
      expect(data.league_key).toEqual(
        mockLeagueScoreboard.fantasy_content.league[0].league_key
      );
      expect(data.scoreboard.matchups[0].teams[0].name).toEqual(
        mockLeagueScoreboard.fantasy_content.league[1].scoreboard[0].matchups[0]
          .matchup[0].teams[0].team[0][2].name
      );

      done();
    });

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/league/328.l.34014/scoreboard"
    );
  });

  // teams
  it("should build a proper url to retrieve teams via a league key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/league/328.l.34014/teams?format=json")
      .reply(200, require("./nock-data/leagueTeams"));

    league.teams("328.l.34014", done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/league/328.l.34014/teams"
    );
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

  // draft_results
  it("should build a proper url to retrieve draft_results via a league key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/league/328.l.34014/draftresults?format=json")
      .reply(200, require("./nock-data/leagueDraftResults"));

    league.draft_results("328.l.34014", done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/league/328.l.34014/draftresults"
    );
  });

  // transactions
  it("should build a proper url to retrieve transactions via a league key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/league/328.l.34014/transactions?format=json")
      .reply(200, require("./nock-data/leagueTransaction"));

    league.transactions("328.l.34014", done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/league/328.l.34014/transactions"
    );
  });
});
