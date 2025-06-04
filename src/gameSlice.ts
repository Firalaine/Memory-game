import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CardType, GameResult } from './types';
import { createShuffledCards } from './data';

interface GameState {
  moves: number;
  startTime: number | null;
  currentTime: number;
  cards: CardType[];
  results: GameResult[];
  nextGameNumber: number;
  playerName: string;
}

interface StoredGameResult {
  gameNumber?: number;
  moves?: number;
  duration?: number;
  playerName?: string;
}

const initialState: GameState = {
  moves: 0,
  startTime: null,
  currentTime: 0,
  cards: createShuffledCards(),
  results: (() => {
    try {
      const savedResults = localStorage.getItem('gameResults');
      if (!savedResults) return [];
      const parsed: unknown = JSON.parse(savedResults);

      if (!Array.isArray(parsed)) return [];

      return parsed.map((result: unknown): GameResult => {
        if (typeof result === 'object' && result !== null) {
          const r = result as StoredGameResult;
          return {
            gameNumber: typeof r.gameNumber === 'number' ? r.gameNumber : 1,
            moves: typeof r.moves === 'number' ? r.moves : 0,
            duration: typeof r.duration === 'number' ? r.duration : 0,
            playerName: typeof r.playerName === 'string' ? r.playerName : 'Гість',
          };
        }
        return {
          gameNumber: 1,
          moves: 0,
          duration: 0,
          playerName: 'Гість',
        };
      });
    } catch (error) {
      console.error('Failed to parse gameResults from localStorage:', error);
      return [];
    }
  })(),
  nextGameNumber: (() => {
    try {
      const savedResults = localStorage.getItem('gameResults');
      if (!savedResults) return 1;
      const results: unknown = JSON.parse(savedResults);
      if (!Array.isArray(results) || results.length === 0) return 1;
      const lastResult = results[results.length - 1];
      if (typeof lastResult === 'object' && lastResult !== null) {
        const r = lastResult as StoredGameResult;
        return typeof r.gameNumber === 'number' ? r.gameNumber + 1 : 1;
      }
      return 1;
    } catch (error) {
      console.error('Failed to calculate nextGameNumber:', error);
      return 1;
    }
  })(),
  playerName: '',
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    incrementMoves: (state) => {
      state.moves += 1;
    },
    setStartTime: (state, action: PayloadAction<number | null>) => {
      state.startTime = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setCards: (state, action: PayloadAction<CardType[]>) => {
      state.cards = action.payload;
    },
    setPlayerName: (state, action: PayloadAction<string>) => {
      state.playerName = action.payload;
    },
    resetGame: (state) => {
      state.moves = 0;
      state.startTime = null;
      state.currentTime = 0;
      state.cards = createShuffledCards();
    },
    addResult: (state, action: PayloadAction<GameResult>) => {
      try {
        const newResults = [...state.results, action.payload].slice(-10);
        state.results = newResults;
        state.nextGameNumber = action.payload.gameNumber + 1;
        localStorage.setItem('gameResults', JSON.stringify(newResults));
      } catch (error) {
        console.error('Failed to save results to localStorage:', error);
      }
    },
    clearResults: (state) => {
      try {
        state.results = [];
        state.nextGameNumber = 1;
        localStorage.removeItem('gameResults');
      } catch (error) {
        console.error('Failed to clear results from localStorage:', error);
      }
    },
  },
});

export const {
  incrementMoves,
  setStartTime,
  setCurrentTime,
  setCards,
  setPlayerName,
  resetGame,
  addResult,
  clearResults,
} = gameSlice.actions;

export default gameSlice.reducer;
