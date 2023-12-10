import React from 'react';
import '../css/TabsWikimeta.css';

const TabsWikimeta = ({ selectedInfo, onSelect }) => {
  return (
    <div className="tabs-info">
        <button
          key = 'Wikipedia'
          onClick={() => onSelect('Wikipedia')}
          className={`tab-button ${selectedInfo === 'Wikipedia' ? 'active' : ''}`}
        >
          {'Wikipedia'}
        </button>

        <button
          key = 'Metacritic'
          onClick={() => onSelect('Metacritic')}
          className={`tab-button ${selectedInfo === 'Metacritic' ? 'active' : ''}`}
        >
          {'Metacritic'}
        </button>
    </div>
  );
};

export default TabsWikimeta;