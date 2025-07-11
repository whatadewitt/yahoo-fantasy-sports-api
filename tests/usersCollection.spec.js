const YahooFantasy = require('../index.js');
const nock = require('nock');

describe ("collection: usersCollection", function(){
  const yf = new YahooFantasy(
    'Y!APPLICATION_KEY',
    'Y!APPLICATION_SECRET')
    , users = yf.users;


  it ("should be defined", function() {
    expect(users).not.toBe(null);
  });

});
