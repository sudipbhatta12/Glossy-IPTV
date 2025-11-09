import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    Hls: any;
  }
}

interface VideoPlayerProps {
  src: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let hls: any;

    if (videoRef.current) {
      const video = videoRef.current;
      
      // Check if HLS is supported natively
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(error => console.error("Autoplay was prevented:", error));
        });
      } 
      // If HLS is not supported, use hls.js
      else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(error => console.error("Autoplay was prevented:", error));
        });
        hls.on(window.Hls.Events.ERROR, function (_event: any, data: any) {
            if (data.fatal) {
              console.error('HLS fatal error:', data);
            }
        });
      } else {
        console.error("HLS is not supported in this browser.");
      }
    }

    // Cleanup function to destroy hls instance on component unmount
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls
      className="w-full h-full"
      autoPlay
      playsInline
    />
  );
};

export default VideoPlayer;
