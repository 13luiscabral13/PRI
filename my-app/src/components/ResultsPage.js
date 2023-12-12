import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGame } from './GameContext';
import GameCard from './GameCard';
import '../css/ResultsPage.css';

const ResultsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchText = searchParams.get('search');

  const { searchResults, setResults } = useGame();
  const [ relevantResults, setRelevantResults ] = useState([]);
  const [ nonRelevantResults, setNonRelevantResults ] = useState([]);

  useEffect(() => {
    const processQuery = async () => {
      try {
        const response = await fetch(`http://localhost:3001/get_games?query=${searchText}`);
        
        const data = await response.json();
        if (data.error) {
          setResults([]);
        } else {
          setResults(data);
        }

        setRelevantResults([]);
        setNonRelevantResults([]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    processQuery();
  }, [searchText]);

  useEffect(() => {
    setNonRelevantResults(searchResults);
  }, [searchResults]);

  const markAsRelevant = (document) => {
    setNonRelevantResults((prevNonRelevantResults) => prevNonRelevantResults.filter(doc => doc !== document));
    setRelevantResults((prevRelevantResults) => [...prevRelevantResults, document]);
  }
  
  const unmarkAsRelevant = (document) => {
    setRelevantResults((prevRelevantResults) => prevRelevantResults.filter(doc => doc !== document));
    setNonRelevantResults((prevNonRelevantResults) => [...prevNonRelevantResults, document]);
  }

  const handleMoreLikeThisSearchSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3001/get_more_games?query=${searchText}`, {
        method: "POST",
        body: JSON.stringify({
          relevantResults: relevantResults,
          nonRelevantResults: nonRelevantResults,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });

      const data = await response.json();
      if (data.error) {
        setResults([]);
      } else {
        setResults(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <div className='results-content'>
      <span className='results-header'>
        <div>
          <p>You search for: <strong>{searchText}</strong></p>
          <p>Returned {searchResults.length} results.</p>
          <p>Here they are:</p>
        </div>
        <button type="submit" className="search-button" onClick={handleMoreLikeThisSearchSubmit}>
          Search More Like This
        </button>
      </span>
      <div className='game-results'>
        {searchResults.map((result) => (
          <GameCard
            key={result.id}
            game={result}
            relevant={relevantResults.includes(result)}
            onMarkAsRelevant={markAsRelevant}
            onUnmarkAsRelevant={unmarkAsRelevant}
          />
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;
