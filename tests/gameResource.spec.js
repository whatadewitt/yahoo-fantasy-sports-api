import { expect, describe, test, spyOn, mockRestore } from "@jest/globals";
import YahooFantasy from "../index.js";
import nock from "nock";

describe("resource : gameResource", function() {
  const yf = new YahooFantasy("Y!APPLICATION_KEY", "Y!APPLICATION_SECRET"),
    game = yf.game;
  yf.setUserToken("testusertoken==");

  test("should be defined", function() {
    expect(game).not.toBe(null);
  });

  // functions
  test("should have a meta function", function() {
    expect(game.meta).not.toBe(null);
  });

  test("should have a leagues function", function() {
    expect(game.leagues).not.toBe(null);
  });

  test("should have a players function", function() {
    expect(game.players).not.toBe(null);
  });

  test("should have a game_weeks function", function() {
    expect(game.game_weeks).not.toBe(null);
  });

  test("should have a stat_categories function", function() {
    expect(game.stat_categories).not.toBe(null);
  });

  test("should have a position_types function", function() {
    expect(game.position_types).not.toBe(null);
  });

  test("should have a roster_positions function", function() {
    expect(game.roster_positions).not.toBe(null);
  });

  // meta
  describe(": meta", function() {
    const meta = require("./nock-data/gameMeta").meta;

    beforeEach(() => {
      // jest.mockRestore();
      jest.spyOn(yf, "api").mockResolvedValue(meta);
    });

    test("should build a proper url to retrieve metadata via a numeric game key", function() {
      game.meta(328, function(e, data) {
        expect(yf.api).toHaveBeenCalledWith(
          yf.GET,
          `https://fantasysports.yahooapis.com/fantasy/v2/game/328/metadata`
        );

        expect(data).toEqual(meta.fantasy_content.game[0]);
      });
    });

    test("should build a proper url to retrieve metadata via a string game key", function() {
      game.meta("mlb", function(e, data) {
        expect(yf.api).toHaveBeenCalledWith(
          yf.GET,
          `https://fantasysports.yahooapis.com/fantasy/v2/game/mlb/metadata`
        );

        expect(data).toEqual(meta.fantasy_content.game[0]);
      });
    });
  });

  // leagues
  describe(": leagues", function() {
    it("should throw on game.leagues", function() {
      expect(() => game.leagues(328, "328.l.34014")).toThrow();
    });
  });

  // players
  describe(": players", function() {
    it("should throw on game.players", function() {
      expect(() => game.players(328, "328.l.6619")).toThrow();
    });
  });

  // game_weeks
  describe(": game_weeks", function() {
    // TODO: test to make sure each week is an int
    const game_weeks = require("./nock-data/gameWeeks").weeks;

    beforeEach(() => {
      // jest.mockRestore();
      jest.spyOn(yf, "api").mockResolvedValue(game_weeks);
    });

    fit("should build a proper url to retrieve game weeks using a numeric game key", async function() {
      const gameData = { ...game_weeks.fantasy_content.game[0] };
      const data = await game.game_weeks(328);

      expect(yf.api).toHaveBeenCalledWith(
        yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/game/328/game_weeks`
      );

      expect(Object.keys(data)).toEqual(expect.arrayContaining(Object.keys(gameData)));
      expect(data).toHaveProperty("weeks");
    });

    it("should build a proper url to retrieve game weeks using a string game key", function() {
      game.game_weeks("nfl", function(e, data) {
        expect(yf.api).toHaveBeenCalledWith(
          yf.GET,
          `https://fantasysports.yahooapis.com/fantasy/v2/game/nfl/game_weeks`
        );

        expect(data).toContain(game_weeks.fantasy_content.game[0]);
        expect(data).toHaveProperty("weeks");
      });
    });
  });

  // stat_categories
  describe(": stat_categories", function() {
    const stat_categories = require("./nock-data/gameStatCategories");

    beforeEach(() => {
      jest.spyOn(yf, "api").mockResolvedValue(stat_categories);
    });

    it("should build a proper url to retrieve stat categories using a numeric game key", function() {
      game.stat_categories(328, function(e, data) {
        expect(yf.api).toHaveBeenCalledWith(
          yf.GET,
          `https://fantasysports.yahooapis.com/fantasy/v2/game/328/stat_categories`
        );

        expect(data).toEqual(stat_categories.fantasy_content.game[0]);
      });
    });

    it("should build a proper url to retrieve stat categories using a string game key", function() {
      game.stat_categories("nfl", function(e, data) {
        expect(yf.api).toHaveBeenCalledWith(
          yf.GET,
          `https://fantasysports.yahooapis.com/fantasy/v2/game/nfl/stat_categories`
        );

        // console.log(data);

        expect(data).toEqual(
          stat_categories.fantasy_content.game[0].stat_categories
        );
      });
    });
  });

  // // position_types
  // describe(": position_types", function() {
  //   it("should build a proper url to retrieve position types using a numeric game key", function(done) {
  //     nock("https://fantasysports.yahooapis.com")
  //       .get("/fantasy/v2/game/328/position_types?format=json")
  //       .reply(200, require("./nock-data/gamePositionTypes"));
  //     game.position_types(328, done);

  //     expect(yf.api).toHaveBeenCalledWith(
  //       "GET",
  //       "https://fantasysports.yahooapis.com/fantasy/v2/game/328/position_types"
  //     );
  //   });

  //   it("should build a proper url to retrieve position types using a string game key", function(done) {
  //     nock("https://fantasysports.yahooapis.com")
  //       .get("/fantasy/v2/game/nfl/position_types?format=json")
  //       .reply(200, require("./nock-data/gamePositionTypes"));
  //     game.position_types("nfl", done);

  //     expect(yf.api).toHaveBeenCalledWith(
  //       "GET",
  //       "https://fantasysports.yahooapis.com/fantasy/v2/game/nfl/position_types"
  //     );
  //   });
  // });

  // // roster_positions
  // describe(": roster_positions", function() {
  //   it("should build a proper url to retrieve roster positions using a numeric game key", function(done) {
  //     nock("https://fantasysports.yahooapis.com")
  //       .get("/fantasy/v2/game/328/roster_positions?format=json")
  //       .reply(200, require("./nock-data/gameRosterPositions"));
  //     game.roster_positions(328, done);

  //     expect(yf.api).toHaveBeenCalledWith(
  //       "GET",
  //       "https://fantasysports.yahooapis.com/fantasy/v2/game/328/roster_positions"
  //     );
  //   });

  //   it("should build a proper url to retrieve roster positions using a string game key", function(done) {
  //     nock("https://fantasysports.yahooapis.com")
  //       .get("/fantasy/v2/game/nfl/roster_positions?format=json")
  //       .reply(200, require("./nock-data/gameRosterPositions"));
  //     game.roster_positions("nfl", done);

  //     expect(yf.api).toHaveBeenCalledWith(
  //       "GET",
  //       "https://fantasysports.yahooapis.com/fantasy/v2/game/nfl/roster_positions"
  //     );
  //   });
  // });
});
