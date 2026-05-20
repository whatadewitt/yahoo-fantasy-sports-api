import { mapPlayer } from "./playerHelper";
import { MappedPlayer } from "../types/api-responses";
import { collectionItems } from "./requestHelper";

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
  return collectionItems(ts)
    .map((entry) => entry.transaction)
    .filter(Boolean)
    .map((transactionData) => {
      const transaction = transactionData[0];
      const players = transactionData[1]?.players;
      return players
        ? { ...transaction, players: mapTransactionPlayers(players) }
        : transaction;
    });
}
