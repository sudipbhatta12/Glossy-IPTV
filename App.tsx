import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Channel } from './types';
import { fetchAndParseM3U } from './services/m3uParser';
import Header from './components/Header';
import ChannelGrid from './components/ChannelGrid';
import PlayerView from './components/PlayerView';
import FilterChips from './components/FilterChips';
import { SpinnerIcon } from './components/icons/SpinnerIcon';

// Default playlist URL
const DEFAULT_PLAYLIST_URL = 'https://iptv-org.github.io/iptv/index.m3u';

const App: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  
  const [countries, setCountries] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadChannels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const parsedChannels = await fetchAndParseM3U(DEFAULT_PLAYLIST_URL);
      setChannels(parsedChannels);

      // Extract unique countries and genres for filtering
      const countrySet = new Set<string>();
      const genreSet = new Set<string>();
      parsedChannels.forEach(channel => {
        if (channel.country) countrySet.add(channel.country);
        channel.genres.forEach(genre => genreSet.add(genre));
      });

      // Sort alphabetically
      setCountries(['All', ...Array.from(countrySet).sort()]);
      setGenres(['All', ...Array.from(genreSet).sort()]);

    } catch (e) {
      setError('Failed to load playlist. Please check the URL or your network connection.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  const filteredChannels = useMemo(() => {
    return channels.filter(channel => {
      const matchesCountry = !selectedCountry || selectedCountry === 'All' || channel.country === selectedCountry;
      const matchesGenre = !selectedGenre || selectedGenre === 'All' || channel.genres.includes(selectedGenre);
      const matchesSearch = !searchQuery || channel.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCountry && matchesGenre && matchesSearch;
    });
  }, [channels, selectedCountry, selectedGenre, searchQuery]);
  
  const handleSelectChannel = (channel: Channel) => {
    setSelectedChannel(channel);
  };

  const handleClosePlayer = () => {
    setSelectedChannel(null);
  };

  const handleRefresh = () => {
    localStorage.removeItem('iptv_cache');
    localStorage.removeItem('iptv_cache_timestamp');
    loadChannels();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white font-sans antialiased">
      <Header onSearch={setSearchQuery} onRefresh={handleRefresh} />

      <main className="container mx-auto px-4 py-8 pt-24 md:pt-28">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <SpinnerIcon className="w-12 h-12 text-cyan-400" />
          </div>
        ) : error ? (
          <div className="text-center py-10 px-4 bg-red-900/50 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">An Error Occurred</h2>
            <p className="text-red-300">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-6 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-full font-semibold transition-colors duration-300"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-3 text-gray-300">Filter by Country</h2>
              <FilterChips
                items={countries}
                selectedItem={selectedCountry}
                onSelectItem={setSelectedCountry}
              />
            </div>
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3 text-gray-300">Filter by Genre</h2>
              <FilterChips
                items={genres}
                selectedItem={selectedGenre}
                onSelectItem={setSelectedGenre}
              />
            </div>
            <ChannelGrid channels={filteredChannels} onSelectChannel={handleSelectChannel} />
          </>
        )}
      </main>

      {selectedChannel && (
        <PlayerView channel={selectedChannel} onClose={handleClosePlayer} />
      )}
    </div>
  );
};

export default App;
