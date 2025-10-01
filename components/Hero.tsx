import React from 'react';
import type { ContentItem } from '../types';
import PlayIcon from './icons/PlayIcon';
import PlusIcon from './icons/PlusIcon';
import CoinIcon from './icons/CoinIcon';
import LockIcon from './icons/LockIcon';
import CheckIcon from './icons/CheckIcon';


interface HeroProps {
  item: ContentItem;
  onPlay: (item: ContentItem) => void;
  unlockedContentIds: string[];
  myListIds: string[];
  onToggleMyList: (contentId: string) => void;
}

const Hero: React.FC<HeroProps> = ({ item, onPlay, unlockedContentIds, myListIds, onToggleMyList }) => {
  const isPremiumWithCost = item.isPremium && item.tokenCost;
  const isLocked = isPremiumWithCost && !unlockedContentIds.includes(item.id);
  const isInMyList = myListIds.includes(item.id);

  return (
    <div className="relative h-[56.25vw] min-h-[400px] md:min-h-[500px] lg:min-h-[600px] text-white">
      <div className="absolute top-0 left-0 w-full h-full">
        <img
          src={item.backdropUrl}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-transparent"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col justify-end pb-12 md:pb-20 lg:pb-24 px-4 md:px-12">
        <div className="flex items-center gap-x-4 flex-wrap">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-2xl">{item.title}</h2>
            {item.isPremium && (
                <span className={`flex-shrink-0 self-center px-3 py-1 text-sm font-bold text-gray-900 rounded-md shadow-lg flex items-center gap-x-1.5 ${isLocked ? 'bg-gray-400' : 'bg-gradient-to-r from-yellow-400 to-amber-500'}`}>
                    {isLocked && <LockIcon />}
                    {isLocked ? item.tokenCost : 'PREMIUM'}
                    {isLocked && <CoinIcon />}
                </span>
            )}
        </div>
        <div className="flex items-center space-x-4 my-4">
            <span className="text-sm font-semibold">{item.type}</span>
            <span className="border-l border-gray-400 h-4"></span>
            <span className="text-sm text-gray-300">{item.genres.join(' • ')}</span>
        </div>
        <p className="text-sm md:text-base max-w-xl lg:max-w-2xl mt-2 text-gray-200 line-clamp-3">{item.description}</p>
        <div className="flex flex-wrap items-center gap-4 mt-6">
          <button 
            onClick={() => onPlay(item)}
            className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-transform hover:scale-105"
          >
            <PlayIcon />
            <span className="ml-2">{ isLocked ? 'Unlock & Play' : 'Play' }</span>
          </button>
          <button 
            onClick={() => onToggleMyList(item.id)}
            className="flex items-center justify-center bg-gray-700 bg-opacity-60 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md transition-transform hover:scale-105"
          >
            {isInMyList ? <CheckIcon /> : <PlusIcon />}
            <span className="ml-2">{isInMyList ? 'On My List' : 'My List'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
