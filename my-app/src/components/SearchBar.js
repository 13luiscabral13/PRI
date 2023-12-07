import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faGamepad } from '@fortawesome/free-solid-svg-icons'



import '../css/SearchBar.css';

library.add(faGamepad)
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(`/results?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <form className="search-bar" onSubmit={handleSearchSubmit}>
      <input
        type="text"
        placeholder="Any game you're thinking of?"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />
      <button type="submit" className="search-button"><FontAwesomeIcon icon={["fas", "gamepad"]}/></button>
    </form>
  );
};

export default SearchBar;
