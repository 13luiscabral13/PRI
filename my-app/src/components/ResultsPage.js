import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGame } from './GameContext';
import GameCard from './GameCard';

const ResultsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchText = searchParams.get('search');

  const { searchResults, setResults } = useGame();

  console.log("Search text: ", searchText);

  useEffect(() => {
    const processQuery = async () => {
      try {
        const editedSearchText = searchText.replaceAll(" ", '%20');

        const domain = "http://localhost:8983/solr/games/select?";
        const op = "%20OR%20";
        const bq = "bq=%7B!child%20of%3D%22*%3A*%20-_nest_path_%3A*%22%7D";
        const bqName = "name%3A(" + editedSearchText + ")%5E2";
        const bqSummary = "summary%3A(" + editedSearchText + ")";
        const bqWikipedia = "wikipedia%3A(" + editedSearchText + ")%5E2";
        const bqGenre = "genre%3A(" + editedSearchText + ")%5E3";
        const others = "&defType=edismax&fl=*%2C%5Bchild%5D&fq=%7B!child%20of%3D%22*%3A*%20-_nest_path_%3A*%22%7Dname%3A*&indent=true&q.op=OR&";
        const q = "q=(" + editedSearchText + ")&";
        const qf = "qf=platform%5E8%20review%5E2";
        const extra = "&rows=1000&useParams=&wt=json";

        const link = domain+bq+bqName+op+bqSummary+op+bqWikipedia+op+bqGenre+others+q+qf+extra;
        const encodedLink = encodeURIComponent(link);

        const response = await fetch(`http://localhost:3001/get_games?url=${encodedLink}`);
        console.log("Received response");
        const data = await response.json();
        console.log("Converting to json");

        setResults(data);

        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle the error if needed
      }
    };

    processQuery();
  }, [searchText, setResults]); // O array vazio assegura que o useEffect é chamado apenas uma vez, equivalente ao componentDidMount

  return (
    <div>
      <h2>Search Results</h2>
      <p>Showing results for: {searchText}</p>
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
