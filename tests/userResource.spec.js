var YahooFantasy = require("../index.js");
var nock = require("nock");

describe("resource: userResource", function() {
  var yf = new YahooFantasy("Y!APPLICATION_KEY", "Y!APPLICATION_SECRET"),
    user = yf.user;

  it("should be defined", function() {
    expect(user).not.toBe(null);
  });

  // functions
  it("should have a games function", function() {
    expect(user.games).not.toBe(null);
  });

  it("should have a game_leagues function", function() {
    expect(user.game_leagues).not.toBe(null);
  });

  it("should have a game_teams function", function() {
    expect(user.game_teams).not.toBe(null);
  });

  // building urls
  beforeEach(function() {
    yf.setUserToken("testusertoken==");
    spyOn(yf, "api").and.callThrough();
  });

  // games
  it("should build a proper url to retrieve games a user has played and is playing", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/users;use_login=1/games?format=json")
      .reply(200, require("./nock-data/userGames"));

    user.games(done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games"
    );
  });

  // game_leagues
  it("should build a proper url to retrieve leagues a user plays in for a given game", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get(
        "/fantasy/v2/users;use_login=1/games;game_keys=328/leagues?format=json"
      )
      .reply(200, require("./nock-data/userLeagues"));

    user.game_leagues("328", done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=328/leagues"
    );
  });

  it("should build a proper url to retrieve leagues a user plays in for given games", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get(
        "/fantasy/v2/users;use_login=1/games;game_keys=328,242/leagues?format=json"
      )
      .reply(200, require("./nock-data/userLeagues"));

    user.game_leagues(["328", "242"], done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=328,242/leagues"
    );
  });

  // game_teams
  it("should build a proper url to retrieve teams a user owns in for a given game", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get(
        "/fantasy/v2/users;use_login=1/games;game_keys=328/teams?format=json"
      )
      .reply(200, require("./nock-data/userTeams"));

    user.game_teams("328", done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=328/teams"
    );
  });

  it("should build a proper url to retrieve teams a user owns in for given games", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get(
        "/fantasy/v2/users;use_login=1/games;game_keys=328,242/teams?format=json"
      )
      .reply(200, require("./nock-data/userTeams"));

    user.game_teams(["328", "242"], done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=328,242/teams"
    );
  });
});
