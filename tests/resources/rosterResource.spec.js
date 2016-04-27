var YahooFantasy = require('../../index.js');
var nock = require('nock');

describe ("resource: rosterResource", function() {
  var yf = new YahooFantasy(
    'Y!APPLICATION_KEY',
    'Y!APPLICATION_SECRET')
    , roster = yf.roster;

  it ("should be defined", function() {
    expect(roster).not.toBe(null);
  });

  // functions
  it ("should have a players function", function() {
    expect(roster.players).not.toBe(null);
  });

  // building urls
  beforeEach(function() {
    spyOn(yf, "api").andCallThrough();
  });

  // meta
  it ("should build a proper url to retrieve players on a team", function() {
    nock('http://fantasysports.yahooapis.com')
      .get("/fantasy/v2/team/328.l.34014.t.1/roster/players?format=json")
      .reply(200, {});

    roster.players('328.l.34014.t.1', null);

    expect(yf.api)
      .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/team/328.l.34014.t.1/roster/players?format=json");
  });
});
