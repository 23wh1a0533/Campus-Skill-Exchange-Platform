import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchFilters = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('');

  const handleSearch = () => {
    onSearch({ query, skillLevel, location, availability });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by skill or name..."
            className="input-field pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <select className="input-field md:w-40" value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)}>
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Expert">Expert</option>
        </select>
        <input type="text" placeholder="Location" className="input-field md:w-40" value={location} onChange={(e) => setLocation(e.target.value)} />
        <select className="input-field md:w-40" value={availability} onChange={(e) => setAvailability(e.target.value)}>
          <option value="">All Modes</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
          <option value="Both">Both</option>
        </select>
        <button onClick={handleSearch} className="btn-primary md:w-auto">Search</button>
      </div>
    </div>
  );
};

export default SearchFilters;