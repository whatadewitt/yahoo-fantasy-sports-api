var YahooFantasy = require("../index.js");
var nock = require("nock");

describe("resource: teamResource", function() {
  var yf = new YahooFantasy("Y!APPLICATION_KEY", "Y!APPLICATION_SECRET"),
    team = yf.team;

  it("should be defined", function() {
    expect(team).not.toBe(null);
  });

  // functions
  it("should have a meta function", function() {
    expect(team.meta).not.toBe(null);
  });

  it("should have a stats function", function() {
    expect(team.stats).not.toBe(null);
  });

  it("should have a standings function", function() {
    expect(team.standings).not.toBe(null);
  });

  it("should have an roster function", function() {
    expect(team.roster).not.toBe(null);
  });

  it("should have a draft_results function", function() {
    expect(team.draft_results).not.toBe(null);
  });

  it("should have a matchups function", function() {
    expect(team.matchups).not.toBe(null);
  });

  // building urls
  beforeEach(function() {
    yf.setUserToken("testusertoken==");
    spyOn(yf, "api").and.callThrough();
  });

  // meta
  it("should build a proper url to retrieve metadata via a team key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/team/328.l.34014.t.1/metadata?format=json")
      .reply(200, require("./nock-data/teamMeta"));

    team.meta("328.l.34014.t.1", done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/team/328.l.34014.t.1/metadata"
    );
  });

  // stats
  it("should build a proper url to retrieve team stats via a team key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/team/328.l.34014.t.1/stats?format=json")
      .reply(200, require("./nock-data/teamStats"));

    team.stats("328.l.34014.t.1", done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/team/328.l.34014.t.1/stats"
    );
  });

  // standings
  it("should build a proper url to retrieve team standings via a team key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/team/328.l.34014.t.1/standings?format=json")
      .reply(200, require("./nock-data/teamStandings"));

    team.standings("328.l.34014.t.1", done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/team/328.l.34014.t.1/standings"
    );
  });

  // roster
  it("should build a proper url to retrieve team ownership in a given league via a team key and a league key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/team/328.l.34014.t.1/roster?format=json")
      .reply(200, require("./nock-data/teamRoster"));

    team.roster("328.l.34014.t.1", done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/team/328.l.34014.t.1/roster"
    );
  });

  // draft_results
  it("should build a proper url to retrieve team draft analysis via a team key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/team/328.l.34014.t.1/draftresults?format=json")
      .reply(200, require("./nock-data/teamDraftResults"));

    team.draft_results("328.l.34014.t.1", done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/team/328.l.34014.t.1/draftresults"
    );
  });

  // matchups
  it("should build a proper url to retrieve team draft analysis via a team key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/team/328.l.34014.t.1/matchups?format=json")
      .reply(200, require("./nock-data/teamMatchups"));

    team.matchups("328.l.34014.t.1", done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/team/328.l.34014.t.1/matchups"
    );
  });
});
