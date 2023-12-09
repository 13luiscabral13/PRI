import React from 'react';
import { Link } from 'react-router-dom';
import { useGame } from './GameContext';

const GameCard = ({ id, game }) => {
  const { setGame } = useGame();

  const handleClick = () => {
    setGame(game);
  };

  const firstRelease = game.reviews.reduce((earliestDate, review) => {
                              const reviewDate = new Date(review.release_date);
                              return !earliestDate || reviewDate < earliestDate ? reviewDate : earliestDate;
                            }, null);

  return (
    <div style={styles.card}>
      <Link to={`/game/${game.name}`} onClick={handleClick}>
        <h3>{game.name}</h3>
      </Link>
      <p>{game.summary}</p>
      <p>Genre: {game.genre}</p>
      <p>Release Date: {firstRelease.toISOString().split('T')[0]}</p>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ddd',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
};

export default GameCard;