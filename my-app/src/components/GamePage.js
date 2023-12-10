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

  const getReleaseDateByPlatform = (platform) => {
    const reviewForPlatform = gameData.reviews.find(review => review.platform === platform);
  
    // Verifica se encontrou uma entrada para a plataforma
    if (reviewForPlatform) {
      return reviewForPlatform.release_date;
    } else {
      // Retorna null ou uma string padrão se a plataforma não for encontrada
      return null;
    }
  };

  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform);
    
    const releaseDate = getReleaseDateByPlatform(platform);

    setSelectedReleaseDate(releaseDate.split('T')[0]);
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
      setSelectedInfo('wikipedia');
      handlePlatformSelect(Object.keys(reviewsByPlatform)[0]); // Define a primeira plataforma como selecionada inicialmente
    }
  }, [gameData]);

  if (!gameData) {
    return <div>Error: Game data not found</div>;
  }

  const platforms = Object.keys(groupedReviews);

  return (
    <div className='game-content'>
      <h2>{gameData.name}</h2>

      <p>Release date: {selectedReleaseDate}</p>

      <TabsWikimeta selectedInfo={selectedInfo} onSelect={setSelectedInfo} />

      <div className='info'>
        {selectedInfo==='wikipedia' && (
          <p>{gameData.wikipedia}</p>
        )}

        {selectedInfo==='metacritic' && (
          <p>{gameData.summary}</p>
        )}
      </div>
      
      <p>Genre: {gameData.genre}</p>

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
