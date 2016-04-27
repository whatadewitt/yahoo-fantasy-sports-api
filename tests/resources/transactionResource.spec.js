var YahooFantasy = require('../../index.js');
var nock = require('nock');

describe ("resource: transactionResource", function() {
  var yf = new YahooFantasy(
    'Y!APPLICATION_KEY',
    'Y!APPLICATION_SECRET'),
  transaction = yf.transaction;

  it ("should be defined", function() {
    expect(transaction).not.toBe(null);
  });

  // functions
  it ("should have a meta function", function() {
    expect(transaction.meta).not.toBe(null);
  });

  it ("should have a players function", function() {
    expect(transaction.players).not.toBe(null);
  });

  // building urls
  beforeEach(function() {
    spyOn(yf, "api").andCallThrough();
  });

  // meta
  it ("should build a proper url to retrieve metadata via a transaction key", function() {
    nock('http://fantasysports.yahooapis.com')
      .get("/fantasy/v2/transaction/328.l.34014.tr.237/players?format=json")
      .reply(200, {});

    transaction.meta('328.l.34014.tr.237', null);

    expect(yf.api)
      .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/transaction/328.l.34014.tr.237/players?format=json");
  });

  // players
  it ("should build a proper url to retrieve player info via a transaction key", function() {
    nock('http://fantasysports.yahooapis.com')
      .get("/fantasy/v2/transaction/328.l.34014.tr.237/players?format=json")
      .reply(200, {});

    transaction.players('328.l.34014.tr.237', null);

    expect(yf.api)
      .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/transaction/328.l.34014.tr.237/players?format=json");
  });
});
