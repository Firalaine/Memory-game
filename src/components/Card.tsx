// src/components/Card.tsx
import { CardType } from '../types';
import styles from './Card.module.css';

interface CardProps {
  card: CardType;
  onClick: () => void;
}

export const Card: React.FC<CardProps> = ({ card, onClick }) => {
  return (
    <div
      className={`${styles.card} ${card.isFlipped ? styles.flipped : ''} ${
        card.isMatched ? styles.matched : ''
      }`}
      onClick={onClick}
    >
      {card.isFlipped || card.isMatched ? card.symbol : '?'}
    </div>
  );
};