// GamePage.js
import { useState, useEffect } from 'react';
import { useGame } from './GameContext';
import Tabs from './Tabs';
import Reviews from './Reviews';

const GamePage = () => {
  const { gameData } = useGame();
  const [groupedReviews, setGroupedReviews] = useState({});
  const [selectedPlatform, setSelectedPlatform] = useState(null);

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
    }
  }, [gameData]);

  if (!gameData) {
    return <div>Error: Game data not found</div>;
  }

  const platforms = Object.keys(groupedReviews);

  return (
    <div>
      <h2>Game Details</h2>
      <p>Name: {gameData.name}</p>
      <p>Summary: {gameData.summary}</p>
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
