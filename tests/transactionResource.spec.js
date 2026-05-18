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

describe("resource: transactionResource writes", function () {
  const yf = new YahooFantasy("Y!KEY", "Y!SECRET");
  const transaction = yf.transaction;

  beforeEach(function () {
    yf.setUserToken("testusertoken==");
    spyOn(yf, "api").and.callThrough();
  });

  it("accept PUTs trade response XML", function () {
    const expected =
      "<?xml version='1.0'?><fantasy_content><transaction>" +
      "<transaction_key>k1</transaction_key><type>pending_trade</type>" +
      "<action>accept</action></transaction></fantasy_content>";
    nock("https://fantasysports.yahooapis.com")
      .put("/fantasy/v2/transaction/k1?format=json", expected)
      .reply(200, { fantasy_content: {} });

    const result = transaction.accept("k1");
    expect(yf.api).toHaveBeenCalledWith(
      "PUT",
      "https://fantasysports.yahooapis.com/fantasy/v2/transaction/k1",
      expected
    );
    return result;
  });

  it("cancel DELETEs the transaction with no body", function () {
    nock("https://fantasysports.yahooapis.com")
      .delete("/fantasy/v2/transaction/k9?format=json")
      .reply(200, { fantasy_content: {} });

    const result = transaction.cancel("k9");
    expect(yf.api).toHaveBeenCalledWith(
      "DELETE",
      "https://fantasysports.yahooapis.com/fantasy/v2/transaction/k9"
    );
    return result;
  });

  it("vote_against includes voter_team_key", function () {
    nock("https://fantasysports.yahooapis.com")
      .put("/fantasy/v2/transaction/k1?format=json")
      .reply(200, { fantasy_content: {} });

    return transaction.vote_against("k1", "t.9").then(() => {
      const call = yf.api.calls.mostRecent().args;
      expect(call[2]).toContain("<voter_team_key>t.9</voter_team_key>");
    });
  });

  it("reject invokes the callback with data on success", function (done) {
    nock("https://fantasysports.yahooapis.com")
      .put("/fantasy/v2/transaction/k2?format=json")
      .reply(200, { fantasy_content: {} });

    transaction.reject("k2", {}, function (err, data) {
      expect(err).toBeNull();
      expect(data).toEqual({ fantasy_content: {} });
      done();
    });
  });
});
