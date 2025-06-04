import { CardType } from './types';

export const createShuffledCards = (): CardType[] => {
  const symbols = ['🍎', '🍌', '🍒', '🍇', '🍊', '🍍', '🍓', '🍉'];

  const cards: CardType[] = symbols.flatMap((symbol) => [
    { id: `${symbol}-${1}`, symbol, isFlipped: false, isMatched: false },
    { id: `${symbol}-${2}`, symbol, isFlipped: false, isMatched: false },
  ]);

  // Перемішування карток (алгоритм Фішера-Йетса)
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
};