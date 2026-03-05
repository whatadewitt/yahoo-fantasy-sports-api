const YahooFantasy = require("../index.js");
const nock = require("nock");

describe("resource: transactionResource", function() {
  const yf = new YahooFantasy("Y!APPLICATION_KEY", "Y!APPLICATION_SECRET"),
    transaction = yf.transaction;

  it("should be defined", function() {
    expect(transaction).not.toBe(null);
  });

  it("should have a meta function", function() {
    expect(transaction.meta).not.toBe(null);
  });

  it("should have a players function", function() {
    expect(transaction.players).not.toBe(null);
  });

  beforeEach(function() {
    yf.setUserToken("testusertoken==");
    spyOn(yf, "api").and.callThrough();
  });

  it("should build a proper url to retrieve metadata via a transaction key", function() {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/transaction/328.l.34014.tr.237/metadata?format=json")
      .reply(200, require("./nock-data/transactionMeta"));

    const result = transaction.meta("328.l.34014.tr.237");

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/transaction/328.l.34014.tr.237/metadata"
    );
    return result;
  });

  it("should build a proper url to retrieve player info via a transaction key", function() {
    nock("https://fantasysports.yahooapis.com")
      .get("/fantasy/v2/transaction/328.l.34014.tr.237/players?format=json")
      .reply(200, require("./nock-data/transactionPlayers"));

    const result = transaction.players("328.l.34014.tr.237");

    expect(yf.api).toHaveBeenCalledWith(
      "GET",
      "https://fantasysports.yahooapis.com/fantasy/v2/transaction/328.l.34014.tr.237/players"
    );
    return result;
  });
});
