import React, { useState } from 'react';
import type { Season, Episode } from '../types';
import CloseIcon from './icons/CloseIcon';
import PlusIcon from './icons/PlusIcon';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import ChevronUpIcon from './icons/ChevronUpIcon';

interface SeriesManagerModalProps {
  initialSeasons: Season[];
  onClose: () => void;
  onSave: (updatedSeasons: Season[]) => void;
}

const SeriesManagerModal: React.FC<SeriesManagerModalProps> = ({ initialSeasons, onClose, onSave }) => {
  const [seasons, setSeasons] = useState<Season[]>(initialSeasons);
  const [expandedSeasonId, setExpandedSeasonId] = useState<string | null>(null);

  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [editingEpisode, setEditingEpisode] = useState<{ seasonId: string; episode: Episode } | null>(null);

  const handleAddSeason = () => {
    const newSeasonNumber = seasons.length > 0 ? Math.max(...seasons.map(s => s.seasonNumber)) + 1 : 1;
    setEditingSeason({ id: '', seasonNumber: newSeasonNumber, episodes: [] });
  };
  
  const handleEditSeason = (season: Season) => setEditingSeason(season);
  
  const handleDeleteSeason = (seasonId: string) => {
    if (window.confirm('Are you sure you want to delete this season and all its episodes?')) {
        setSeasons(prev => prev.filter(s => s.id !== seasonId));
    }
  };

  const handleSaveSeason = (e: React.FormEvent, seasonData: Season) => {
    e.preventDefault();
    if (seasonData.id) { // Update
      setSeasons(prev => prev.map(s => s.id === seasonData.id ? seasonData : s));
    } else { // Add
      setSeasons(prev => [...prev, { ...seasonData, id: `s-${Date.now()}` }]);
    }
    setEditingSeason(null);
  };
  
  const handleAddEpisode = (seasonId: string) => {
    const season = seasons.find(s => s.id === seasonId);
    if (!season) return;
    const newEpisodeNumber = season.episodes.length > 0 ? Math.max(...season.episodes.map(e => e.episodeNumber)) + 1 : 1;
    setEditingEpisode({ seasonId, episode: { id: '', episodeNumber: newEpisodeNumber, title: '', description: '', videoUrl: '', thumbnailUrl: '' } });
  };

  const handleEditEpisode = (seasonId: string, episode: Episode) => setEditingEpisode({ seasonId, episode });

  const handleDeleteEpisode = (seasonId: string, episodeId: string) => {
     if (window.confirm('Are you sure you want to delete this episode?')) {
        setSeasons(prev => prev.map(s => 
            s.id === seasonId ? { ...s, episodes: s.episodes.filter(e => e.id !== episodeId) } : s
        ));
    }
  }

  const handleSaveEpisode = (e: React.FormEvent, episodeData: Episode) => {
    e.preventDefault();
    if (!editingEpisode) return;
    
    const { seasonId } = editingEpisode;

    if (episodeData.id) { // Update
        setSeasons(prev => prev.map(s => 
            s.id === seasonId ? { ...s, episodes: s.episodes.map(ep => ep.id === episodeData.id ? episodeData : ep) } : s
        ));
    } else { // Add
        setSeasons(prev => prev.map(s => 
            s.id === seasonId ? { ...s, episodes: [...s.episodes, { ...episodeData, id: `e-${Date.now()}`}] } : s
        ));
    }
    setEditingEpisode(null);
  }

  const handleSaveAndClose = () => {
    onSave(seasons);
  };

  const toggleSeasonExpansion = (seasonId: string) => {
    setExpandedSeasonId(prev => prev === seasonId ? null : seasonId);
  }
  
  return (
    <>
        <div className="fixed inset-0 bg-black bg-opacity-80 z-[120] flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
                    <h3 className="text-xl font-semibold">Manage Seasons & Episodes</h3>
                    <button onClick={onClose}><CloseIcon /></button>
                </div>

                <div className="p-4 space-y-4 overflow-y-auto flex-grow">
                    <button onClick={handleAddSeason} className="w-full py-2 px-4 bg-red-800 rounded hover:bg-red-700 flex items-center justify-center">
                        <PlusIcon /> <span className="ml-2">Add New Season</span>
                    </button>
                    {seasons.sort((a,b) => a.seasonNumber - b.seasonNumber).map(season => (
                        <div key={season.id} className="bg-gray-700 rounded-lg">
                            <div className="flex justify-between items-center p-3">
                                <button onClick={() => toggleSeasonExpansion(season.id)} className="flex items-center font-semibold text-lg hover:text-red-500">
                                    Season {season.seasonNumber} ({season.episodes.length} episodes)
                                    {expandedSeasonId === season.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                </button>
                                <div className="flex items-center space-x-3">
                                    <button onClick={() => handleEditSeason(season)} className="hover:text-yellow-400"><EditIcon /></button>
                                    <button onClick={() => handleDeleteSeason(season.id)} className="hover:text-red-500"><TrashIcon /></button>
                                </div>
                            </div>
                            {expandedSeasonId === season.id && (
                                <div className="p-3 border-t border-gray-600 space-y-2">
                                    <button onClick={() => handleAddEpisode(season.id)} className="w-full text-sm py-1.5 px-3 bg-gray-600 rounded hover:bg-gray-500 flex items-center justify-center">
                                        <PlusIcon /> <span className="ml-1">Add Episode to Season {season.seasonNumber}</span>
                                    </button>
                                    {season.episodes.sort((a,b) => a.episodeNumber - b.episodeNumber).map(episode => (
                                        <div key={episode.id} className="bg-gray-600 p-2 rounded flex items-center justify-between">
                                            <p className="text-sm font-medium">E{episode.episodeNumber}: {episode.title}</p>
                                            <div className="flex items-center space-x-2">
                                                <button onClick={() => handleEditEpisode(season.id, episode)} className="hover:text-yellow-400"><EditIcon /></button>
                                                <button onClick={() => handleDeleteEpisode(season.id, episode.id)} className="hover:text-red-500"><TrashIcon /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end space-x-2 p-4 border-t border-gray-700 flex-shrink-0">
                    <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-500 rounded hover:bg-gray-400">Cancel</button>
                    <button type="button" onClick={handleSaveAndClose} className="py-2 px-4 bg-red-600 rounded hover:bg-red-700">Save Changes</button>
                </div>
            </div>
        </div>
        
        {editingSeason && <SeasonEpisodeForm isSeason data={editingSeason} onSave={handleSaveSeason} onClose={() => setEditingSeason(null)} />}
        {editingEpisode && <SeasonEpisodeForm isSeason={false} data={editingEpisode.episode} onSave={handleSaveEpisode} onClose={() => setEditingEpisode(null)} />}
    </>
  );
};


// --- Form Component for Season/Episode ---
interface SeasonEpisodeFormProps {
    isSeason: boolean;
    data: Omit<Season, 'episodes'> | Episode;
    onSave: (e: React.FormEvent, data: any) => void;
    onClose: () => void;
}
const SeasonEpisodeForm: React.FC<SeasonEpisodeFormProps> = ({ isSeason, data, onSave, onClose }) => {
    const [formData, setFormData] = useState(data);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(p => ({ ...p, [name]: type === 'number' ? parseInt(value) || 0 : value }));
    };

    const title = isSeason ? ((data as Season).id ? 'Edit Season' : 'Add Season') : ((data as Episode).id ? 'Edit Episode' : 'Add Episode');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[130] flex items-center justify-center p-4">
             <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button onClick={onClose}><CloseIcon /></button>
                </div>
                <form onSubmit={(e) => onSave(e, formData)} className="p-4 space-y-3">
                    {isSeason ? (
                        <input type="number" name="seasonNumber" value={(formData as Season).seasonNumber} onChange={handleChange} placeholder="Season Number" required className="w-full p-2 bg-gray-600 rounded" />
                    ) : (
                        <>
                            <input type="number" name="episodeNumber" value={(formData as Episode).episodeNumber} onChange={handleChange} placeholder="Episode Number" required className="w-full p-2 bg-gray-600 rounded" />
                            <input type="text" name="title" value={(formData as Episode).title} onChange={handleChange} placeholder="Episode Title" required className="w-full p-2 bg-gray-600 rounded" />
                            <textarea name="description" value={(formData as Episode).description} onChange={handleChange} placeholder="Description" required className="w-full p-2 bg-gray-600 rounded" rows={3} />
                            <input type="text" name="videoUrl" value={(formData as Episode).videoUrl} onChange={handleChange} placeholder="Video URL" required className="w-full p-2 bg-gray-600 rounded" />
                            <input type="url" name="thumbnailUrl" value={(formData as Episode).thumbnailUrl} onChange={handleChange} placeholder="Thumbnail URL" required className="w-full p-2 bg-gray-600 rounded" />
                        </>
                    )}
                     <div className="flex justify-end space-x-2 pt-2">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-500 rounded hover:bg-gray-400">Cancel</button>
                        <button type="submit" className="py-2 px-4 bg-red-600 rounded hover:bg-red-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SeriesManagerModal;
