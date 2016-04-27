var YahooFantasy = require('../../index.js');
var nock = require('nock');

describe ("resource: teamResource", function() {
  var yf = new YahooFantasy(
    'Y!APPLICATION_KEY',
    'Y!APPLICATION_SECRET')
    , team = yf.team;

  it ("should be defined", function() {
    expect(team).not.toBe(null);
  });

  // functions
  it ("should have a meta function", function() {
    expect(team.meta).not.toBe(null);
  });

  it ("should have a stats function", function() {
    expect(team.stats).not.toBe(null);
  });

  it ("should have a standings function", function() {
    expect(team.standings).not.toBe(null);
  });

  it ("should have an roster function", function() {
    expect(team.roster).not.toBe(null);
  });

  it ("should have a draft_results function", function() {
    expect(team.draft_results).not.toBe(null);
  });

  it ("should have a matchups function", function() {
    expect(team.matchups).not.toBe(null);
  });

  // building urls
  beforeEach(function() {
    spyOn(yf, "api").andCallThrough();
  });

  // meta
  it ("should build a proper url to retrieve metadata via a team key", function() {
    nock('http://fantasysports.yahooapis.com')
      .get("/fantasy/v2/team/328.l.34014.t.1/metadata?format=json")
      .reply(200, {});

    team.meta('328.l.34014.t.1', null);

    expect(yf.api)
      .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/team/328.l.34014.t.1/metadata?format=json");
  });

  // stats
  it ("should build a proper url to retrieve team stats via a team key", function() {
    nock('http://fantasysports.yahooapis.com')
      .get("/fantasy/v2/team/328.l.34014.t.1/stats?format=json")
      .reply(200, {});

    team.stats('328.l.34014.t.1', null);

    expect(yf.api)
      .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/team/328.l.34014.t.1/stats?format=json");
  });

  // standings
  it ("should build a proper url to retrieve team standings via a team key", function() {
    nock('http://fantasysports.yahooapis.com')
      .get("/fantasy/v2/team/328.l.34014.t.1/standings?format=json")
      .reply(200, {});

    team.standings('328.l.34014.t.1', null);

    expect(yf.api)
      .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/team/328.l.34014.t.1/standings?format=json");
  });

  // roster
  it ("should build a proper url to retrieve team ownership in a given league via a team key and a league key", function() {
    nock('http://fantasysports.yahooapis.com')
      .get("/fantasy/v2/team/328.l.34014.t.1/roster?format=json")
      .reply(200, {});

    team.roster('328.l.34014.t.1');

    expect(yf.api)
      .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/team/328.l.34014.t.1/roster?format=json");
  });

  // draft_results
  it ("should build a proper url to retrieve team draft analysis via a team key", function() {
    nock('http://fantasysports.yahooapis.com')
      .get("/fantasy/v2/team/328.l.34014.t.1/draftresults?format=json")
      .reply(200, {});

    team.draft_results('328.l.34014.t.1', null);

    expect(yf.api)
      .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/team/328.l.34014.t.1/draftresults?format=json");
  });

  // matchups
  it ("should build a proper url to retrieve team draft analysis via a team key", function() {
    nock('http://fantasysports.yahooapis.com')
      .get("/fantasy/v2/team/328.l.34014.t.1/matchups?format=json")
      .reply(200, {});

    team.matchups('328.l.34014.t.1', null);

    expect(yf.api)
      .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/team/328.l.34014.t.1/matchups?format=json");
  });
});
