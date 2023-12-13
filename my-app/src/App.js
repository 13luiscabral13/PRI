import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResultsPage from './components/ResultsPage';
import GamePage from './components/GamePage';
import { GameProvider } from './components/GameContext';
import HomePage from './components/HomePage';

function App() {
  return (
    <div className="App">
      <GameProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<HomePage/>} />
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
