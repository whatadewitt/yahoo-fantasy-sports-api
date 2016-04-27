var YahooFantasy = require('../../index.js');
var nock = require('nock');

describe ("collection: teamsCollection", function(){
  var yf = new YahooFantasy(
    'Y!APPLICATION_KEY',
    'Y!APPLICATION_SECRET')
    , teams = yf.teams;


  it ("should be defined", function() {
    expect(teams).not.toBe(null);
  });

});
