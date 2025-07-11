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
