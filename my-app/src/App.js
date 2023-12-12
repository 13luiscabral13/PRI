import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import ResultsPage from './components/ResultsPage';
import GamePage from './components/GamePage';
import InitialLogoTop from './components/InitialLogoTop';
import InitialLogoBottom from './components/InitialLogoBottom';
import { GameProvider } from './components/GameContext';

function App() {
  return (
    <div className="App">
      <GameProvider>
      <Router>
        <div>
          <InitialLogoTop />
          <SearchBar />
          <InitialLogoBottom />
          <Routes>
            <Route path="/results/*" element={<ResultsPage />} />
            <Route path="/game/:gameId" element={<GamePage />} />
          </Routes>
        </div>
      </Router>
      </GameProvider>
    </div>
  );
}

export default App;
