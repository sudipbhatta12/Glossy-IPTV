import React, { useState } from 'react';
import { SearchIcon } from './icons/SearchIcon';

interface HeaderProps {
  onSearch: (query: string) => void;
  onRefresh: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/70 backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4 h-16 md:h-20 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.25 21.375L15.75 16.5L8.25 11.625V21.375Z" fill="currentColor" opacity="0.4"/>
            <path d="M15.75 7.5L8.25 2.625V11.625L15.75 7.5Z" fill="currentColor"/>
          </svg>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-wider">Glossy IPTV</h1>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <div className={`flex items-center transition-all duration-300 ${isSearchVisible ? 'w-48 md:w-64' : 'w-0'}`}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search channels..."
              className={`bg-white/10 text-white placeholder-gray-400 rounded-full px-4 py-1.5 w-full outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 ${isSearchVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{ visibility: isSearchVisible ? 'visible' : 'hidden' }}
            />
          </div>
          <button
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
            aria-label="Search channels"
          >
            <SearchIcon className="w-6 h-6 text-gray-300" />
          </button>
          
          <button
            onClick={onRefresh}
            className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
            aria-label="Refresh playlist"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 15M20 20l-1.5-1.5A9 9 0 013.5 9" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
