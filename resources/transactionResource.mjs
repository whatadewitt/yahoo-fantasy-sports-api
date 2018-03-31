import { mapTransactionPlayers } from "../helpers/transactionHelper.mjs";

// TODO: PUT (accept/disallow/reject trades/vote against)
// TODO: DELETE (cancel pending claim or trade)
class TransactionResource {
  constructor(yf) {
    this.yf = yf;
  }

  meta(transactionKey, cb) {
    this.yf.api(
      this.yf.GET,
      `https://fantasysports.yahooapis.com/fantasy/v2/transaction/${transactionKey}/players?format=json`,
      (err, data) => {
        if (err) {
          return cb(err);
        }

        const transaction = data.fantasy_content.transaction[0];

        const players = mapTransactionPlayers(
          data.fantasy_content.transaction[1].players
        );

        transaction.players = players;

        return cb(null, transaction);
      }
    );
  }

  players(transactionKey, cb) {
    return this.meta(transactionKey, cb);
  }
}

export default TransactionResource;
