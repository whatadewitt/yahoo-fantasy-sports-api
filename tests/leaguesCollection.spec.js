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

});
