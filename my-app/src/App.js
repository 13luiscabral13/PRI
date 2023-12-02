import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import ResultsPage from './components/ResultsPage';
import GamePage from './components/GamePage';

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <SearchBar />
          <Routes>
            <Route path="/results/*" element={<ResultsPage />} />
            <Route path="/game/:gameId" element={<GamePage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
