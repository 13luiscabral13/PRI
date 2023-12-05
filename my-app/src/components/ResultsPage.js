// Results.js

import React from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import GameCard from './GameCard';

const ResultsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchText = searchParams.get('search');

  console.log("Search text: ", searchText);

  const processQuery = async () => {
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
    fetch(`http://localhost:3001/get_games?url=${encodedLink}`)
    .then(response => response.text())
    .then(result => {
      console.log(result); // Output: "Result: 5"
    })
    .catch(error => console.error('Error:', error));
  }

  processQuery();

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
      <p>Showing results for: {searchText}</p>
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
    </div>
  );
};

export default ResultsPage;
