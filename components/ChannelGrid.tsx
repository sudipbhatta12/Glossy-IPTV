import React from 'react';
import { Channel } from '../types';
import ChannelCard from './ChannelCard';

interface ChannelGridProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
}

const ChannelGrid: React.FC<ChannelGridProps> = ({ channels, onSelectChannel }) => {
  if (channels.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-gray-800/50 rounded-lg">
        <h2 className="text-2xl font-bold mb-2 text-gray-300">No Channels Found</h2>
        <p className="text-gray-400">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-6">
      {channels.map((channel) => (
        <ChannelCard key={channel.id} channel={channel} onSelect={onSelectChannel} />
      ))}
    </div>
  );
};

export default ChannelGrid;
