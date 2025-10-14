import React, { useRef, useState, useEffect } from 'react';
import type { ContentItem, ContentGridItem } from '../types';
import ContentCard from './ContentCard';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface ContentRowProps {
  title: string;
  items: ContentGridItem[];
  onCardPlay: (item: ContentItem) => void;
  unlockedContentIds: string[];
  myListIds: string[];
  onToggleMyList: (contentId: string) => void;
}

const ContentRow: React.FC<ContentRowProps> = ({ title, items, onCardPlay, unlockedContentIds, myListIds, onToggleMyList }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Checks if arrows should be shown
  const checkArrows = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      // Show left arrow if not at the beginning
      setShowLeftArrow(scrollLeft > 0);
      // Show right arrow if not at the end (with a 1px tolerance)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Run check on mount, on items change, and on window resize
  useEffect(() => {
    // A slight delay to ensure content is rendered and dimensions are correct
    const timeoutId = setTimeout(checkArrows, 100);
    
    window.addEventListener('resize', checkArrows);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkArrows);
    };
  }, [items]);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      // Scroll by 80% of the container's visible width
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="mb-8 md:mb-12">
      <h3 className="text-xl md:text-2xl font-bold mb-4">{title}</h3>
      <div className="group relative">
        {/* Helper style to hide the native scrollbar */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        
        {/* Left Arrow Button */}
        <button
          onClick={() => handleScroll('left')}
          className={`absolute left-0 top-0 bottom-8 z-20 w-12 bg-black bg-opacity-50 hover:bg-opacity-75 flex items-center justify-center rounded-r-lg transition-opacity duration-300 ${showLeftArrow ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-label="Scroll left"
        >
          <ChevronLeftIcon />
        </button>

        <div
          ref={scrollContainerRef}
          onScroll={checkArrows}
          className="flex overflow-x-auto overflow-y-hidden space-x-4 pb-8 -mb-8 px-1 scrollbar-hide"
        >
          {items.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              onPlay={onCardPlay}
              unlockedContentIds={unlockedContentIds}
              myListIds={myListIds}
              onToggleMyList={onToggleMyList}
            />
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => handleScroll('right')}
          className={`absolute right-0 top-0 bottom-8 z-20 w-12 bg-black bg-opacity-50 hover:bg-opacity-75 flex items-center justify-center rounded-l-lg transition-opacity duration-300 ${showRightArrow ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-label="Scroll right"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
};

export default ContentRow;
