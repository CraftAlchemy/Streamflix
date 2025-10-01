import React, { useState, useMemo, useEffect } from 'react';
import type { ContentItem, Season, Episode } from '../types';
import CloseIcon from './icons/CloseIcon';
import PlayIcon from './icons/PlayIcon';
import StarRating from './StarRating';
import CommentsSection from './CommentsSection';
import { getDataForContent, saveRating } from '../services/userRatingService';
import LockIcon from './icons/LockIcon';
import CoinIcon from './icons/CoinIcon';


interface EpisodeSelectorProps {
  series: ContentItem;
  onClose: () => void;
  onPlayEpisode: (episode: Episode) => void;
  isUnlocked: boolean;
}

const EpisodeSelector: React.FC<EpisodeSelectorProps> = ({ series, onClose, onPlayEpisode, isUnlocked }) => {
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(series.seasons?.[0] || null);
  const [rating, setRating] = useState(0);
  
  const isPremiumWithCost = series.isPremium && series.tokenCost;
  const isLocked = isPremiumWithCost && !isUnlocked;

  useEffect(() => {
    const data = getDataForContent(series.id);
    setRating(data?.rating || 0);
  }, [series.id]);

  const handleRatingChange = (newRating: number) => {
    saveRating(series.id, newRating);
    setRating(newRating);
  };

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const seasonId = e.target.value;
    const season = series.seasons?.find(s => s.id === seasonId) || null;
    setSelectedSeason(season);
  };

  const sortedSeasons = useMemo(() => {
    return series.seasons?.slice().sort((a, b) => a.seasonNumber - b.seasonNumber) || [];
  }, [series.seasons]);

  const sortedEpisodes = useMemo(() => {
    return selectedSeason?.episodes.slice().sort((a, b) => a.episodeNumber - b.episodeNumber) || [];
  }, [selectedSeason]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-[90] flex items-center justify-center" onClick={onClose}>
      <div 
        className="bg-gray-900 text-white w-full max-w-4xl h-full max-h-[90vh] rounded-lg shadow-xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with backdrop */}
        <div className="relative w-full h-1/3 min-h-[250px] flex-shrink-0">
          <img src={series.backdropUrl} alt={series.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
          <button onClick={onClose} className="absolute top-4 right-4 z-20 text-white hover:text-red-500 transition-colors">
            <CloseIcon />
          </button>
          <div className="relative z-10 h-full flex flex-col justify-end p-6">
            <div className="flex items-center gap-x-4 mb-2 flex-wrap">
              <h2 className="text-3xl md:text-4xl font-bold">{series.title}</h2>
              {series.isPremium && (
                 <span className={`flex-shrink-0 self-center px-3 py-1 text-sm font-bold text-gray-900 rounded-md shadow-lg flex items-center gap-x-1.5 ${isLocked ? 'bg-gray-400' : 'bg-gradient-to-r from-yellow-400 to-amber-500'}`}>
                    {isLocked && <LockIcon />}
                    {isLocked ? series.tokenCost : 'PREMIUM'}
                    {isLocked && <CoinIcon />}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-300 mt-2 line-clamp-2 max-w-2xl">{series.description}</p>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-grow p-6 overflow-y-auto">
          <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Rate this series</h3>
              <StarRating rating={rating} onRatingChange={handleRatingChange} />
          </div>
          <div className="mb-4">
            <label htmlFor="season-select" className="sr-only">Select Season</label>
            <select
              id="season-select"
              value={selectedSeason?.id || ''}
              onChange={handleSeasonChange}
              className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {sortedSeasons.map(season => (
                <option key={season.id} value={season.id}>
                  Season {season.seasonNumber}
                </option>
              ))}
            </select>
          </div>
          
          {sortedEpisodes.length > 0 ? (
            <div className="space-y-4">
              {sortedEpisodes.map(episode => (
                <div key={episode.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-gray-800 p-3 rounded-md">
                  <div className="relative w-full sm:w-40 h-24 flex-shrink-0">
                    <img src={episode.thumbnailUrl} alt={episode.title} className="w-full h-full object-cover rounded" />
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold">E{episode.episodeNumber}: {episode.title}</h4>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{episode.description}</p>
                  </div>
                  <button 
                    onClick={() => onPlayEpisode(episode)} 
                    className="flex-shrink-0 bg-red-600 hover:bg-red-700 rounded-full p-3 transition-transform hover:scale-110 self-end sm:self-center"
                    aria-label={`Play ${episode.title}`}
                    title={isLocked ? `Unlock series to play` : `Play ${episode.title}`}
                  >
                    {isLocked ? <LockIcon /> : <PlayIcon />}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No episodes available for this season.</p>
          )}

          <CommentsSection contentId={series.id} />
        </div>
      </div>
    </div>
  );
};

export default EpisodeSelector;
