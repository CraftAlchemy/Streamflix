import React, { useState, useEffect, useRef } from 'react';
import type { ContentItem, HeroAd } from '../types';
import PlayIcon from './icons/PlayIcon';
import PlusIcon from './icons/PlusIcon';
import CoinIcon from './icons/CoinIcon';
import LockIcon from './icons/LockIcon';
import CheckIcon from './icons/CheckIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';

// Type guard to check if an item is a HeroAd
function isHeroAd(item: ContentItem | HeroAd): item is HeroAd {
  return (item as HeroAd).isAd === true;
}

interface HeroProps {
  items: (ContentItem | HeroAd)[];
  onPlay: (item: ContentItem) => void;
  unlockedContentIds: string[];
  myListIds: string[];
  onToggleMyList: (contentId: string) => void;
}

const Hero: React.FC<HeroProps> = ({ items, onPlay, unlockedContentIds, myListIds, onToggleMyList }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = window.setTimeout(
      () =>
        setCurrentIndex((prevIndex) =>
          prevIndex === items.length - 1 ? 0 : prevIndex + 1
        ),
      7000 // Change slide every 7 seconds
    );

    return () => {
      resetTimeout();
    };
  }, [currentIndex, items.length]);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? items.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === items.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  
  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  }

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="relative h-[56.25vw] min-h-[400px] md:min-h-[500px] lg:min-h-[600px] text-white overflow-hidden">
      {/* Background Images */}
      <div className="absolute top-0 left-0 w-full h-full">
        {items.map((item, index) => (
          <img
            key={item.id}
            src={item.backdropUrl}
            alt={item.title}
            className={`w-full h-full object-cover absolute transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-transparent"></div>
      </div>
      
      {/* Sliding Content */}
      <div 
        className="relative z-10 h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        <div className="flex h-full" style={{ width: `${items.length * 100}%`}}>
            {items.map((item) => {
                 if (isHeroAd(item)) {
                     // Render Ad Slide
                     return (
                        <div key={item.id} className="w-full h-full flex flex-col justify-end pb-12 md:pb-20 lg:pb-24 px-4 md:px-12" style={{ width: `${100 / items.length}%`}}>
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-2xl">{item.title}</h2>
                             <div className="flex items-center space-x-4 my-4">
                                <span className="text-sm font-semibold bg-yellow-400 text-black px-2 py-0.5 rounded">ADVERTISEMENT</span>
                            </div>
                            <p className="text-sm md:text-base max-w-xl lg:max-w-2xl mt-2 text-gray-200 line-clamp-3">{item.description}</p>
                            <div className="flex flex-wrap items-center gap-4 mt-6">
                            <a 
                                href={item.linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-transform hover:scale-105"
                            >
                                <span>{item.ctaText || 'Learn More'}</span>
                            </a>
                            </div>
                        </div>
                     );
                 }

                 // Render Content Slide
                 const isPremiumWithCost = item.isPremium && item.tokenCost;
                 const isLocked = isPremiumWithCost && !unlockedContentIds.includes(item.id);
                 const isInMyList = myListIds.includes(item.id);
                 return (
                    <div key={item.id} className="w-full h-full flex flex-col justify-end pb-12 md:pb-20 lg:pb-24 px-4 md:px-12" style={{ width: `${100 / items.length}%`}}>
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
                 );
            })}
        </div>
      </div>
      
      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 p-2 bg-black bg-opacity-40 hover:bg-opacity-70 rounded-full transition-opacity"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon />
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 p-2 bg-black bg-opacity-40 hover:bg-opacity-70 rounded-full transition-opacity"
        aria-label="Next slide"
      >
        <ChevronRightIcon />
      </button>
      
      {/* Indicator Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {items.map((_, slideIndex) => (
            <button
                key={slideIndex}
                onClick={() => goToSlide(slideIndex)}
                className={`w-3 h-3 rounded-full transition-colors ${currentIndex === slideIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}
                aria-label={`Go to slide ${slideIndex + 1}`}
            ></button>
        ))}
      </div>
    </div>
  );
};

export default Hero;
