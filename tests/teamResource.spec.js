const YahooFantasy = require("../index.js");
const nock = require("nock");

describe("resource: teamResource", function () {
  const yf = new YahooFantasy("Y!APPLICATION_KEY", "Y!APPLICATION_SECRET"),
    team = yf.team;

  it("should be defined", function () {
    expect(team).not.toBe(null);
  });

  it("should have a meta function", function () {
    expect(team.meta).not.toBe(null);
  });

  it("should have a stats function", function () {
    expect(team.stats).not.toBe(null);
  });

  it("should have a standings function", function () {
    expect(team.standings).not.toBe(null);
  });

  it("should have an roster function", function () {
    expect(team.roster).not.toBe(null);
  });

  it("should have a draft_results function", function () {
    expect(team.draft_results).not.toBe(null);
  });

  it("should have a matchups function", function () {
    expect(team.matchups).not.toBe(null);
  });

  beforeEach(function () {
    yf.setUserToken("testusertoken==");
    spyOn(yf, "api").and.callThrough();
  });

  it("should build a proper url to retrieve metadata via a team key", function () {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/team/328.l.34014.t.1/metadata?format=json")
      .reply(200, require("./nock-data/teamMeta"));

    const result = team.meta("328.l.34014.t.1");

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/team/328.l.34014.t.1/metadata",
    );
    return result;
  });

  it("should build a proper url to retrieve team stats via a team key", function () {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/team/328.l.34014.t.1/stats?format=json")
      .reply(200, require("./nock-data/teamStats"));

    const result = team.stats("328.l.34014.t.1");

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/team/328.l.34014.t.1/stats",
    );
    return result;
  });

  it("should build a proper url to retrieve weekly team stats", function () {
    nock("https://fantasysports.yahooapis.com")
      .get(
        "/fantasy/v2/team/328.l.34014.t.1/stats;type=week;week=3?format=json",
      )
      .reply(200, require("./nock-data/teamStats"));

    const result = team.stats("328.l.34014.t.1", 3);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/team/328.l.34014.t.1/stats;type=week;week=3",
    );
    return result;
  });

  it("should build a proper url to retrieve date-based team stats", function () {
    nock("https://fantasysports.yahooapis.com")
      .get(
        "/fantasy/v2/team/328.l.34014.t.1/stats;type=date;date=2014-04-01?format=json",
      )
      .reply(200, require("./nock-data/teamStats"));

    const result = team.stats("328.l.34014.t.1", "2014-04-01");

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/team/328.l.34014.t.1/stats;type=date;date=2014-04-01",
    );
    return result;
  });

  it("should build a proper url to retrieve team standings via a team key", function () {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/team/328.l.34014.t.1/standings?format=json")
      .reply(200, require("./nock-data/teamStandings"));

    const result = team.standings("328.l.34014.t.1");

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/team/328.l.34014.t.1/standings",
    );
    return result;
  });

  it("should build a proper url to retrieve team ownership in a given league via a team key and a league key", function () {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/team/328.l.34014.t.1/roster?format=json")
      .reply(200, require("./nock-data/teamRoster"));

    const result = team.roster("328.l.34014.t.1");

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/team/328.l.34014.t.1/roster",
    );
    return result;
  });

  it("should build a proper url to retrieve team draft analysis via a team key", function () {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/team/328.l.34014.t.1/draftresults?format=json")
      .reply(200, require("./nock-data/teamDraftResults"));

    const result = team.draft_results("328.l.34014.t.1");

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/team/328.l.34014.t.1/draftresults",
    );
    return result;
  });

  it("should build a proper url to retrieve team draft analysis via a team key", function () {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/team/328.l.34014.t.1/matchups?format=json")
      .reply(200, require("./nock-data/teamMatchups"));

    const result = team.matchups("328.l.34014.t.1");

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/team/328.l.34014.t.1/matchups",
    );
    return result;
  });
});
