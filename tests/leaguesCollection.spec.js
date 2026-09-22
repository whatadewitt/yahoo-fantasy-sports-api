const YahooFantasy = require('../index.js');
const nock = require('nock');

describe ("collection: leaguesCollection", function(){
  const yf = new YahooFantasy(
    'Y!APPLICATION_KEY',
    'Y!APPLICATION_SECRET')
    , leagues = yf.leagues;


  it ("should be defined", function() {
    expect(leagues).not.toBe(null);
  });

  describe("scoreboard subresource", function() {
    const mockLeaguesScoreboard = require("./nock-data/leaguesScoreboard");
    const leagueKeys = ["328.l.34014", "328.l.24281"];

    beforeEach(function() {
      yf.setUserToken("testusertoken==");

      nock("https://fantasysports.yahooapis.com")
        .get(
          "/fantasy/v2/leagues;league_keys=328.l.34014,328.l.24281;out=scoreboard?format=json"
        )
        .reply(200, mockLeaguesScoreboard);
    });

    it("should preserve each league's scoreboard week", function() {
      return leagues.fetch(leagueKeys, ["scoreboard"]).then(data => {
        expect(data[0].scoreboard.week).toEqual("25");
        expect(data[1].scoreboard.week).toEqual("12");
      });
    });

    it("should still map matchups alongside the week", function() {
      return leagues.fetch(leagueKeys, ["scoreboard"]).then(data => {
        expect(data[0].scoreboard.matchups.length).toEqual(4);
        expect(data[0].scoreboard.matchups[0].teams[0].name).toEqual(
          "ChicksDigTheLongBall"
        );
      });
    });

    it("should preserve the week via the callback pattern", function(done) {
      leagues.fetch(leagueKeys, ["scoreboard"], function(err, data) {
        expect(err).toBe(null);
        expect(data[0].scoreboard.week).toEqual("25");
        expect(data[1].scoreboard.week).toEqual("12");
        done();
      });
    });
  });

  describe("mapScoreboard", function() {
    const { mapScoreboard } = require("../dist/cjs/helpers/leagueHelper");
    const recorded = require("./nock-data/leagueScoreboard");
    const scoreboard = recorded.fantasy_content.league[1].scoreboard;

    it("should return the week from the scoreboard as a string", function() {
      expect(mapScoreboard(scoreboard).week).toEqual("25");
    });

    it("should return an empty matchups list when none are present", function() {
      expect(mapScoreboard({ week: "3" })).toEqual({ week: "3", matchups: [] });
    });
  });
});
