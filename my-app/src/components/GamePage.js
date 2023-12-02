import React from 'react';
import { useParams } from 'react-router-dom';

const GamePage = () => {
  const { gameId } = useParams();

  // Fetch game details based on gameId from your API or data source
  // ...

  return (
    <div>
      <h2>Game Details</h2>
      <p>Game ID: {gameId}</p>
      {/* Display other game details */}
    </div>
  );
};

export default GamePage;
