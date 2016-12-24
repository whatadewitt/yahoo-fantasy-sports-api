var YahooFantasy = require('../index.js');
var nock = require('nock');

describe ("resource: leagueResource", function() {
  var yf = new YahooFantasy(
    'Y!APPLICATION_KEY',
    'Y!APPLICATION_SECRET'),
    league = yf.league;

  it ("should be defined", function() {
    expect(league).not.toBe(null);
  });

  // functions
  it ("should have a meta function", function() {
    expect(league.meta).not.toBe(null);
  });

  it ("should have a settings function", function() {
    expect(league.settings).not.toBe(null);
  });

  it ("should have a standings function", function() {
    expect(league.standings).not.toBe(null);
  });

  it ("should have a scoreboard function", function() {
    expect(league.scoreboard).not.toBe(null);
  });

  it ("should have a teams function", function() {
    expect(league.teams).not.toBe(null);
  });

  it ("should have a players function", function() {
    expect(league.players).not.toBe(null);
  });

  it ("should have a draft_results function", function() {
    expect(league.draft_results).not.toBe(null);
  });

  it ("should have a transactions function", function() {
    expect(league.transactions).not.toBe(null);
  });

  // building urls
  beforeEach(function() {
    spyOn(yf, "api").andCallThrough();
  });

  // meta
  it ("should build a proper url to retrieve metadata via a league key", function() {
    nock('https://fantasysports.yahooapis.com')
      .get("/fantasy/v2/league/328.l.34014/metadata?format=json")
      .reply(200, {});

    league.meta('328.l.34014', null);

    expect(yf.api)
      .toHaveBeenCalledWith("GET", "https://fantasysports.yahooapis.com/fantasy/v2/league/328.l.34014/metadata?format=json", jasmine.any(Function));
  });

  // settings
  it ("should build a proper url to retrieve settings via a league key", function() {
    nock('https://fantasysports.yahooapis.com')
      .get("/fantasy/v2/league/328.l.34014/settings?format=json")
      .reply(200, {});

    league.settings('328.l.34014', null);

    expect(yf.api)
      .toHaveBeenCalledWith("GET", "https://fantasysports.yahooapis.com/fantasy/v2/league/328.l.34014/settings?format=json", jasmine.any(Function));
  });

  // standings
  it ("should build a proper url to retrieve standings via a league key", function() {
    nock('https://fantasysports.yahooapis.com')
      .get("/fantasy/v2/league/328.l.34014/standings?format=json")
      .reply(200, {});

    league.standings('328.l.34014', null);

    expect(yf.api)
      .toHaveBeenCalledWith("GET", "https://fantasysports.yahooapis.com/fantasy/v2/league/328.l.34014/standings?format=json", jasmine.any(Function));
  });

  // scoreboard
  it ("should build a proper url to retrieve scoreboard via a league key", function() {
    nock('https://fantasysports.yahooapis.com')
      .get("/fantasy/v2/league/328.l.34014/scoreboard?format=json")
      .reply(200, {});

    league.scoreboard('328.l.34014', null);

    expect(yf.api)
      .toHaveBeenCalledWith("GET", "https://fantasysports.yahooapis.com/fantasy/v2/league/328.l.34014/scoreboard?format=json", jasmine.any(Function));
  });

  // teams
  it ("should build a proper url to retrieve teams via a league key", function() {
    nock('https://fantasysports.yahooapis.com')
      .get("/fantasy/v2/league/328.l.34014/teams?format=json")
      .reply(200, {});

    league.teams('328.l.34014', null);

    expect(yf.api)
      .toHaveBeenCalledWith("GET", "https://fantasysports.yahooapis.com/fantasy/v2/league/328.l.34014/teams?format=json", jasmine.any(Function));
  });

  // players
  it ("should build a proper url to retrieve players via a league key", function() {
    nock('https://fantasysports.yahooapis.com')
      .get("/fantasy/v2/league/328.l.34014/players?format=json")
      .reply(200, {});

    league.players('328.l.34014', null);

    expect(yf.api)
      .toHaveBeenCalledWith("GET", "https://fantasysports.yahooapis.com/fantasy/v2/league/328.l.34014/players?format=json", jasmine.any(Function));
  });

  // draft_results
  it ("should build a proper url to retrieve draft_results via a league key", function() {
    nock('https://fantasysports.yahooapis.com')
      .get("/fantasy/v2/league/328.l.34014/draft_results?format=json")
      .reply(200, {});

    league.draft_results('328.l.34014', null);

    expect(yf.api)
      .toHaveBeenCalledWith("GET", "https://fantasysports.yahooapis.com/fantasy/v2/league/328.l.34014/draftresults?format=json", jasmine.any(Function));
  });

  // transactions
  it ("should build a proper url to retrieve transactions via a league key", function() {
    nock('https://fantasysports.yahooapis.com')
      .get("/fantasy/v2/league/328.l.34014/transactions?format=json")
      .reply(200, {});

    league.transactions('328.l.34014', null);

    expect(yf.api)
      .toHaveBeenCalledWith("GET", "https://fantasysports.yahooapis.com/fantasy/v2/league/328.l.34014/transactions?format=json", jasmine.any(Function));
  });
});
