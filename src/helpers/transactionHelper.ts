import type { MappedPlayer } from '../types/api-responses';
import { mapPlayer } from './playerHelper';
import { yahooArray } from './sharedHelper';

export function mapTransactionPlayers(ps: any): MappedPlayer[] {
  return yahooArray(ps).map((p: any) => {
    const player = mapPlayer(p.player[0]);
    player.transaction = Array.isArray(p.player[1].transaction_data)
      ? p.player[1].transaction_data[0]
      : p.player[1].transaction_data;

    return player;
  });
}

export function parseTransactionCollection(ts: any): any[] {
  return yahooArray(ts)
    .filter((t: any) => t?.transaction)
    .map((t: any) => {
      const transaction = t.transaction[0];

      // If the transaction has players, map them
      if (t.transaction[1]?.players) {
        transaction.players = mapTransactionPlayers(t.transaction[1].players);
      }

      return transaction;
    });
}
