import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGame } from './GameContext';
import GameCard from './GameCard';

const ResultsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchText = searchParams.get('search');

  const { searchResults, setResults } = useGame();

  useEffect(() => {
    const processQuery = async () => {
      try {
        const response = await fetch(`http://localhost:3001/get_games?query=${searchText}`);
        const data = await response.json();

        setResults(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    processQuery();
  }, [searchText, setResults]); // O array vazio assegura que o useEffect é chamado apenas uma vez, equivalente ao componentDidMount

  return (
    <div>
      <h2>Showing results for: {searchText}</h2>
        <div>
          {searchResults.map((result) => (
            <GameCard
              key={result.id}
              game = {result}
            />
          ))}
        </div>
    </div>
  );
};

export default ResultsPage;
