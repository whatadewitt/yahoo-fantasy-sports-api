var YahooFantasy = require('../../index.js');
var nock = require('nock');

describe ("collection: playersCollection", function(){
  var yf = new YahooFantasy(
    'Y!APPLICATION_KEY',
    'Y!APPLICATION_SECRET')
    , players = yf.players;


  it ("should be defined", function() {
    expect(players).not.toBe(null);
  });

});
