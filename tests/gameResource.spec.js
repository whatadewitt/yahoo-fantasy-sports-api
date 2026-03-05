const YahooFantasy = require("../index.js");
const nock = require("nock");

describe("resource : gameResource", function() {
  const yf = new YahooFantasy("Y!APPLICATION_KEY", "Y!APPLICATION_SECRET"),
    game = yf.game;

  it("should be defined", function() {
    expect(game).not.toBe(null);
  });

  // functions
  it("should have a meta function", function() {
    expect(game.meta).not.toBe(null);
  });

  // REMOVED: leagues and players functions (deprecated)
  // Use league.meta() and player.meta() instead

  it("should have a game_weeks function", function() {
    expect(game.game_weeks).not.toBe(null);
  });

  it("should have a stat_categories function", function() {
    expect(game.stat_categories).not.toBe(null);
  });

  it("should have a position_types function", function() {
    expect(game.position_types).not.toBe(null);
  });

  it("should have a roster_positions function", function() {
    expect(game.roster_positions).not.toBe(null);
  });

  // meta
  describe(": meta", function() {
    const meta = require("./nock-data/gameMeta").meta;
    yf.setUserToken("testusertoken==");

    it("should build a proper url to retrieve metadata via a numeric game key", function(done) {
      nock("https://fantasysports.yahooapis.com")
        .get("/fantasy/v2/game/328/metadata?format=json")
        .times(2)
        .reply(200, meta);

      game.meta(328, function(e, data) {
        expect(data).toEqual(meta.fantasy_content.game[0]);
        game
          .meta(328)
          .then((data) => {
            expect(data).toEqual(meta.fantasy_content.game[0]);
          })
          .then(done);
      });
    });

    it("should build a proper url to retrieve metadata via a string game key", function(done) {
      nock("https://fantasysports.yahooapis.com")
        .get("/fantasy/v2/game/mlb/metadata?format=json")
        .times(2)
        .reply(200, meta);

      game.meta("mlb", function(e, data) {
        expect(data).toEqual(meta.fantasy_content.game[0]);
        game
          .meta("mlb")
          .then((data) => {
            expect(data).toEqual(meta.fantasy_content.game[0]);
          })
          .then(done);
      });
    });
  });

  beforeEach(function() {
    spyOn(yf, "api").and.callThrough();
  });

  // REMOVED: game.leagues tests (deprecated)
  // Use league.meta() instead

  // REMOVED: game.players tests (deprecated)
  // Use player.meta() instead

  // game_weeks
  it("should build a proper url to retrieve game weeks using a numeric game key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/game/328/game_weeks?format=json")
      .reply(200, require("./nock-data/gameWeeks").weeks);
    game.game_weeks(328, done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/game/328/game_weeks"
    );
  });

  it("should build a proper url to retrieve game weeks using a string game key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/game/nfl/game_weeks?format=json")
      .reply(200, require("./nock-data/gameWeeks").weeks);
    game.game_weeks("nfl", done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/game/nfl/game_weeks"
    );
  });

  // stat_categories
  it("should build a proper url to retrieve stat categories using a numeric game key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/game/328/stat_categories?format=json")
      .reply(200, require("./nock-data/gameStatCategories"));
    game.stat_categories(328, done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/game/328/stat_categories"
    );
  });

  it("should build a proper url to retrieve stat categories using a string game key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/game/nfl/stat_categories?format=json")
      .reply(200, require("./nock-data/gameStatCategories"));
    game.stat_categories("nfl", done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/game/nfl/stat_categories"
    );
  });

  // position_types
  it("should build a proper url to retrieve position types using a numeric game key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/game/328/position_types?format=json")
      .reply(200, require("./nock-data/gamePositionTypes"));
    game.position_types(328, done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/game/328/position_types"
    );
  });

  it("should build a proper url to retrieve position types using a string game key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/game/nfl/position_types?format=json")
      .reply(200, require("./nock-data/gamePositionTypes"));
    game.position_types("nfl", done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/game/nfl/position_types"
    );
  });

  // roster_positions
  it("should build a proper url to retrieve roster positions using a numeric game key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/game/328/roster_positions?format=json")
      .reply(200, require("./nock-data/gameRosterPositions"));
    game.roster_positions(328, done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/game/328/roster_positions"
    );
  });

  it("should build a proper url to retrieve roster positions using a string game key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/game/nfl/roster_positions?format=json")
      .reply(200, require("./nock-data/gameRosterPositions"));
    game.roster_positions("nfl", done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/game/nfl/roster_positions"
    );
  });
});
