var YahooFantasy = require('../../index.js');
var nock = require('nock');

describe ("collection: leaguesCollection", function(){
  var yf = new YahooFantasy(
    'Y!APPLICATION_KEY',
    'Y!APPLICATION_SECRET')
    , leagues = yf.leagues;


  it ("should be defined", function() {
    expect(leagues).not.toBe(null);
  });

});
