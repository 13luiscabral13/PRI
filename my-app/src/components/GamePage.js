// GamePage.js
import { useGame } from './GameContext';

const GamePage = () => {
  const { gameData } = useGame();

  const processReviews= () => {
    const reviews = {};
    gameData.reviews.map((review, index) => {
      console.log(`Review ${index + 1}:`);
      console.log(`Platform: ${review.platform}`);
      console.log(`Release Date: ${review.release_date}`);
      console.log(`Meta Score: ${review.meta_score}`);
      console.log(`User Review: ${review.user_review}`);
      console.log(`Reviewer: ${review.reviewer}`);
      console.log('------------------------');
      return null; // Map function expects a return value
    });
  };

  processReviews();

  if (!gameData) {
    return <div>Error: Game data not found</div>;
  }

  return (
    <div>
      <h2>Game Details</h2>
      <p>Name: {gameData.name}</p>
      <p>Summary: {gameData.summary}</p>
      <p>Genre: {gameData.genre}</p>
      {/* Display other game details */}
    </div>
  );
};

export default GamePage;
