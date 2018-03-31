import { mapPlayer } from "./playerHelper.mjs";

export function mapTransactionPlayers(ps) {
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
