// src/pages/Game.tsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  incrementMoves,
  setStartTime,
  setCurrentTime,
  setCards,
  resetGame,
  addResult,
} from '../gameSlice';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import styles from './Game.module.css';

const Game: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { moves, cards, nextGameNumber, playerName, startTime, currentTime } = useSelector(
    (state: RootState) => state.game
  );

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [resultSaved, setResultSaved] = useState(false);

  useEffect(() => {
    if (isGameStarted && !cards.every((card) => card.isMatched)) {
      const timer = setInterval(() => {
        if (startTime) {
          const elapsed = Date.now() - startTime;
          dispatch(setCurrentTime(elapsed));
        }
      }, 1000); // Оновлено до 1000ms
      return () => clearInterval(timer);
    }
  }, [isGameStarted, startTime, dispatch]);

  useEffect(() => {
    if (cards.every((card) => card.isMatched) && !resultSaved) {
      setResultSaved(true);
      const duration = Math.floor(currentTime / 1000);

      dispatch(
        addResult({
          gameNumber: nextGameNumber,
          moves,
          duration,
          playerName: playerName || 'Гість',
        })
      );

      setTimeout(() => {
        dispatch(resetGame());
        setIsGameStarted(false);
        setResultSaved(false);
        navigate('/');
      }, 1500);
    }
  }, [cards, resultSaved, dispatch, navigate, nextGameNumber, moves, currentTime, playerName]);

  const handleCardClick = (id: string) => {
    if (!isGameStarted) {
      const now = Date.now();
      dispatch(setStartTime(now));
      dispatch(setCurrentTime(0));
      setIsGameStarted(true);
    }

    const flippedCards = cards.filter((card) => card.isFlipped && !card.isMatched);
    if (flippedCards.length >= 2) return;

    const updatedCards = cards.map((card) =>
      card.id === id && !card.isFlipped && !card.isMatched
        ? { ...card, isFlipped: true }
        : card
    );
    dispatch(setCards(updatedCards));

    if (flippedCards.length === 1) {
      dispatch(incrementMoves());
      const [firstCard] = flippedCards;
      const secondCard = updatedCards.find((card) => card.id === id)!;

      if (firstCard.symbol !== secondCard.symbol) {
        setTimeout(() => {
          const resetCards = updatedCards.map((card) =>
            card.isFlipped && !card.isMatched ? { ...card, isFlipped: false } : card
          );
          dispatch(setCards(resetCards));
        }, 1000);
      } else {
        const matchedCards = updatedCards.map((card) =>
          card.symbol === firstCard.symbol ? { ...card, isMatched: true } : card
        );
        dispatch(setCards(matchedCards));
      }
    }
  };

  return (
    <div className={styles.game}>
      <h1 className={styles.title}>Memory Game</h1>
      <p className={styles.info}>Moves: {moves}</p>
      <p className={styles.info}>Time: {Math.floor(currentTime / 1000)}s</p>
      <p className={styles.info}>Player: {playerName || 'Гість'}</p>

      <div className={styles.controlButtons}>
        <button
          className={styles.button}
          onClick={() => {
            dispatch(resetGame());
            setIsGameStarted(false);
            setResultSaved(false);
          }}
        >
          Restart
        </button>
        <button className={styles.button} onClick={() => navigate('/')}>
          Повернутися на головну
        </button>
      </div>

      <div className={styles.grid}>
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={() => handleCardClick(card.id)} />
        ))}
      </div>
    </div>
  );
};

export default Game;