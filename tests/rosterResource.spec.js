var YahooFantasy = require("../index.js");
var nock = require("nock");

describe("resource: rosterResource", function() {
  var yf = new YahooFantasy("Y!APPLICATION_KEY", "Y!APPLICATION_SECRET"),
    roster = yf.roster;

  it("should be defined", function() {
    expect(roster).not.toBe(null);
  });

  // functions
  it("should have a players function", function() {
    expect(roster.players).not.toBe(null);
  });

  // building urls
  beforeEach(function() {
    yf.setUserToken("testusertoken==");
    spyOn(yf, "api").and.callThrough();
  });

  // meta
  it("should build a proper url to retrieve players on a team", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/team/328.l.34014.t.1/roster?format=json")
      .reply(200, require("./nock-data/teamRoster"));

    roster.players("328.l.34014.t.1", done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/team/328.l.34014.t.1/roster"
    );
  });
});
