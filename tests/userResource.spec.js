const YahooFantasy = require("../index.js");
const nock = require("nock");

describe("resource: userResource", function() {
  const yf = new YahooFantasy("Y!APPLICATION_KEY", "Y!APPLICATION_SECRET"),
    user = yf.user;

  it("should be defined", function() {
    expect(user).not.toBe(null);
  });

  it("should have a games function", function() {
    expect(user.games).not.toBe(null);
  });

  it("should have a game_leagues function", function() {
    expect(user.game_leagues).not.toBe(null);
  });

  it("should have a game_teams function", function() {
    expect(user.game_teams).not.toBe(null);
  });

  beforeEach(function() {
    yf.setUserToken("testusertoken==");
    spyOn(yf, "api").and.callThrough();
  });

  it("should build a proper url to retrieve games a user has played and is playing", function() {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/users;use_login=1/games?format=json")
      .reply(200, require("./nock-data/userGames"));

    const result = user.games();

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games"
    );
    return result;
  });

  it("should build a proper url to retrieve leagues a user plays in for a given game", function() {
    nock("https://fantasysports.yahooapis.com")
      .get(
        "/fantasy/v2/users;use_login=1/games;game_keys=328/leagues?format=json"
      )
      .reply(200, require("./nock-data/userLeagues"));

    const result = user.game_leagues("328");

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=328/leagues"
    );
    return result;
  });

  it("should build a proper url to retrieve leagues a user plays in for given games", function() {
    nock("https://fantasysports.yahooapis.com")
      .get(
        "/fantasy/v2/users;use_login=1/games;game_keys=328,242/leagues?format=json"
      )
      .reply(200, require("./nock-data/userLeagues"));

    const result = user.game_leagues(["328", "242"]);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=328,242/leagues"
    );
    return result;
  });

  it("should build a proper url to retrieve teams a user owns in for a given game", function() {
    nock("https://fantasysports.yahooapis.com")
      .get(
        "/fantasy/v2/users;use_login=1/games;game_keys=328/teams?format=json"
      )
      .reply(200, require("./nock-data/userTeams"));

    const result = user.game_teams("328");

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=328/teams"
    );
    return result;
  });

  it("should build a proper url to retrieve teams a user owns in for given games", function() {
    nock("https://fantasysports.yahooapis.com")
      .get(
        "/fantasy/v2/users;use_login=1/games;game_keys=328,242/teams?format=json"
      )
      .reply(200, require("./nock-data/userTeams"));

    const result = user.game_teams(["328", "242"]);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=328,242/teams"
    );
    return result;
  });
});
