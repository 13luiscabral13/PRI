import React from 'react';
import { Link } from 'react-router-dom';

const GameCard = ({ id, title, summary, releaseDate }) => {
  return (
    <div style={styles.card}>
      <Link to={`/game/${id}`}>
        <h3>{title}</h3>
      </Link>
      <p>{summary}</p>
      <p>Release Date: {releaseDate}</p>
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