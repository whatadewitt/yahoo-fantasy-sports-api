var YahooFantasy = require("../index.js");
var nock = require("nock");

describe("resource: transactionResource", function() {
  var yf = new YahooFantasy("Y!APPLICATION_KEY", "Y!APPLICATION_SECRET"),
    transaction = yf.transaction;

  it("should be defined", function() {
    expect(transaction).not.toBe(null);
  });

  // functions
  it("should have a meta function", function() {
    expect(transaction.meta).not.toBe(null);
  });

  it("should have a players function", function() {
    expect(transaction.players).not.toBe(null);
  });

  // building urls
  beforeEach(function() {
    yf.setUserToken("testusertoken==");
    spyOn(yf, "api").and.callThrough();
  });

  // meta
  it("should build a proper url to retrieve metadata via a transaction key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/transaction/328.l.34014.tr.237/players?format=json")
      .reply(200, require("./nock-data/transactionMeta"));

    transaction.meta("328.l.34014.tr.237", done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/transaction/328.l.34014.tr.237/players"
    );
  });

  // players
  it("should build a proper url to retrieve player info via a transaction key", function(done) {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/transaction/328.l.34014.tr.237/players?format=json")
      .reply(200, require("./nock-data/transactionPlayers"));

    transaction.players("328.l.34014.tr.237", done);

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/transaction/328.l.34014.tr.237/players"
    );
  });
});
