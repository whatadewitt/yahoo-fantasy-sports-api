var YahooFantasy = require('../../index.js');
var nock = require('nock');

describe ("collection: transactionsCollection", function(){
  var yf = new YahooFantasy(
    'Y!APPLICATION_KEY',
    'Y!APPLICATION_SECRET')
    , transactions = yf.transactions;


  it ("should be defined", function() {
    expect(transactions).not.toBe(null);
  });

});
