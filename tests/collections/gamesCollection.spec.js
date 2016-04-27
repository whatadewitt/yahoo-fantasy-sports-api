var YahooFantasy = require('../../index.js');
var nock = require('nock');

describe ("collection: gamesCollection", function(){
  var yf = new YahooFantasy(
    'Y!APPLICATION_KEY',
    'Y!APPLICATION_SECRET'),
    games = yf.games;


  it ("should be defined", function() {
    expect(games).not.toBe(null);
  });

  // functions
  it ("should have a fetch function", function() {
    expect(games.fetch).not.toBe(null);
  });

  it ("should have a user function", function() {
    expect(games.user).not.toBe(null);
  });

  it ("should have a userFetch function", function() {
    expect(games.userFetch).not.toBe(null);
  });

  // building urls
  beforeEach(function() {
    spyOn(yf, "api").andCallThrough();
  });

  // fetch
  it ("should build a proper url to retrieve metadata via a numeric game key", function() {
    nock('http://fantasysports.yahooapis.com')
      .get("/fantasy/v2/game/328/metadata?format=json")
      .reply(200, {});

    games.fetch(328, null);

    // expect(yf.api)
      // .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/game/328/metadata?format=json");
  });

});
