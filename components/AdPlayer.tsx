import React, { useState, useEffect, useRef } from 'react';
import type { VideoAd } from '../types';
import VolumeUpIcon from './icons/VolumeUpIcon';
import VolumeOffIcon from './icons/VolumeOffIcon';

interface AdPlayerProps {
  ad: VideoAd;
  onAdFinish: () => void;
}

const AdPlayer: React.FC<AdPlayerProps> = ({ ad, onAdFinish }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [timeLeft, setTimeLeft] = useState(Math.ceil(ad.duration));
  const [canSkip, setCanSkip] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    const timeUpdateHandler = () => {
        if (video.currentTime >= ad.skipDelay) {
            setCanSkip(true);
        }
    };

    video.addEventListener('timeupdate', timeUpdateHandler);
    video.addEventListener('ended', onAdFinish);

    return () => {
      clearInterval(timer);
      video.removeEventListener('timeupdate', timeUpdateHandler);
      video.removeEventListener('ended', onAdFinish);
    };
  }, [onAdFinish, ad.skipDelay, ad.duration]);
  
  // Sync volume/mute state with video element
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
        video.muted = isMuted;
        video.volume = volume;
    }
  }, [volume, isMuted]);

  const handleAdClick = () => {
    window.open(ad.linkUrl, '_blank', 'noopener,noreferrer');
  };

  const handleControlClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent ad click-through when interacting with controls.
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    // If unmuting when volume is 0, restore it to a sensible level.
    if (isMuted && volume === 0) {
        setVolume(0.5);
    }
    setIsMuted(prev => !prev);
  };
  
  const VolumeIcon = isMuted || volume === 0 ? VolumeOffIcon : VolumeUpIcon;

  return (
    <div className="relative w-full h-full bg-black">
      <video
        ref={videoRef}
        className="w-full h-full cursor-pointer"
        src={ad.videoUrl}
        autoPlay
        playsInline
        onClick={handleAdClick}
      />
      <div 
          className="absolute bottom-4 left-4 flex items-center space-x-4 bg-black bg-opacity-70 text-white p-2 rounded"
          onClick={handleControlClick}
      >
          <span className="text-sm">Ad: {timeLeft}s</span>
          <div className="flex items-center space-x-2">
              <button onClick={toggleMute} className="focus:outline-none">
                  <VolumeIcon />
              </button>
              <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 accent-red-600 cursor-pointer"
              />
          </div>
      </div>
      <div className="absolute bottom-4 right-4">
        {canSkip ? (
          <button
            onClick={onAdFinish}
            className="bg-black bg-opacity-70 text-white text-sm py-2 px-4 rounded hover:bg-opacity-90"
          >
            Skip Ad
          </button>
        ) : (
          <span className="text-white text-sm p-2">
              Skip in {Math.max(0, ad.skipDelay - Math.floor(videoRef.current?.currentTime || 0))}s
          </span>
        )}
      </div>
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white text-xs p-1.5 rounded">
          <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer">{ad.title}</a>
      </div>
    </div>
  );
};

export default AdPlayer;
