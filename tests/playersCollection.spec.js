const YahooFantasy = require('../index.js');
const nock = require('nock');

describe ("collection: playersCollection", function(){
  const yf = new YahooFantasy(
    'Y!APPLICATION_KEY',
    'Y!APPLICATION_SECRET')
    , players = yf.players;


  it ("should be defined", function() {
    expect(players).not.toBe(null);
  });

});
