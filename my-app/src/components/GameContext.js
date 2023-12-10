// GameContext.js
import { createContext, useContext, useState } from 'react';

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const [gameData, setGameData] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const setGame = (data) => {
    setGameData(data);
  };

  const setResults = (results) => {
    setSearchResults(results);
  };

  return (
    <GameContext.Provider value={{ gameData, setGame, searchResults, setResults }}>
      {children}
    </GameContext.Provider>
  );
};

const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export { GameProvider, useGame };
