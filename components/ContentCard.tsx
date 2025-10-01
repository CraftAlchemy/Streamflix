import React, { useRef, useState } from 'react';
import type { ContentItem, ContentGridItem, PromotedContentAd } from '../types';
import PlayIcon from './icons/PlayIcon';
import PlusIcon from './icons/PlusIcon';
import ExpandIcon from './icons/ExpandIcon';
import LockIcon from './icons/LockIcon';
import CheckIcon from './icons/CheckIcon';

// Type guard to check if an item is a PromotedContentAd
function isPromotedAd(item: ContentGridItem): item is PromotedContentAd {
  return (item as PromotedContentAd).isAd === true;
}

interface ContentCardProps {
  item: ContentGridItem;
  onPlay: (item: ContentItem) => void;
  unlockedContentIds: string[];
  myListIds: string[];
  onToggleMyList: (contentId: string) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ item, onPlay, unlockedContentIds, myListIds, onToggleMyList }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsHovered(true);
      videoRef.current?.play().catch(() => {});
    }, 500); // 500ms delay before hover effect starts
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(false);
    videoRef.current?.pause();
  };
  
  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPromotedAd(item)) {
        window.open(item.linkUrl, '_blank', 'noopener,noreferrer');
    } else {
        onPlay(item);
    }
  };
  
  const handleMyListClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPromotedAd(item)) {
        onToggleMyList(item.id);
    }
  }

  const isPremiumWithCost = !isPromotedAd(item) && item.isPremium && item.tokenCost;
  const isLocked = isPremiumWithCost && !unlockedContentIds.includes(item.id);
  const isInMyList = !isPromotedAd(item) && myListIds.includes(item.id);

  return (
    <div 
      className="group relative flex-shrink-0 w-40 md:w-48"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="relative aspect-[2/3] w-full bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 ease-in-out"
        style={{
          transform: isHovered ? 'scale(1.25)' : 'scale(1)',
          zIndex: isHovered ? 20 : 1,
        }}
      >
        {/* Static Poster Image - Always present as the base layer */}
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* PREMIUM Badge (for non-hovered state) */}
        {!isPromotedAd(item) && item.isPremium && !isHovered && (
             <div className={`absolute top-2 left-2 flex items-center gap-1 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-md z-10 ${isLocked ? 'bg-gray-400' : 'bg-gradient-to-r from-yellow-400 to-amber-500'}`}>
                {isLocked && <LockIcon />}
                {isLocked ? item.tokenCost : 'PREMIUM'}
            </div>
        )}
        {/* AD Badge (for non-hovered state) */}
        {isPromotedAd(item) && !isHovered && (
             <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded z-10">AD</div>
        )}

        {/* Hover Container: Fades in with the trailer and overlay */}
        <div 
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ease-in-out ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={item.trailerUrl}
            muted
            loop
            playsInline
          />
          {/* Overlay with Gradient and Content */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col justify-end p-3 text-white">
            {/* PREMIUM Badge (for hovered state) */}
            {!isPromotedAd(item) && item.isPremium && (
                 <div className={`absolute top-2 left-2 flex items-center gap-1 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-md z-10 ${isLocked ? 'bg-gray-400' : 'bg-gradient-to-r from-yellow-400 to-amber-500'}`}>
                    {isLocked && <LockIcon />}
                    {isLocked ? item.tokenCost : 'PREMIUM'}
                </div>
            )}
            {isPromotedAd(item) && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded z-10">AD</div>
            )}
            
            {/* Info and Controls */}
            <div className="space-y-1">
              <h4 className="font-bold text-sm truncate">{item.title}</h4>
              <p className="text-xs text-gray-400 truncate">{item.genres.join(', ')}</p>
              <div className="flex items-center space-x-2 pt-1">
                <button 
                  onClick={handlePlayClick}
                  className="w-8 h-8 flex items-center justify-center bg-red-600 rounded-full hover:bg-red-700 transition-transform hover:scale-110"
                  aria-label={`Play ${item.title}`}
                  title={isPromotedAd(item) ? "Visit Advertiser" : "Play Full Content"}
                >
                  <PlayIcon />
                </button>
                {!isPromotedAd(item) && (
                    <button 
                    onClick={handleMyListClick}
                    className="w-8 h-8 flex items-center justify-center bg-gray-700 bg-opacity-60 rounded-full hover:bg-gray-600 transition-transform hover:scale-110"
                    aria-label={isInMyList ? `Remove ${item.title} from list` : `Add ${item.title} to list`}
                    title={isInMyList ? "Remove from My List" : "Add to My List"}
                    >
                    {isInMyList ? <CheckIcon /> : <PlusIcon />}
                    </button>
                )}
                <button 
                  onClick={handleExpandClick}
                  className="w-8 h-8 flex items-center justify-center bg-gray-700 bg-opacity-60 rounded-full hover:bg-gray-600 ml-auto transition-transform hover:scale-110"
                  aria-label={`Expand trailer for ${item.title}`}
                  title="Watch Trailer Fullscreen"
                >
                  <ExpandIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
       {/* Title below the card, fades out on hover */}
       <p className={`text-sm text-gray-300 mt-2 truncate transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
         {item.title}
       </p>
    </div>
  );
};

export default ContentCard;
