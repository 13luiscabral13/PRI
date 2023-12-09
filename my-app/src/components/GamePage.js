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

  useEffect(() => {
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
      setSelectedPlatform(Object.keys(reviewsByPlatform)[0]); // Define a primeira plataforma como selecionada inicialmente
      setSelectedInfo('wikipedia');
    }
  }, [gameData]);

  if (!gameData) {
    return <div>Error: Game data not found</div>;
  }

  const platforms = Object.keys(groupedReviews);

  return (
    <div>
      <h2>{gameData.name}</h2>

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
      <Tabs platforms={platforms} selectedPlatform={selectedPlatform} onSelect={setSelectedPlatform} />

      <p>What people think of {gameData.name} on the {selectedPlatform}</p>

      {selectedPlatform && (
        <Reviews reviews={groupedReviews[selectedPlatform]} />
      )}
    </div>
  );
};

export default GamePage;
