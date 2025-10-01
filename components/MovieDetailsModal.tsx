import React, { useState, useEffect } from 'react';
import type { ContentItem } from '../types';
import { getDataForContent, saveRating } from '../services/userRatingService';
import CloseIcon from './icons/CloseIcon';
import PlayIcon from './icons/PlayIcon';
import StarRating from './StarRating';
import CommentsSection from './CommentsSection';
import CoinIcon from './icons/CoinIcon';
import LockIcon from './icons/LockIcon';

interface MovieDetailsModalProps {
  movie: ContentItem;
  onClose: () => void;
  onPlay: (movie: ContentItem) => void;
  isUnlocked: boolean;
}

const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({ movie, onClose, onPlay, isUnlocked }) => {
  const [rating, setRating] = useState(0);

  const isPremiumWithCost = movie.isPremium && movie.tokenCost;
  const isLocked = isPremiumWithCost && !isUnlocked;

  useEffect(() => {
    const data = getDataForContent(movie.id);
    setRating(data?.rating || 0);
  }, [movie.id]);

  const handleRatingChange = (newRating: number) => {
    saveRating(movie.id, newRating);
    setRating(newRating);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-[90] flex items-center justify-center" onClick={onClose}>
      <div 
        className="bg-gray-900 text-white w-full max-w-4xl h-full max-h-[90vh] rounded-lg shadow-xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative w-full h-1/2 min-h-[300px] flex-shrink-0">
          <img src={movie.backdropUrl} alt={movie.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
          <button onClick={onClose} className="absolute top-4 right-4 z-20 text-white hover:text-red-500 transition-colors">
            <CloseIcon />
          </button>
          <div className="relative z-10 h-full flex flex-col justify-end p-6">
            <div className="flex items-center gap-x-4 mb-2">
              <h2 className="text-3xl md:text-4xl font-bold">{movie.title}</h2>
               {movie.isPremium && (
                 <span className={`flex-shrink-0 self-center px-3 py-1 text-sm font-bold text-gray-900 rounded-md shadow-lg flex items-center gap-x-1.5 ${isLocked ? 'bg-gray-400' : 'bg-gradient-to-r from-yellow-400 to-amber-500'}`}>
                    {isLocked && <LockIcon />}
                    {isLocked ? movie.tokenCost : 'PREMIUM'}
                    {isLocked && <CoinIcon />}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4 my-2">
                <span className="text-sm font-semibold">{movie.type}</span>
                <span className="border-l border-gray-400 h-4"></span>
                <span className="text-sm text-gray-300">{movie.genres.join(' • ')}</span>
            </div>
            <p className="text-sm text-gray-300 mt-2 line-clamp-3 max-w-3xl">{movie.description}</p>
             <button 
                onClick={() => onPlay(movie)}
                className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-transform hover:scale-105 mt-4 w-fit"
              >
                {isLocked ? <LockIcon /> : <PlayIcon />}
                <span className="ml-2">{isLocked ? 'Unlock & Play' : 'Play'}</span>
              </button>
          </div>
        </div>

        <div className="flex-grow p-6 overflow-y-auto">
            <div>
                <h3 className="text-xl font-semibold mb-2">Rate this movie</h3>
                <StarRating rating={rating} onRatingChange={handleRatingChange} />
            </div>
            <CommentsSection contentId={movie.id} />
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;