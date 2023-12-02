// Results.js

import React from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import GameCard from './GameCard';
import GamePage from './GamePage';

const ResultsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search');

  // Mock data for demonstration purposes
  const searchResults = [
    {
      id: 1,
      title: 'Example Game 1',
      summary: 'This is the summary for Example Game 1.',
      releaseDate: '2023-01-01',
    },
    {
      id: 2,
      title: 'Example Game 2',
      summary: 'This is the summary for Example Game 2.',
      releaseDate: '2023-02-01',
    },
    // Add more search result items as needed
  ];

  return (
    <div>
      <h2>Search Results</h2>
      <p>Showing results for: {searchTerm}</p>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              {searchResults.map((result) => (
                <GameCard
                  key={result.id}
                  id={result.id}
                  title={result.title}
                  summary={result.summary}
                  releaseDate={result.releaseDate}
                />
              ))}
            </div>
          }
        />
        <Route path="/game/:gameId" element={<GamePage />} />
      </Routes>
    </div>
  );
};

export default ResultsPage;
