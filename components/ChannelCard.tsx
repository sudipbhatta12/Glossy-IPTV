import React from 'react';
import { Channel } from '../types';
import useTilt from '../hooks/useTilt';
import { PlayIcon } from './icons/PlayIcon';

interface ChannelCardProps {
  channel: Channel;
  onSelect: (channel: Channel) => void;
}

const FallbackLogo: React.FC<{ name: string }> = ({ name }) => {
    const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
            <span className="text-2xl font-bold text-white">{initials}</span>
        </div>
    );
};


const ChannelCard: React.FC<ChannelCardProps> = ({ channel, onSelect }) => {
  const tiltRef = useTilt(8);

  const getCountryFlagUrl = (countryName: string | null) => {
    if (!countryName) return null;
    // Simple mapping to get 2-letter code for flagcdn
    // This is a naive implementation and would need a proper library for production
    const countryCode = Object.keys(COUNTRY_NAME_TO_CODE_MAP).find(
        key => COUNTRY_NAME_TO_CODE_MAP[key].toLowerCase() === countryName.toLowerCase()
    );
    return countryCode ? `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png` : null;
  };

  const flagUrl = getCountryFlagUrl(channel.country);

  return (
    <div
      ref={tiltRef}
      onClick={() => onSelect(channel)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(channel)}
      className="group relative rounded-2xl overflow-hidden cursor-pointer transform-style-3d will-change-transform focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-75"
      tabIndex={0}
      aria-label={`Play ${channel.name}`}
    >
      {/* Main card content */}
      <div className="aspect-[3/4] bg-gray-800 rounded-2xl overflow-hidden p-3 shadow-2xl border border-white/10 flex flex-col justify-end relative z-10 bg-gradient-to-b from-black/20 to-black/80">
          <div className="absolute inset-0 z-0">
             {channel.logo ? (
                <img
                    src={channel.logo}
                    alt={`${channel.name} logo`}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                />
             ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 opacity-50"/>
             )}
          </div>

          <div className="relative z-10 flex flex-col justify-end h-full p-2 text-white">
            <div className="flex-grow flex items-center justify-center">
                 {channel.logo ? (
                    <img
                        src={channel.logo}
                        alt={`${channel.name} logo`}
                        loading="lazy"
                        className="max-h-24 max-w-[80%] object-contain drop-shadow-lg"
                    />
                ) : (
                    <FallbackLogo name={channel.name}/>
                )}
            </div>
            <div className="mt-4">
                <h3 className="font-bold text-lg truncate" title={channel.name}>
                    {channel.name}
                </h3>
                <div className="flex items-center text-xs text-gray-400 mt-1 space-x-2">
                    {flagUrl && <img src={flagUrl} alt={channel.country || ''} className="w-5 h-auto"/>}
                    <span className="truncate">{channel.genres[0] || 'General'}</span>
                </div>
            </div>
        </div>
      </div>
      
      {/* Glossy shine effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 via-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl z-20 pointer-events-none" />

      {/* Play Icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-30">
        <div className="bg-black/50 backdrop-blur-sm rounded-full p-4">
            <PlayIcon className="w-10 h-10 text-white" />
        </div>
      </div>
    </div>
  );
};

// Simplified mapping for demo purposes.
const COUNTRY_NAME_TO_CODE_MAP: { [key: string]: string } = {
  US: 'United States',
  GB: 'United Kingdom',
  CA: 'Canada',
  AU: 'Australia',
  DE: 'Germany',
  FR: 'France',
  ES: 'Spain',
  IT: 'Italy',
  NL: 'Netherlands',
  IN: 'India',
  JP: 'Japan',
  CN: 'China',
  RU: 'Russia',
  BR: 'Brazil',
  MX: 'Mexico',
  ZA: 'South Africa',
};


export default ChannelCard;
