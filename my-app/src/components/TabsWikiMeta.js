import React from 'react';
import '../css/TabsWikimeta.css';

const TabsWikimeta = ({ selectedInfo, onSelect }) => {
  return (
    <div className="tabs-info">
        <button
          key = 'wikipedia'
          onClick={() => onSelect('wikipedia')}
          className={`tab-button ${selectedInfo === 'wikipedia' ? 'active' : ''}`}
        >
          {'wikipedia'}
        </button>

        <button
          key = 'metacritic'
          onClick={() => onSelect('metacritic')}
          className={`tab-button ${selectedInfo === 'metacritic' ? 'active' : ''}`}
        >
          {'metacritic'}
        </button>
    </div>
  );
};

export default TabsWikimeta;