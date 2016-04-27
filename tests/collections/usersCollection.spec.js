var YahooFantasy = require('../../index.js');
var nock = require('nock');

describe ("collection: usersCollection", function(){
  var yf = new YahooFantasy(
    'Y!APPLICATION_KEY',
    'Y!APPLICATION_SECRET')
    , users = yf.users;


  it ("should be defined", function() {
    expect(users).not.toBe(null);
  });

});
