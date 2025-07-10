// Re-export the actual implementations
import GameResource from './gameResource';
export { GameResource as Game };

export class League {
  constructor(private yf: any) {}
}

export class Player {
  constructor(private yf: any) {}
}

export class Roster {
  constructor(private yf: any) {}
}

export class Team {
  constructor(private yf: any) {}
}

export class Transaction {
  constructor(private yf: any) {}
}

export class User {
  constructor(private yf: any) {}
}