const YahooFantasy = require("../index.js");
const nock = require("nock");

describe("collection: teamsCollection", function() {
  const yf = new YahooFantasy("Y!APPLICATION_KEY", "Y!APPLICATION_SECRET"),
    teams = yf.teams;

  it("should be defined", function() {
    expect(teams).not.toBe(null);
  });
});
