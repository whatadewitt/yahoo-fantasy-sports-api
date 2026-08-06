// Debug HTTP issue
const YahooFantasy = require('./index.js');

console.log('Testing HTTP request...');

const yf = new YahooFantasy('test_key', 'test_secret');
yf.setUserToken('test_token');

// Try to make a simple API call to see where it fails
yf.game.meta('328', (error, data) => {
  if (error) {
    console.error('Error:', error);
    console.error('Stack:', error.stack);
  } else {
    console.log('Success:', data);
  }
});