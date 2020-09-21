import { mapTransactionPlayers } from "../helpers/transactionHelper.mjs";

// TODO: PUT (accept/disallow/reject trades/vote against)
// TODO: DELETE (cancel pending claim or trade)
class TransactionResource {
  constructor(yf) {
    this.yf = yf;
  }

  meta(transactionKey, cb = () => {}) {
    return this.yf
      .api(
        this.yf.GET,
        `https://fantasysports.yahooapis.com/fantasy/v2/transaction/${transactionKey}/players`
      )
      .then((data) => {
        const transaction = data.fantasy_content.transaction[0];

        const players = mapTransactionPlayers(
          data.fantasy_content.transaction[1].players
        );

        transaction.players = players;
        cb(null, transaction);
        return transaction;
      })
      .catch((e) => {
        cb(e);
        throw e;
      });
  }

  players(transactionKey, cb = () => {}) {
    return this.meta(transactionKey, cb);
  }
}

export default TransactionResource;
