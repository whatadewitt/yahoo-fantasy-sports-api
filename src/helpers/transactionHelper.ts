import { mapPlayer } from "./playerHelper";
import { MappedPlayer } from "../types/api-responses";

export function mapTransactionPlayers(ps: any): MappedPlayer[] {
  const count = ps.count;
  const players = [];

  for (let i = 0; i < count; i++) {
    const player = mapPlayer(ps[i].player[0]);
    player.transaction = Array.isArray(ps[i].player[1].transaction_data)
      ? ps[i].player[1].transaction_data[0]
      : ps[i].player[1].transaction_data;

    players.push(player);
  }

  return players;
}

export function parseTransactionCollection(ts: any): any[] {
  const count = ts.count || 0;
  const transactions = [];

  for (let i = 0; i < count; i++) {
    if (ts[i] && ts[i].transaction) {
      const transaction = ts[i].transaction[0];
      
      // If the transaction has players, map them
      if (ts[i].transaction[1] && ts[i].transaction[1].players) {
        transaction.players = mapTransactionPlayers(ts[i].transaction[1].players);
      }
      
      transactions.push(transaction);
    }
  }

  return transactions;
}