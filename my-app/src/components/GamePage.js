// GamePage.js
import { useState, useEffect } from 'react';
import { useGame } from './GameContext';
import Tabs from './Tabs';
import Reviews from './Reviews';
import TabsWikimeta from './TabsWikiMeta';
import '../css/GamePage.css';

const GamePage = () => {
  const { gameData } = useGame();
  const [groupedReviews, setGroupedReviews] = useState({});
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [selectedReleaseDate, setSelectedReleaseDate] = useState(null);
  const [selectedUserScore, setSelectedUserScore] = useState(null);
  const [selectedMetacriticScore, setSelectedMetacriticScore] = useState(null);

  const setAttributesByPlatform = (platform) => {
    const reviewForPlatform = gameData.reviews.find(review => review.platform === platform);
  
    // Verifica se encontrou uma entrada para a plataforma
    if (reviewForPlatform) {
      const releaseDate = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(reviewForPlatform.release_date));

      const userScore = reviewForPlatform.user_review;
      const metaScore = reviewForPlatform.meta_score;

      setSelectedReleaseDate(releaseDate);
      setSelectedUserScore(userScore);
      setSelectedMetacriticScore(metaScore);
      
    }
  };

  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform);
    
    setAttributesByPlatform(platform);
  };

  useEffect( () => {
    if (gameData) {
      const reviewsByPlatform = gameData.reviews.reduce((acc, review) => {
        const platform = review.platform;

        if (!acc[platform]) {
          acc[platform] = [review];
        } else {
          acc[platform].push(review);
        }

        return acc;
      }, {});

      setGroupedReviews(reviewsByPlatform);
      setSelectedInfo('Wikipedia');
      handlePlatformSelect(Object.keys(reviewsByPlatform)[0]); // Define a primeira plataforma como selecionada inicialmente
    }
  }, [gameData]);

  if (!gameData) {
    return <div>Error: Game data not found</div>;
  }

  const platforms = Object.keys(groupedReviews);

  return (
    <div className='game-content'>
      <h2 className='game-name'>{gameData.name}</h2>

      <h3 className='game-date'><i>{selectedReleaseDate}</i></h3>

      <TabsWikimeta selectedInfo={selectedInfo} onSelect={setSelectedInfo} />

      <div className='info'>
        {selectedInfo==='Wikipedia' && (
          <p>{gameData.wikipedia}</p>
        )}

        {selectedInfo==='Metacritic' && (
          <p>{gameData.summary}</p>
        )}
      </div>
      
      <p>Genre: {gameData.genre}</p>

      <div className='game-score'>
        <div className='user-score'>
          <h4>User Score </h4>
          <span className='score-circle'>{selectedUserScore}</span>
        </div>
        <div className='meta-score'>
          <h4>Critics Score </h4>
          <span className='score-circle'>{selectedMetacriticScore}</span>
        </div>
      </div>    

      {/* Display other game details */}
      <Tabs platforms={platforms} selectedPlatform={selectedPlatform} onSelect={handlePlatformSelect} />

      <p>What people think of <strong>{gameData.name}</strong> on the <strong>{selectedPlatform}</strong></p>

      {selectedPlatform && (
        <Reviews reviews={groupedReviews[selectedPlatform]} />
      )}
    </div>
  );
};

export default GamePage;
