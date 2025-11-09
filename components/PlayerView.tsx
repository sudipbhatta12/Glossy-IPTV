import React, { useEffect } from 'react';
import { Channel } from '../types';
import VideoPlayer from './VideoPlayer';
import { CloseIcon } from './icons/CloseIcon';

interface PlayerViewProps {
  channel: Channel;
  onClose: () => void;
}

const PlayerView: React.FC<PlayerViewProps> = ({ channel, onClose }) => {
  useEffect(() => {
    // Prevent background scrolling when player is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
      <div
        className="relative bg-gray-900 w-full max-w-4xl h-full md:h-auto md:max-h-[90vh] rounded-lg shadow-2xl flex flex-col overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full aspect-video bg-black flex-shrink-0">
          <VideoPlayer src={channel.stream} />
        </div>
        
        <div className="p-6 overflow-y-auto">
          <h2 className="text-3xl font-bold text-white">{channel.name}</h2>
          <div className="flex items-center space-x-4 mt-2 text-gray-400">
            {channel.country && <span>{channel.country}</span>}
            {channel.country && channel.genres.length > 0 && <span>&bull;</span>}
            {channel.genres.length > 0 && <span className="truncate">{channel.genres.join(', ')}</span>}
          </div>
          <p className="mt-4 text-gray-300">
            This is a placeholder for a channel description. More details about the program, schedule, and other relevant information could be displayed here.
          </p>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-white/20 transition-colors duration-200"
          aria-label="Close player"
        >
          <CloseIcon className="w-6 h-6 text-white" />
        </button>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PlayerView;
