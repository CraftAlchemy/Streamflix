import React from 'react';
import type { ContentItem, ContentGridItem } from '../types';
import ContentCard from './ContentCard';

interface ContentRowProps {
  title: string;
  items: ContentGridItem[];
  onCardPlay: (item: ContentItem) => void;
  unlockedContentIds: string[];
  myListIds: string[];
  onToggleMyList: (contentId: string) => void;
}

const ContentRow: React.FC<ContentRowProps> = ({ title, items, onCardPlay, unlockedContentIds, myListIds, onToggleMyList }) => {
  return (
    <div className="mb-8 md:mb-12">
      <h3 className="text-xl md:text-2xl font-bold mb-4">{title}</h3>
      <div className="flex overflow-x-auto overflow-y-hidden space-x-4 pb-8 -mb-8 px-1">
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
    </div>
  );
};

export default ContentRow;
