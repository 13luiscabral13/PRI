import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from './GameContext';
import '../css/GameCard.css';

const GameCard = ({ id, game, onMarkAsRelevant, onUnmarkAsRelevant }) => {
  const { setGame } = useGame();
  const [showMore, setShowMore] = useState(false);

  const handleClick = () => {
    setGame(game);
  };

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const toggleMarkAsRelevant = (e) => {
    if (e.target.checked) {
      onMarkAsRelevant(game);
    } else {
      onUnmarkAsRelevant(game);
    }
  }

  const firstRelease = game.reviews.reduce((earliestDate, review) => {
    const reviewDate = new Date(review.release_date);
    return !earliestDate || reviewDate < earliestDate ? reviewDate : earliestDate;
  }, null);

  const formattedReleaseDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(firstRelease);

  return (
    <div className='game-card'>
      <span className='card-header'>
        <Link to={`/game/${game.name}`} onClick={handleClick} className='game-name'>
          <h3>{game.name}</h3>
        </Link>
        <span className='mark-relevant'>
          <span>Relevant?</span>
          <input className='mark-relevant-checkbox' type='checkbox' onChange={toggleMarkAsRelevant}></input>
        </span>
      </span>
      <div className={`summary ${showMore ? 'expanded' : ''}`}>
        {game.summary}
      </div>
      {game.summary.length > 700 && !showMore && (
        <span className='show-more-button' onClick={toggleShowMore}>
          See More
        </span>
      )}
      {showMore && (
        <span className='show-more-button' onClick={toggleShowMore}>
          See Less
        </span>
      )}
      <p>Genre: {game.genre}</p>
      <p><strong>{formattedReleaseDate}</strong> </p>
    </div>
  );
};

export default GameCard;