const YahooFantasy = require("../index.js");
const nock = require("nock");

describe("resource: rosterResource", function() {
  const yf = new YahooFantasy("Y!APPLICATION_KEY", "Y!APPLICATION_SECRET"),
    roster = yf.roster;

  it("should be defined", function() {
    expect(roster).not.toBe(null);
  });

  it("should have a players function", function() {
    expect(roster.players).not.toBe(null);
  });

  beforeEach(function() {
    yf.setUserToken("testusertoken==");
    spyOn(yf, "api").and.callThrough();
  });

  it("should build a proper url to retrieve players on a team", function() {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/team/328.l.34014.t.1/roster?format=json")
      .reply(200, require("./nock-data/teamRoster"));

    const result = roster.players("328.l.34014.t.1");

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/team/328.l.34014.t.1/roster"
    );
    return result;
  });
});

describe("resource: rosterResource.update", function () {
  const yf = new YahooFantasy("Y!KEY", "Y!SECRET");
  const roster = yf.roster;

  beforeEach(function () {
    yf.setUserToken("testusertoken==");
    spyOn(yf, "api").and.callThrough();
  });

  it("PUTs the roster XML for week coverage", function () {
    const expected =
      "<?xml version='1.0'?><fantasy_content><roster>" +
      "<coverage_type>week</coverage_type><week>3</week><players>" +
      "<player><player_key>nfl.p.1</player_key><position>WR</position></player>" +
      "</players></roster></fantasy_content>";

    nock("https://fantasysports.yahooapis.com")
      .put("/fantasy/v2/team/nfl.l.1.t.1/roster?format=json", expected)
      .reply(200, { fantasy_content: {} });

    const result = roster.update(
      "nfl.l.1.t.1",
      { week: 3 },
      [{ player_key: "nfl.p.1", position: "WR" }]
    );

    expect(yf.api).toHaveBeenCalledWith(
      "PUT",
      "https://fantasysports.yahooapis.com/fantasy/v2/team/nfl.l.1.t.1/roster",
      expected
    );
    return result;
  });

  it("invokes the callback with data on success", function (done) {
    nock("https://fantasysports.yahooapis.com")
      .put("/fantasy/v2/team/nfl.l.1.t.2/roster?format=json")
      .reply(200, { fantasy_content: {} });

    roster.update(
      "nfl.l.1.t.2",
      { week: 3 },
      [{ player_key: "nfl.p.2", position: "QB" }],
      function (err, data) {
        expect(err).toBeNull();
        expect(data).toEqual({ fantasy_content: {} });
        done();
      }
    );
  });
});
