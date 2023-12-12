// Tabs.js
import React from 'react';
import '../css/Tabs.css';

const Tabs = ({ platforms, selectedPlatform, onSelect }) => {
  return (
    <div className="tabs">
      {platforms.map((platform) => (
        <button
          key={platform}
          onClick={() => onSelect(platform)}
          className={`tab-button ${selectedPlatform === platform ? 'active' : ''}`}
        >
          {platform}
        </button>
      ))}
    </div>
  );
};

export default Tabs;