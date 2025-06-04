export interface CardType {
  id: string;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameResult {
  gameNumber: number;
  moves: number;
  duration: number;
  playerName: string;
}