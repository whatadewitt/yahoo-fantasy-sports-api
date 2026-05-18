const YahooFantasy = require('../index.js');
const nock = require('nock');

describe ("collection: transactionsCollection", function(){
  const yf = new YahooFantasy(
    'Y!APPLICATION_KEY',
    'Y!APPLICATION_SECRET')
    , transactions = yf.transactions;


  it ("should be defined", function() {
    expect(transactions).not.toBe(null);
  });

});

describe("collection: transactionsCollection writes", function () {
  const yf = new YahooFantasy("Y!KEY", "Y!SECRET");
  const transactions = yf.transactions;

  beforeEach(function () {
    yf.setUserToken("testusertoken==");
    spyOn(yf, "api").and.callThrough();
  });

  it("add_player POSTs add XML to league transactions", function () {
    const expected =
      "<?xml version='1.0'?><fantasy_content><transaction>" +
      "<type>add</type><player><player_key>nfl.p.1</player_key>" +
      "<transaction_data><type>add</type>" +
      "<destination_team_key>nfl.l.1.t.1</destination_team_key>" +
      "</transaction_data></player></transaction></fantasy_content>";
    nock("https://fantasysports.yahooapis.com")
      .post("/fantasy/v2/league/nfl.l.1/transactions?format=json", expected)
      .reply(200, { fantasy_content: {} });

    const result = transactions.add_player("nfl.l.1", "nfl.l.1.t.1", "nfl.p.1");
    expect(yf.api).toHaveBeenCalledWith(
      "POST",
      "https://fantasysports.yahooapis.com/fantasy/v2/league/nfl.l.1/transactions",
      expected
    );
    return result;
  });

  it("propose_trade POSTs pending_trade XML", function () {
    nock("https://fantasysports.yahooapis.com")
      .post("/fantasy/v2/league/nfl.l.1/transactions?format=json")
      .reply(200, { fantasy_content: {} });

    return transactions
      .propose_trade("nfl.l.1", "nfl.l.1.t.1", "nfl.l.1.t.2", {
        send: ["nfl.p.1"],
        receive: ["nfl.p.2"],
      })
      .then(() => {
        const call = yf.api.calls.mostRecent().args;
        expect(call[0]).toBe("POST");
        expect(call[2]).toContain("<type>pending_trade</type>");
      });
  });

  it("add_player invokes the callback with data on success", function (done) {
    nock("https://fantasysports.yahooapis.com")
      .post("/fantasy/v2/league/nfl.l.1/transactions?format=json")
      .reply(200, { fantasy_content: {} });

    transactions.add_player(
      "nfl.l.1",
      "nfl.l.1.t.1",
      "nfl.p.9",
      function (err, data) {
        expect(err).toBeNull();
        expect(data).toEqual({ fantasy_content: {} });
        done();
      }
    );
  });
});
