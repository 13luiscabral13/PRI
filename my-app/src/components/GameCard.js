import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from './GameContext';
import '../css/GameCard.css';

const GameCard = ({ id, game, relevant, onMarkAsRelevant, onUnmarkAsRelevant }) => {
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
          <input className='mark-relevant-checkbox' type='checkbox' checked={relevant} onChange={toggleMarkAsRelevant}></input>
        </span>
      </span>
      <div className={`summary ${showMore ? 'expanded' : ''}`}>
        {game.summary}
      </div>

      {game.summary.length > 900 && !showMore && (
        <span className='show-more-button' onClick={toggleShowMore}>
          ▼ Show More
        </span>
      )}

      {showMore && (
        <span className='show-more-button' onClick={toggleShowMore}>
          ▲ Show Less
        </span>
      )}
      <div id="more-info">
      <p><strong><i>{formattedReleaseDate}</i></strong> </p>
      <p>{game.genre}</p>
      </div>
    </div>
  );

};

export default GameCard;