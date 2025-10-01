import React, { useEffect, useRef, useState } from 'react';
import AdPlayer from './AdPlayer';
import CloseIcon from './icons/CloseIcon';
import Spinner from './icons/Spinner';

import { getPreRollAd, getMidRollAds, getPostRollAd, getAdForSeries } from '../services/mockAdService';
import { getCompanionAd } from '../services/mockCompanionAdService';
import type { ContentItem, VideoAd, CompanionAd, Episode } from '../types';

interface VideoPlayerProps {
  item: ContentItem | Episode;
  series?: ContentItem;
  onClose: () => void;
}

type PlaybackState = 'LOADING' | 'PRE_ROLL' | 'CONTENT' | 'MID_ROLL' | 'POST_ROLL' | 'FINISHED';

const getYoutubeEmbedUrl = (url: string): string | null => {
  let videoId = null;
  const standardMatch = url.match(/[?&]v=([^&]+)/);
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  const embedMatch = url.match(/youtube\.com\/embed\/([^?]+)/);

  if (embedMatch) {
    return url; // It's already an embed URL
  }
  if (standardMatch) {
    videoId = standardMatch[1];
  } else if (shortMatch) {
    videoId = shortMatch[1];
  }

  if (videoId) {
    const params = 'autoplay=1&rel=0&showinfo=0&modestbranding=1';
    return `https://www.youtube.com/embed/${videoId}?${params}`;
  }

  return null;
};


const VideoPlayer: React.FC<VideoPlayerProps> = ({ item, series, onClose }) => {
  const contentVideoRef = useRef<HTMLVideoElement>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('LOADING');
  const [currentAd, setCurrentAd] = useState<VideoAd | null>(null);
  const [companionAd, setCompanionAd] = useState<CompanionAd | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const midRollAdsRef = useRef<VideoAd[]>([]);
  const playedMidRollCuesRef = useRef<Set<number>>(new Set());

  const [isYoutubeEmbed, setIsYoutubeEmbed] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null);

  // Effect for initial setup
  useEffect(() => {
    setIsLoading(true);
    const embedUrl = getYoutubeEmbedUrl(item.videoUrl);
    if (embedUrl) {
      setIsYoutubeEmbed(true);
      setYoutubeUrl(embedUrl);
    }

    // Determine which pre-roll ad to use
    let preRollAd: VideoAd | null = null;
    if (series) {
      preRollAd = getAdForSeries(series.id);
    }
    // Fallback to general pre-roll if no series-specific ad is found
    if (!preRollAd) {
      preRollAd = getPreRollAd();
    }

    midRollAdsRef.current = getMidRollAds().sort((a, b) => (a.cuePoint || 0) - (b.cuePoint || 0));

    if (preRollAd) {
      setCurrentAd(preRollAd);
      setPlaybackState('PRE_ROLL');
      setCompanionAd(getCompanionAd());
    } else {
      setPlaybackState('CONTENT');
      setCompanionAd(null);
    }
  }, [item.videoUrl, series]);

  // Effect to handle Escape key press for closing player
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const isAdPlaying = playbackState === 'PRE_ROLL' || playbackState === 'MID_ROLL' || playbackState === 'POST_ROLL';
        if (!isAdPlaying) {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [playbackState, onClose]);


  useEffect(() => {
    if (playbackState === 'CONTENT' && !isYoutubeEmbed) {
      contentVideoRef.current?.play().catch(console.error);
    }
  }, [playbackState, isYoutubeEmbed]);

  const handleAdFinish = () => {
    setCompanionAd(null);
    setCurrentAd(null);
    switch (playbackState) {
      case 'PRE_ROLL':
      case 'MID_ROLL':
        setPlaybackState('CONTENT');
        break;
      case 'POST_ROLL':
        setPlaybackState('FINISHED');
        onClose();
        break;
      default:
        break;
    }
  };
  
  const handleContentTimeUpdate = () => {
    if (isYoutubeEmbed) return; // Mid-rolls not supported for embeds
    const video = contentVideoRef.current;
    if (!video || video.paused) return;

    const currentTime = video.currentTime;
    const nextAd = midRollAdsRef.current.find(ad => 
      ad.cuePoint && 
      currentTime >= ad.cuePoint && 
      !playedMidRollCuesRef.current.has(ad.cuePoint)
    );

    if (nextAd && nextAd.cuePoint) {
        playedMidRollCuesRef.current.add(nextAd.cuePoint);
        setCurrentAd(nextAd);
        setCompanionAd(getCompanionAd());
        setPlaybackState('MID_ROLL');
        video.pause();
    }
  };
  
  const handleContentEnd = () => {
    if (isYoutubeEmbed) { // Post-rolls not supported for embeds
        onClose();
        return;
    }
    const postRollAd = getPostRollAd();
    if (postRollAd) {
        setCurrentAd(postRollAd);
        setCompanionAd(getCompanionAd());
        setPlaybackState('POST_ROLL');
    } else {
        setPlaybackState('FINISHED');
        onClose();
    }
  };

  const renderPlayerState = () => {
    if (playbackState === 'PRE_ROLL' || playbackState === 'MID_ROLL' || playbackState === 'POST_ROLL') {
        return currentAd ? <AdPlayer ad={currentAd} onAdFinish={handleAdFinish} /> : null;
    }
    
    if (playbackState === 'CONTENT') {
        if (isYoutubeEmbed && youtubeUrl) {
            return (
                <iframe
                    src={youtubeUrl}
                    className="w-full h-full"
                    title={item.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            );
        }
        return (
            <div className="relative w-full h-full">
              <video
                ref={contentVideoRef}
                className="w-full h-full"
                src={item.videoUrl}
                controls
                onTimeUpdate={handleContentTimeUpdate}
                onEnded={handleContentEnd}
                onWaiting={() => setIsLoading(true)}
                onCanPlay={() => setIsLoading(false)}
                playsInline
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 pointer-events-none">
                  <Spinner />
                </div>
              )}
            </div>
        );
    }

    return <div className="w-full h-full bg-black flex items-center justify-center"><Spinner /></div>;
  };

  const isAdPlaying = playbackState === 'PRE_ROLL' || playbackState === 'MID_ROLL' || playbackState === 'POST_ROLL';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[100] p-4">
      {!isAdPlaying && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors z-[110]"
          aria-label="Close video player"
        >
          <CloseIcon />
        </button>
      )}
      <div className="w-full h-full flex items-center justify-center gap-x-4">
        {/* Main Player Area */}
        <div className="w-full h-full flex-1 flex items-center justify-center">
            <div className="w-full max-w-5xl aspect-video bg-black">
                {renderPlayerState()}
            </div>
        </div>

        {/* Companion Ad Area */}
        {companionAd && playbackState !== 'CONTENT' && (
            <div className="hidden lg:flex flex-col w-[300px] flex-shrink-0 items-center justify-center">
                <div className="w-[300px] h-[250px] bg-gray-800 rounded-lg shadow-lg">
                    <a href={companionAd.linkUrl} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
                        <img src={companionAd.imageUrl} alt={companionAd.altText} className="w-full h-full object-cover rounded-lg" />
                    </a>
                </div>
                <p className="text-xs text-gray-400 mt-2">Advertisement</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;