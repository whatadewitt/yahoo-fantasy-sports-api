var YahooFantasy = require("../index.js");
var nock = require("nock");

describe("collection: leaguesCollection", function() {
  var yf = new YahooFantasy("Y!APPLICATION_KEY", "Y!APPLICATION_SECRET"),
    leagues = yf.leagues;

  it("should be defined", function() {
    expect(leagues).not.toBe(null);
  });

  describe("scoreboard week", function() {
    var recordedResponse = require("./nock-data/leagueScoreboard");
    var leagueKey = recordedResponse.fantasy_content.league[0].league_key;

    function copyLeague() {
      return JSON.parse(
        JSON.stringify(recordedResponse.fantasy_content.league)
      );
    }

    function replyWithLeagues(keys, subresources, entries) {
      var response = {
        fantasy_content: { leagues: { count: entries.length } }
      };
      entries.forEach(function(entry, index) {
        response.fantasy_content.leagues[index] = { league: entry };
      });

      return nock("https://fantasysports.yahooapis.com")
        .get(
          "/fantasy/v2/leagues;league_keys=" +
            keys.join(",") +
            ";out=" +
            subresources.join(",") +
            "?format=json"
        )
        .reply(200, response);
    }

    beforeEach(function() {
      yf.setUserToken("testusertoken==");
    });

    afterEach(function() {
      nock.cleanAll();
    });

    it("matches the individual league's recorded scoreboard", function() {
      var collectionRequest = replyWithLeagues(
        [leagueKey],
        ["scoreboard"],
        [copyLeague()]
      );
      var resourceRequest = nock("https://fantasysports.yahooapis.com")
        .get("/fantasy/v2/league/" + leagueKey + "/scoreboard?format=json")
        .reply(200, recordedResponse);

      return Promise.all([
        leagues.fetch(leagueKey, "scoreboard"),
        yf.league.scoreboard(leagueKey)
      ]).then(function(results) {
        expect(results[0][0].scoreboard.week).toEqual("25");
        expect(results[0][0].scoreboard.matchups.length).toEqual(4);
        expect(results[0][0].scoreboard).toEqual(results[1].scoreboard);
        expect(collectionRequest.isDone()).toBe(true);
        expect(resourceRequest.isDone()).toBe(true);
      });
    });

    it("keeps each league's week in callbacks, including an empty scoreboard", function() {
      var emptyLeague = copyLeague();
      var otherKey = "328.l.12345";
      emptyLeague[0].league_key = otherKey;
      emptyLeague[1].scoreboard = { week: "17", 0: { matchups: { count: 0 } } };
      var request = replyWithLeagues(
        [leagueKey, otherKey],
        ["scoreboard"],
        [copyLeague(), emptyLeague]
      );
      var callback = jasmine.createSpy("callback");

      return leagues
        .fetch([leagueKey, otherKey], ["scoreboard"], callback)
        .then(function(result) {
          expect(result[0].scoreboard.week).toEqual("25");
          expect(result[1].scoreboard).toEqual({ week: "17", matchups: [] });
          expect(callback).toHaveBeenCalledWith(null, result);
          expect(request.isDone()).toBe(true);
        });
    });

    it("retains the week when scoreboard follows another subresource", function() {
      var entry = copyLeague();
      entry.splice(1, 0, { teams: { count: 0 } });
      var request = replyWithLeagues(
        [leagueKey],
        ["teams", "scoreboard"],
        [entry]
      );

      return leagues
        .fetch(leagueKey, ["teams", "scoreboard"])
        .then(function(result) {
          expect(result[0].teams).toEqual([]);
          expect(result[0].scoreboard.week).toEqual("25");
          expect(result[0].scoreboard.matchups.length).toEqual(4);
          expect(request.isDone()).toBe(true);
        });
    });
  });
});
