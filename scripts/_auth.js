require('dotenv').config();
const readline = require('readline');
const YahooFantasy = require('../index.js');

function prompt(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function authedClient() {
  const { YAHOO_CONSUMER_KEY, YAHOO_CONSUMER_SECRET, YAHOO_REDIRECT_URI } =
    process.env;

  if (!YAHOO_CONSUMER_KEY || !YAHOO_CONSUMER_SECRET || !YAHOO_REDIRECT_URI) {
    throw new Error(
      'Missing env vars. Set YAHOO_CONSUMER_KEY, YAHOO_CONSUMER_SECRET, and ' +
        'YAHOO_REDIRECT_URI (in .env or the environment).'
    );
  }

  const yf = new YahooFantasy(
    YAHOO_CONSUMER_KEY,
    YAHOO_CONSUMER_SECRET,
    undefined,
    YAHOO_REDIRECT_URI
  );

  const authUrl =
    'https://api.login.yahoo.com/oauth2/request_auth?client_id=' +
    encodeURIComponent(YAHOO_CONSUMER_KEY) +
    '&redirect_uri=' +
    encodeURIComponent(YAHOO_REDIRECT_URI) +
    '&response_type=code';

  console.log('\n1) Open this URL and approve access:\n');
  console.log(authUrl + '\n');
  console.log(
    '2) After approving, copy the "code" query value from the redirect URL'
  );
  console.log(
    '   (or the code shown on screen if your Yahoo app uses an oob redirect).\n'
  );

  const code = await prompt('Paste the code here: ');
  if (!code) throw new Error('No code entered.');

  return new Promise((resolve, reject) => {
    yf.authCallback({ query: { code } }, (err) => {
      if (err) return reject(err);
      resolve(yf);
    });
  });
}

module.exports = { authedClient };
