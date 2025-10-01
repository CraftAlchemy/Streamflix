import React, { useState, useEffect, useMemo } from 'react';

import { getPromotedAds, addPromotedAd, updatePromotedAd, deletePromotedAd } from '../services/mockPromotedAdService';
import { 
    getMockContent, addContentCategory, updateContentCategoryTitle, deleteContentCategory, reorderContentCategories,
    addContentItemToCategories, updateContentItemAndCategories, deleteContentItemGlobally
} from '../services/mockDataService';
import { 
    getPreRollAds, addPreRollAd, updatePreRollAd, deletePreRollAd, reorderPreRollAds,
    getMidRollAds, addMidRollAd, updateMidRollAd, deleteMidRollAd, reorderMidRollAds,
    getPostRollAds, addPostRollAd, updatePostRollAd, deletePostRollAd, reorderPostRollAds,
    getTokenRewardAds, addTokenRewardAd, updateTokenRewardAd, deleteTokenRewardAd, reorderTokenRewardAds,
    getSeriesAds, addSeriesAd, deleteSeriesAd,
} from '../services/mockAdService';
import { getBannerAd, updateBannerAd } from '../services/mockBannerAdService';
import { getCompanionAds, addCompanionAd, updateCompanionAd, deleteCompanionAd } from '../services/mockCompanionAdService';
import { getDefaultTokenBalance, setDefaultTokenBalance } from '../services/tokenService';
import { getTokenPackages, addTokenPackage, updateTokenPackage, deleteTokenPackage } from '../services/tokenPackageService';

import SeriesManagerModal from './SeriesManagerModal';
import type { PromotedContentAd, ContentCategory, VideoAd, BannerAd, CompanionAd, ContentItem, ContentGridItem, Season, SeriesAd, TokenPackage } from '../types';
import AdPlayer from './AdPlayer';
import CloseIcon from './icons/CloseIcon';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import PlusIcon from './icons/PlusIcon';
import ArrowUpIcon from './icons/ArrowUpIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';
import PreviewIcon from './icons/PreviewIcon';
import DragIcon from './icons/DragIcon';
import ListIcon from './icons/ListIcon';


interface AdminPanelProps {
  onClose: () => void;
  onAdsUpdated: () => void;
}

type AdminTab = 'promoted' | 'carousels' | 'tv_shows' | 'movies' | 'tv_ads' | 'tokens' | 'settings';

// Type guard to check if an item is a ContentItem
function isContentItem(item: ContentGridItem): item is ContentItem {
  return !('isAd' in item);
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onAdsUpdated }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('promoted');
  const [showSuccess, setShowSuccess] = useState(false);

  // State for Promoted Ads
  const [promotedAds, setPromotedAds] = useState<PromotedContentAd[]>([]);
  const [editingAd, setEditingAd] = useState<PromotedContentAd | null>(null);
  const [adFormData, setAdFormData] = useState<Omit<PromotedContentAd, 'id' | 'isAd'>>({ title: '', description: '', imageUrl: '', trailerUrl: '', linkUrl: '', genres: [] });

  // State for Carousels
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [editingCategoryTitle, setEditingCategoryTitle] = useState<string | null>(null);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  // State for Content Management
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [isContentFormOpen, setIsContentFormOpen] = useState(false);
  const [contentFormType, setContentFormType] = useState<'Movie' | 'Series'>('Movie');

  // State for TV Show Ads
  const [seriesAds, setSeriesAds] = useState<SeriesAd[]>([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState('');
  const [selectedAdId, setSelectedAdId] = useState('');

  // State for Token Management
  const [initialTokenBalance, setInitialTokenBalance] = useState(100);
  const [tokenPackages, setTokenPackages] = useState<TokenPackage[]>([]);


  // State for Ad Settings
  const [preRollAds, setPreRollAds] = useState<VideoAd[]>([]);
  const [midRollAds, setMidRollAds] = useState<VideoAd[]>([]);
  const [postRollAds, setPostRollAds] = useState<VideoAd[]>([]);
  const [tokenRewardAds, setTokenRewardAds] = useState<VideoAd[]>([]);
  const [bannerAd, setBannerAd] = useState<Partial<BannerAd>>({});
  const [companionAds, setCompanionAds] = useState<CompanionAd[]>([]);
  const [previewingAd, setPreviewingAd] = useState<VideoAd | null>(null);
  const [previewingCompanionAd, setPreviewingCompanionAd] = useState<CompanionAd | null>(null);

  useEffect(() => {
    setPromotedAds(getPromotedAds());
    const contentData = getMockContent();
    setCategories(contentData);
    setBannerAd(getBannerAd() || {});
    setPreRollAds(getPreRollAds());
    setMidRollAds(getMidRollAds());
    setPostRollAds(getPostRollAds());
    setTokenRewardAds(getTokenRewardAds());
    setCompanionAds(getCompanionAds());
    setSeriesAds(getSeriesAds());
    setInitialTokenBalance(getDefaultTokenBalance());
    setTokenPackages(getTokenPackages());
  }, []);
  
  const showSuccessMessage = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const refreshAllData = () => {
    const contentData = getMockContent();
    setCategories(contentData);
    setPromotedAds(getPromotedAds());
    setBannerAd(getBannerAd() || {});
    setPreRollAds(getPreRollAds());
    setMidRollAds(getMidRollAds());
    setPostRollAds(getPostRollAds());
    setTokenRewardAds(getTokenRewardAds());
    setCompanionAds(getCompanionAds());
    setSeriesAds(getSeriesAds());
    setInitialTokenBalance(getDefaultTokenBalance());
    setTokenPackages(getTokenPackages());
    onAdsUpdated();
    showSuccessMessage();
  }

  const allContentItems = useMemo(() => {
    const allItems = new Map<string, ContentItem>();
    categories
        .flatMap(cat => cat.items.filter(isContentItem))
        .forEach(item => {
            if (!allItems.has(item.id)) {
                allItems.set(item.id, item);
            }
        });
    return Array.from(allItems.values());
  }, [categories]);
  
  const allSeries = useMemo(() => allContentItems.filter(item => item.type === 'Series'), [allContentItems]);
  const allMovies = useMemo(() => allContentItems.filter(item => item.type === 'Movie'), [allContentItems]);


  // --- Promoted Ad Logic ---
  const handleAdInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAdFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleAdGenresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdFormData(prev => ({...prev, genres: e.target.value.split(',').map(g => g.trim())}));
  }
  const handleEditAd = (ad: PromotedContentAd) => {
    setEditingAd(ad);
    setAdFormData({ title: ad.title, description: ad.description, imageUrl: ad.imageUrl, trailerUrl: ad.trailerUrl, linkUrl: ad.linkUrl, genres: ad.genres });
  };
  const handleDeleteAd = (adId: string) => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
        deletePromotedAd(adId);
        refreshAllData();
    }
  };
  const handleCancelEditAd = () => {
    setEditingAd(null);
    setAdFormData({ title: '', description: '', imageUrl: '', trailerUrl: '', linkUrl: '', genres: [] });
  }
  const handleAdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAd) {
      updatePromotedAd({ ...adFormData, id: editingAd.id, isAd: true });
    } else {
      addPromotedAd(adFormData);
    }
    handleCancelEditAd();
    refreshAllData();
  };

  // --- Carousel Logic ---
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if(newCategoryName.trim()) {
        addContentCategory(newCategoryName.trim());
        setNewCategoryName('');
        refreshAllData();
    }
  }
  const handleUpdateCategoryTitle = (oldTitle: string) => {
    if (newCategoryTitle && newCategoryTitle.trim() !== oldTitle) {
      updateContentCategoryTitle(oldTitle, newCategoryTitle.trim());
      refreshAllData();
    }
    setEditingCategoryTitle(null);
    setNewCategoryTitle('');
  };
  const handleDeleteCategory = (title: string) => {
    if (window.confirm(`Are you sure you want to delete the "${title}" carousel? This will not delete the content items within it.`)) {
        deleteContentCategory(title);
        refreshAllData();
    }
  }
  const handleReorderCategory = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    reorderContentCategories(index, newIndex);
    refreshAllData();
  }
  
  // --- Content Management Logic ---
  const handleOpenContentForm = (itemType: 'Movie' | 'Series', itemToEdit: ContentItem | null) => {
    setContentFormType(itemType);
    setEditingContent(itemToEdit);
    setIsContentFormOpen(true);
  }
  const handleCloseContentForm = () => {
    setIsContentFormOpen(false);
    setEditingContent(null);
  }
  const handleDeleteContent = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this content item from the app?')) {
        deleteContentItemGlobally(itemId);
        refreshAllData();
    }
  }
  const handleContentItemSave = (formData: ContentItem, selectedCategories: string[]) => {
    if (formData.id) { // Existing item
        updateContentItemAndCategories(formData, selectedCategories);
    } else { // New item
        addContentItemToCategories(formData, selectedCategories);
    }
    handleCloseContentForm();
    refreshAllData();
  }

  // --- TV Show Ad Logic ---
  const handleAssignSeriesAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeriesId || !selectedAdId) {
        alert('Please select a series and an ad.');
        return;
    }
    const series = allSeries.find(s => s.id === selectedSeriesId);
    if (!series) return;

    addSeriesAd(selectedSeriesId, series.title, selectedAdId);
    refreshAllData();
    setSelectedSeriesId('');
    setSelectedAdId('');
  }

  const handleDeleteSeriesAd = (id: string) => {
    if (window.confirm('Are you sure you want to remove this ad assignment?')) {
        deleteSeriesAd(id);
        refreshAllData();
    }
  }

  // --- Token Logic ---
  const handleSaveInitialTokens = () => {
    setDefaultTokenBalance(initialTokenBalance);
    refreshAllData();
  }

  // --- Ad Settings Logic ---
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBannerAd(p => ({...p, [name]: value }));
  }
  const handleSaveBannerAd = () => {
    updateBannerAd(bannerAd);
    refreshAllData();
  }
  
  const renderTabContent = () => {
    switch(activeTab) {
        case 'promoted': return renderPromotedAds();
        case 'carousels': return renderCarousels();
        case 'tv_shows': return renderContentManagement('Series');
        case 'movies': return renderContentManagement('Movie');
        case 'tv_ads': return renderTvShowAds();
        case 'tokens': return renderTokenManagement();
        case 'settings': return renderAdSettings();
    }
  }
  
  const renderPromotedAds = () => (
    <>
      <form onSubmit={handleAdSubmit} className="bg-gray-800 p-4 rounded-lg mb-8">
        <h3 className="text-lg font-semibold mb-4">{editingAd ? 'Edit Promoted Ad' : 'Add New Promoted Ad'}</h3>
        <div className="space-y-3">
            <input type="text" name="title" value={adFormData.title} onChange={handleAdInputChange} placeholder="Title" required className="w-full p-2 bg-gray-700 rounded" />
            <textarea name="description" value={adFormData.description} onChange={handleAdInputChange} placeholder="Description" required className="w-full p-2 bg-gray-700 rounded" />
            <input type="url" name="imageUrl" value={adFormData.imageUrl} onChange={handleAdInputChange} placeholder="Image URL" required className="w-full p-2 bg-gray-700 rounded" />
            <input type="url" name="trailerUrl" value={adFormData.trailerUrl} onChange={handleAdInputChange} placeholder="Trailer URL" required className="w-full p-2 bg-gray-700 rounded" />
            <input type="url" name="linkUrl" value={adFormData.linkUrl} onChange={handleAdInputChange} placeholder="Link URL" required className="w-full p-2 bg-gray-700 rounded" />
            <input type="text" name="genres" value={adFormData.genres.join(', ')} onChange={handleAdGenresChange} placeholder="Genres (comma-separated)" required className="w-full p-2 bg-gray-700 rounded" />
        </div>
        <div className="flex items-center justify-end mt-4 space-x-2">
            {editingAd && <button type="button" onClick={handleCancelEditAd} className="py-2 px-4 bg-gray-600 rounded hover:bg-gray-500">Cancel</button>}
            <button type="submit" className="py-2 px-4 bg-red-600 rounded hover:bg-red-700 flex items-center">
                <PlusIcon /> <span className="ml-2">{editingAd ? 'Update Ad' : 'Add Ad'}</span>
            </button>
        </div>
      </form>
      <div>
        <h3 className="text-lg font-semibold mb-4">Current Promoted Ads</h3>
        <div className="space-y-2">
            {promotedAds.map(ad => (
                <div key={ad.id} className="bg-gray-800 p-3 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <p className="font-medium">{ad.title}</p>
                    <div className="flex items-center space-x-3 self-end sm:self-center">
                        <button onClick={() => handleEditAd(ad)} className="hover:text-yellow-400"><EditIcon /></button>
                        <button onClick={() => handleDeleteAd(ad.id)} className="hover:text-red-500"><TrashIcon /></button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </>
  );

  const renderCarousels = () => (
    <>
      <form onSubmit={handleAddCategory} className="bg-gray-800 p-4 rounded-lg mb-8 flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <input type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="New Carousel Title" required className="flex-grow p-2 bg-gray-700 rounded" />
        <button type="submit" className="py-2 px-4 bg-red-600 rounded hover:bg-red-700 flex items-center justify-center">
            <PlusIcon /> <span className="ml-2">Add Carousel</span>
        </button>
      </form>
      <div>
        <h3 className="text-lg font-semibold mb-4">Current Carousels</h3>
        <div className="space-y-2">
          {categories.map((cat, index) => (
            <div key={cat.title} className="bg-gray-800 p-3 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              {editingCategoryTitle === cat.title ? (
                <input type="text" value={newCategoryTitle} onChange={e => setNewCategoryTitle(e.target.value)} autoFocus onBlur={() => handleUpdateCategoryTitle(cat.title)} onKeyDown={e => e.key === 'Enter' && handleUpdateCategoryTitle(cat.title)} className="p-1 bg-gray-700 rounded w-full sm:w-auto" />
              ) : (
                <p className="font-medium">{cat.title}</p>
              )}
              <div className="flex items-center space-x-3 self-end sm:self-center">
                <button onClick={() => handleReorderCategory(index, 'up')} disabled={index === 0} className="disabled:opacity-25 hover:text-green-400"><ArrowUpIcon /></button>
                <button onClick={() => handleReorderCategory(index, 'down')} disabled={index === categories.length - 1} className="disabled:opacity-25 hover:text-green-400"><ArrowDownIcon /></button>
                <button onClick={() => { setEditingCategoryTitle(cat.title); setNewCategoryTitle(cat.title); }} className="hover:text-yellow-400"><EditIcon /></button>
                <button onClick={() => handleDeleteCategory(cat.title)} className="hover:text-red-500"><TrashIcon /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
  
  const renderContentManagement = (type: 'Movie' | 'Series') => {
    const items = type === 'Series' ? allSeries : allMovies;
    const title = type === 'Series' ? 'TV Shows' : 'Movies';

    const itemsWithCategory = items.map(item => {
        const parentCategories = categories
            .filter(cat => cat.items.some(i => !('isAd'in i) && i.id === item.id))
            .map(cat => cat.title);
        return {...item, categories: parentCategories };
    });

    return (
        <div className="space-y-4">
             <button onClick={() => handleOpenContentForm(type, null)} className="w-full mb-4 py-2 px-4 bg-red-800 rounded hover:bg-red-700 flex items-center justify-center">
                <PlusIcon /> <span className="ml-2">Add New {type === 'Series' ? 'TV Show' : 'Movie'}</span>
            </button>
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">All {title}</h3>
                {itemsWithCategory.map(item => (
                    <div key={item.id} className="bg-gray-800 p-2 rounded">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <div className="flex items-center min-w-0">
                                <img src={item.imageUrl} alt={item.title} className="w-10 h-14 object-cover rounded mr-3 flex-shrink-0" />
                                <div className="truncate">
                                    <div className="flex items-center gap-x-2 flex-wrap">
                                        <p className="font-medium truncate">{item.title}</p>
                                        {item.isPremium && <span className="flex-shrink-0 text-[10px] font-bold text-gray-900 bg-yellow-400 px-1.5 py-0.5 rounded-sm">PREMIUM {item.tokenCost ? `(${item.tokenCost})` : ''}</span>}
                                    </div>
                                    <p className="text-xs text-gray-400 truncate">
                                        In Carousels: {item.categories.join(', ') || 'None'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0 ml-auto sm:ml-2 self-end sm:self-center">
                                {type === 'Series' && (
                                    <button onClick={() => { setEditingContent(item); }} className="hover:text-blue-400 p-1" title="Manage Episodes">
                                      <ListIcon />
                                    </button>
                                )}
                                <button onClick={() => handleOpenContentForm(type, item)} className="hover:text-yellow-400 p-1"><EditIcon /></button>
                                <button onClick={() => handleDeleteContent(item.id)} className="hover:text-red-500 p-1"><TrashIcon /></button>
                            </div>
                        </div>
                    </div>
                ))}
                {items.length === 0 && <p className="text-center text-gray-400 text-sm py-4">No {title.toLowerCase()} found.</p>}
            </div>
        </div>
    );
  }

  const renderTvShowAds = () => (
    <>
        <form onSubmit={handleAssignSeriesAd} className="bg-gray-800 p-4 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-4">Assign Pre-Roll Ad to TV Show</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select 
                    value={selectedSeriesId} 
                    onChange={e => setSelectedSeriesId(e.target.value)} 
                    className="w-full p-2 bg-gray-700 rounded"
                    required
                >
                    <option value="">-- Select a TV Show --</option>
                    {allSeries.filter(s => !seriesAds.some(sa => sa.seriesId === s.id)).map(series => (
                        <option key={series.id} value={series.id}>{series.title}</option>
                    ))}
                </select>
                <select 
                    value={selectedAdId} 
                    onChange={e => setSelectedAdId(e.target.value)} 
                    className="w-full p-2 bg-gray-700 rounded"
                    required
                >
                    <option value="">-- Select a Pre-Roll Ad --</option>
                    {preRollAds.map(ad => (
                        <option key={ad.id} value={ad.id}>{ad.title}</option>
                    ))}
                </select>
            </div>
            <button type="submit" className="w-full mt-4 py-2 px-4 bg-red-600 rounded hover:bg-red-700 flex items-center justify-center">
                Assign Ad
            </button>
        </form>

        <div>
            <h3 className="text-lg font-semibold mb-4">Current Assignments</h3>
            <div className="space-y-2">
                {seriesAds.map(seriesAd => {
                    const ad = preRollAds.find(a => a.id === seriesAd.adId);
                    return (
                        <div key={seriesAd.id} className="bg-gray-800 p-3 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <div>
                                <p className="font-medium">{seriesAd.seriesTitle}</p>
                                <p className="text-xs text-gray-400">Assigned Ad: {ad ? ad.title : 'Unknown Ad'}</p>
                            </div>
                            <button onClick={() => handleDeleteSeriesAd(seriesAd.id)} className="hover:text-red-500 self-end sm:self-center"><TrashIcon /></button>
                        </div>
                    );
                })}
                {seriesAds.length === 0 && <p className="text-center text-gray-400 text-sm">No series-specific ads have been assigned.</p>}
            </div>
        </div>
    </>
  );

  const renderTokenManagement = () => (
    <div className="space-y-8">
        <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Initial User Token Balance</h3>
            <p className="text-sm text-gray-400 mb-2">Set the number of tokens new users start with.</p>
            <div className="flex items-center space-x-2">
                <input 
                    type="number" 
                    value={initialTokenBalance} 
                    onChange={e => setInitialTokenBalance(parseInt(e.target.value, 10) || 0)} 
                    className="w-full p-2 bg-gray-700 rounded" 
                />
                <button onClick={handleSaveInitialTokens} className="py-2 px-4 bg-red-600 rounded hover:bg-red-700 flex-shrink-0">
                    Save
                </button>
            </div>
        </div>

        <TokenPackageManagementSection 
            title="Token Packages for Purchase"
            packages={tokenPackages}
            onAdd={addTokenPackage}
            onUpdate={updateTokenPackage}
            onDelete={deleteTokenPackage}
            onDataChange={refreshAllData}
        />

        <AdManagementSection 
            title="Token Reward Ads"
            ads={tokenRewardAds}
            onAdd={addTokenRewardAd}
            onUpdate={updateTokenRewardAd}
            onDelete={deleteTokenRewardAd}
            onReorder={reorderTokenRewardAds}
            onDataChange={refreshAllData}
            onPreview={setPreviewingAd}
            hasTokenReward
            hasActiveToggle
        />
    </div>
  );

  const renderAdSettings = () => (
    <div className="space-y-8">
        <AdManagementSection 
            title="Pre-Roll Video Ads"
            ads={preRollAds}
            onAdd={addPreRollAd}
            onUpdate={updatePreRollAd}
            onDelete={deletePreRollAd}
            onReorder={reorderPreRollAds}
            onDataChange={refreshAllData}
            onPreview={setPreviewingAd}
        />
        <AdManagementSection 
            title="Mid-Roll Video Ads"
            ads={midRollAds}
            onAdd={addMidRollAd}
            onUpdate={updateMidRollAd}
            onDelete={deleteMidRollAd}
            onReorder={reorderMidRollAds}
            onDataChange={refreshAllData}
            onPreview={setPreviewingAd}
            hasCuePoint
        />
        <AdManagementSection 
            title="Post-Roll Video Ads"
            ads={postRollAds}
            onAdd={addPostRollAd}
            onUpdate={updatePostRollAd}
            onDelete={deletePostRollAd}
            onReorder={reorderPostRollAds}
            onDataChange={refreshAllData}
            onPreview={setPreviewingAd}
        />
        <ImageAdManagementSection
            title="Companion Ads"
            ads={companionAds}
            onAdd={addCompanionAd}
            onUpdate={updateCompanionAd}
            onDelete={deleteCompanionAd}
            onDataChange={refreshAllData}
            onPreview={setPreviewingCompanionAd}
        />
        <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Homepage Banner Ad</h3>
            <div className="space-y-3">
                <label className="block text-sm">Image URL <input type="url" name="imageUrl" value={bannerAd.imageUrl || ''} onChange={handleBannerChange} className="w-full mt-1 p-2 bg-gray-700 rounded" /></label>
                <label className="block text-sm">Link URL <input type="url" name="linkUrl" value={bannerAd.linkUrl || ''} onChange={handleBannerChange} className="w-full mt-1 p-2 bg-gray-700 rounded" /></label>
                <label className="block text-sm">Alt Text <input type="text" name="altText" value={bannerAd.altText || ''} onChange={handleBannerChange} className="w-full mt-1 p-2 bg-gray-700 rounded" /></label>
            </div>
            <button onClick={handleSaveBannerAd} className="mt-4 w-full py-2 px-4 bg-red-600 rounded hover:bg-red-700 flex items-center justify-center">
                Save Banner Ad Settings
            </button>
        </div>
    </div>
  );


  return (
    <>
        <div className="animate-fade-in">
             <style>{`
              @keyframes fade-in {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
              }
              .animate-fade-in { animation: fade-in 0.5s ease-out; }
           `}</style>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h1 className="text-4xl md:text-5xl font-bold">Admin Panel</h1>
                <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    Back to Site
                </button>
            </div>
            
            {/* Sticky Header with Tabs */}
            <div className="sticky top-[72px] z-10 bg-gray-900 mb-6 -mx-4 md:-mx-12 px-4 md:px-12">
                <div className="border-b border-gray-700">
                    <div className="flex overflow-x-auto whitespace-nowrap -mb-px">
                        <button onClick={() => setActiveTab('promoted')} className={`py-3 px-4 flex-shrink-0 font-medium text-sm ${activeTab === 'promoted' ? 'border-b-2 border-red-500 text-white' : 'text-gray-400 hover:text-white border-b-2 border-transparent'}`}>Promoted Ads</button>
                        <button onClick={() => setActiveTab('carousels')} className={`py-3 px-4 flex-shrink-0 font-medium text-sm ${activeTab === 'carousels' ? 'border-b-2 border-red-500 text-white' : 'text-gray-400 hover:text-white border-b-2 border-transparent'}`}>Carousels</button>
                        <button onClick={() => setActiveTab('tv_shows')} className={`py-3 px-4 flex-shrink-0 font-medium text-sm ${activeTab === 'tv_shows' ? 'border-b-2 border-red-500 text-white' : 'text-gray-400 hover:text-white border-b-2 border-transparent'}`}>TV Shows</button>
                        <button onClick={() => setActiveTab('movies')} className={`py-3 px-4 flex-shrink-0 font-medium text-sm ${activeTab === 'movies' ? 'border-b-2 border-red-500 text-white' : 'text-gray-400 hover:text-white border-b-2 border-transparent'}`}>Movies</button>
                        <button onClick={() => setActiveTab('tv_ads')} className={`py-3 px-4 flex-shrink-0 font-medium text-sm ${activeTab === 'tv_ads' ? 'border-b-2 border-red-500 text-white' : 'text-gray-400 hover:text-white border-b-2 border-transparent'}`}>TV Show Ads</button>
                        <button onClick={() => setActiveTab('tokens')} className={`py-3 px-4 flex-shrink-0 font-medium text-sm ${activeTab === 'tokens' ? 'border-b-2 border-red-500 text-white' : 'text-gray-400 hover:text-white border-b-2 border-transparent'}`}>Tokens</button>
                        <button onClick={() => setActiveTab('settings')} className={`py-3 px-4 flex-shrink-0 font-medium text-sm ${activeTab === 'settings' ? 'border-b-2 border-red-500 text-white' : 'text-gray-400 hover:text-white border-b-2 border-transparent'}`}>Ad Settings</button>
                    </div>
                </div>
            </div>
            
            {/* Content */}
            <div className="bg-gray-900">
                {renderTabContent()}
            </div>
        </div>

        {/* Success Toast - positioned relative to the viewport */}
        {showSuccess && (
                <div className="fixed bottom-5 right-5 bg-green-600 text-white py-2 px-4 rounded-lg flex items-center shadow-lg animate-pulse z-[150]">
                    <CheckCircleIcon />
                    <span className="ml-2">Operation successful!</span>
                </div>
        )}
        
        {isContentFormOpen && (
            <ContentItemForm
                itemToEdit={editingContent}
                itemType={contentFormType}
                allCategories={categories}
                onClose={handleCloseContentForm}
                onSave={handleContentItemSave}
            />
        )}
        
        {editingContent && editingContent.type === 'Series' && !isContentFormOpen && (
             <SeriesManagerModal
                initialSeasons={editingContent.seasons || []}
                onClose={() => setEditingContent(null)}
                onSave={(updatedSeasons) => {
                    const updatedItem = {...editingContent, seasons: updatedSeasons};
                    // We just need to update the item data, not its category placement
                    const currentCategories = categories
                        .filter(cat => cat.items.some(i => !('isAd'in i) && i.id === updatedItem.id))
                        .map(cat => cat.title);
                    updateContentItemAndCategories(updatedItem, currentCategories);
                    setEditingContent(null);
                    refreshAllData();
                }}
            />
        )}

        {previewingAd && (
            <div className="fixed inset-0 bg-black bg-opacity-90 z-[120] flex items-center justify-center">
                 <div className="w-full max-w-4xl aspect-video relative">
                    <AdPlayer
                        ad={previewingAd}
                        onAdFinish={() => setPreviewingAd(null)}
                    />
                     <button onClick={() => setPreviewingAd(null)} className="absolute -top-8 right-0 text-white hover:text-red-500"><CloseIcon/></button>
                 </div>
            </div>
        )}
        {previewingCompanionAd && (
            <div 
                className="fixed inset-0 bg-black bg-opacity-80 z-[120] flex items-center justify-center p-4"
                onClick={() => setPreviewingCompanionAd(null)}
            >
                <div className="relative p-4 bg-gray-800 rounded-lg shadow-xl" onClick={e => e.stopPropagation()}>
                    <a href={previewingCompanionAd.linkUrl} target="_blank" rel="noopener noreferrer">
                        <img src={previewingCompanionAd.imageUrl} alt={previewingCompanionAd.altText} className="max-w-[80vw] max-h-[80vh] object-contain rounded" />
                    </a>
                    <p className="text-center mt-2 text-sm text-gray-300">{previewingCompanionAd.altText}</p>
                </div>
            </div>
        )}
    </>
  );
};

// --- Content Item Form Component ---
interface ContentItemFormProps {
    itemToEdit: ContentItem | null;
    itemType: 'Movie' | 'Series';
    allCategories: ContentCategory[];
    onClose: () => void;
    onSave: (formData: ContentItem, selectedCategories: string[]) => void;
}

const ContentItemForm: React.FC<ContentItemFormProps> = ({ itemToEdit, itemType, allCategories, onClose, onSave }) => {
    const emptyForm: Omit<ContentItem, 'id' | 'type'> = {
        title: '', description: '', imageUrl: '', backdropUrl: '', videoUrl: '', trailerUrl: '', genres: [], seasons: [], isPremium: false, tokenCost: 0
    };
    const [formData, setFormData] = useState<Omit<ContentItem, 'id' | 'type' | 'seasons'> & {seasons?: Season[], isPremium?: boolean}>(itemToEdit || emptyForm);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isSeriesManagerOpen, setIsSeriesManagerOpen] = useState(false);

    useEffect(() => {
        if (itemToEdit) {
            const parentCategories = allCategories
                .filter(cat => cat.items.some(i => !('isAd'in i) && i.id === itemToEdit.id))
                .map(cat => cat.title);
            setSelectedCategories(parentCategories);
            setFormData(itemToEdit);
        }
    }, [itemToEdit, allCategories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(p => ({ ...p, [name]: checked }));
        } else if (type === 'number') {
            setFormData(p => ({ ...p, [name]: parseInt(value, 10) || 0 }));
        } else {
            setFormData(p => ({ ...p, [name]: value }));
        }
    };
    const handleGenresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(p => ({ ...p, genres: e.target.value.split(',').map(g => g.trim()) }));
    };

    const handleCategoryToggle = (categoryTitle: string) => {
        setSelectedCategories(prev => 
            prev.includes(categoryTitle) 
                ? prev.filter(c => c !== categoryTitle)
                : [...prev, categoryTitle]
        );
    }
    
    const handleSaveSeasons = (updatedSeasons: Season[]) => {
        setFormData(p => ({...p, seasons: updatedSeasons}));
        setIsSeriesManagerOpen(false);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = { ...formData, type: itemType, id: itemToEdit?.id || '' } as ContentItem;
        onSave(finalData, selectedCategories);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-80 z-[110] flex items-center justify-center p-4">
                <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                    <div className="flex justify-between items-center p-4 border-b border-gray-700">
                        <h3 className="text-lg font-semibold">{itemToEdit ? 'Edit' : 'Add New'} {itemType}</h3>
                        <button onClick={onClose}><CloseIcon /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto">
                        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="w-full p-2 bg-gray-700 rounded" />
                        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="w-full p-2 bg-gray-700 rounded" rows={3} />
                        <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL (Poster)" required className="w-full p-2 bg-gray-700 rounded" />
                        <input type="url" name="backdropUrl" value={formData.backdropUrl} onChange={handleChange} placeholder="Backdrop Image URL" required className="w-full p-2 bg-gray-700 rounded" />
                        <input type="text" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="Video URL (for Movie)" required={itemType === 'Movie'} className="w-full p-2 bg-gray-700 rounded" />
                        <input type="url" name="trailerUrl" value={formData.trailerUrl} onChange={handleChange} placeholder="Trailer URL" required className="w-full p-2 bg-gray-700 rounded" />
                        <input type="text" name="genres" value={formData.genres.join(', ')} onChange={handleGenresChange} placeholder="Genres (comma-separated)" required className="w-full p-2 bg-gray-700 rounded" />
                        
                        <div className="pt-2">
                            <label className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isPremium"
                                    checked={!!formData.isPremium}
                                    onChange={handleChange}
                                    className="form-checkbox h-5 w-5 bg-gray-700 border-gray-500 text-red-600 focus:ring-red-500 rounded"
                                />
                                <span>Mark as Premium Content</span>
                            </label>
                        </div>
                        
                        {formData.isPremium && (
                            <div>
                                <label className="block text-sm text-gray-300">Token Cost</label>
                                <input
                                    type="number"
                                    name="tokenCost"
                                    value={formData.tokenCost || ''}
                                    onChange={handleChange}
                                    placeholder="e.g., 10"
                                    className="w-full mt-1 p-2 bg-gray-700 rounded"
                                />
                            </div>
                        )}
                        
                         {itemType === 'Series' && (
                            <div className="pt-2">
                                <button type="button" onClick={() => setIsSeriesManagerOpen(true)} className="w-full py-2 px-4 bg-gray-600 rounded hover:bg-gray-500 flex items-center justify-center">
                                    <ListIcon />
                                    <span className="ml-2">Manage Seasons & Episodes ({formData.seasons?.length || 0})</span>
                                </button>
                            </div>
                        )}
                        
                        <div className="pt-2">
                            <h4 className="font-semibold mb-2 text-sm">Assign to Carousels</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 bg-gray-700 rounded-md max-h-32 overflow-y-auto">
                                {allCategories.map(cat => (
                                    <label key={cat.title} className="flex items-center space-x-2 text-sm cursor-pointer">
                                        <input 
                                            type="checkbox"
                                            checked={selectedCategories.includes(cat.title)}
                                            onChange={() => handleCategoryToggle(cat.title)}
                                            className="form-checkbox bg-gray-700 border-gray-500 text-red-600 focus:ring-red-500"
                                        />
                                        <span>{cat.title}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-2">
                            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 rounded hover:bg-gray-500">Cancel</button>
                            <button type="submit" className="py-2 px-4 bg-red-600 rounded hover:bg-red-700">{itemToEdit ? 'Save Changes' : 'Add Item'}</button>
                        </div>
                    </form>
                </div>
            </div>
            {isSeriesManagerOpen && (
                <SeriesManagerModal
                    initialSeasons={formData.seasons || []}
                    onClose={() => setIsSeriesManagerOpen(false)}
                    onSave={handleSaveSeasons}
                />
            )}
        </>
    );
};


// Reusable component for managing a list of video ads
interface AdManagementSectionProps {
    title: string;
    ads: VideoAd[];
    onAdd: (ad: Omit<VideoAd, 'id'>) => void;
    onUpdate: (ad: VideoAd) => void;
    onDelete: (id: string) => void;
    onReorder?: (startIndex: number, endIndex: number) => void;
    onDataChange: () => void;
    onPreview: (ad: VideoAd) => void;
    hasCuePoint?: boolean;
    hasTokenReward?: boolean;
    hasActiveToggle?: boolean;
}

const AdManagementSection: React.FC<AdManagementSectionProps> = ({ title, ads, onAdd, onUpdate, onDelete, onReorder, onDataChange, onPreview, hasCuePoint, hasTokenReward, hasActiveToggle }) => {
    const emptyForm: Omit<VideoAd, 'id'> = { title: '', videoUrl: '', linkUrl: '', duration: 15, skipDelay: 5, cuePoint: 30, tokenReward: 5, isActive: true };
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingVideoAd, setEditingVideoAd] = useState<VideoAd | null>(null);
    const [videoAdFormData, setVideoAdFormData] = useState<Omit<VideoAd, 'id'>>(emptyForm);
    const [draggedItem, setDraggedItem] = useState<VideoAd | null>(null);
    const [dragOverItem, setDragOverItem] = useState<VideoAd | null>(null);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setVideoAdFormData(p => ({ ...p, [name]: checked }));
        } else {
            setVideoAdFormData(p => ({ ...p, [name]: type === 'number' ? parseFloat(value) : value }));
        }
    }

    const handleEdit = (ad: VideoAd) => {
        setEditingVideoAd(ad);
        setVideoAdFormData(ad);
        setIsFormOpen(true);
    }
    
    const handleCancel = () => {
        setEditingVideoAd(null);
        setVideoAdFormData(emptyForm);
        setIsFormOpen(false);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingVideoAd) {
            onUpdate({ ...videoAdFormData, id: editingVideoAd.id });
        } else {
            onAdd(videoAdFormData);
        }
        handleCancel();
        onDataChange();
    }
    
    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this video ad?')) {
            onDelete(id);
            onDataChange();
        }
    }
    
    const handleToggleActive = (ad: VideoAd) => {
        const currentStatus = ad.isActive !== false;
        const updatedAd = { ...ad, isActive: !currentStatus };
        onUpdate(updatedAd);
        onDataChange();
    };

    // --- Drag and Drop Handlers ---
    const handleDragStart = (e: React.DragEvent, ad: VideoAd) => {
        setDraggedItem(ad);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, ad: VideoAd) => {
        e.preventDefault();
        if (draggedItem?.id !== ad.id) {
            setDragOverItem(ad);
        }
    };

    const handleDrop = (e: React.DragEvent, targetAd: VideoAd) => {
        e.preventDefault();
        if (draggedItem && onReorder) {
            const startIndex = ads.findIndex(ad => ad.id === draggedItem.id);
            const endIndex = ads.findIndex(ad => ad.id === targetAd.id);
            if (startIndex !== -1 && endIndex !== -1) {
                onReorder(startIndex, endIndex);
                onDataChange();
            }
        }
        setDraggedItem(null);
        setDragOverItem(null);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setDragOverItem(null);
    };
    
    const handleDragLeave = () => {
        setDragOverItem(null);
    }

    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            {isFormOpen ? (
                <form onSubmit={handleSubmit} className="space-y-3 mb-4">
                    <input type="text" name="title" value={videoAdFormData.title} onChange={handleInputChange} placeholder="Title" required className="w-full p-2 bg-gray-700 rounded" />
                    <input type="url" name="videoUrl" value={videoAdFormData.videoUrl} onChange={handleInputChange} placeholder="Video URL" required className="w-full p-2 bg-gray-700 rounded" />
                    <input type="url" name="linkUrl" value={videoAdFormData.linkUrl} onChange={handleInputChange} placeholder="Link URL" required className="w-full p-2 bg-gray-700 rounded" />
                    <input type="number" name="duration" value={videoAdFormData.duration} onChange={handleInputChange} placeholder="Duration (s)" required className="w-full p-2 bg-gray-700 rounded" />
                    <input type="number" name="skipDelay" value={videoAdFormData.skipDelay} onChange={handleInputChange} placeholder="Skip Delay (s)" required className="w-full p-2 bg-gray-700 rounded" />
                    {hasCuePoint && <input type="number" name="cuePoint" value={videoAdFormData.cuePoint || ''} onChange={handleInputChange} placeholder="Cue Point (s)" required className="w-full p-2 bg-gray-700 rounded" />}
                    {hasTokenReward && <input type="number" name="tokenReward" value={videoAdFormData.tokenReward || ''} onChange={handleInputChange} placeholder="Token Reward" required className="w-full p-2 bg-gray-700 rounded" />}
                    
                    <label className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer pt-2">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={videoAdFormData.isActive}
                            onChange={handleInputChange}
                            className="form-checkbox h-5 w-5 bg-gray-700 border-gray-500 text-red-600 focus:ring-red-500 rounded"
                        />
                        <span>Ad is Active</span>
                    </label>

                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={handleCancel} className="py-2 px-4 bg-gray-600 rounded hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="py-2 px-4 bg-red-600 rounded hover:bg-red-700">{editingVideoAd ? 'Update' : 'Add'}</button>
                    </div>
                </form>
            ) : (
                <button onClick={() => setIsFormOpen(true)} className="w-full mb-4 py-2 px-4 bg-red-800 rounded hover:bg-red-700 flex items-center justify-center">
                    <PlusIcon /> <span className="ml-2">Add New</span>
                </button>
            )}
            <div className="space-y-2">
                {ads.map(ad => (
                    <div 
                        key={ad.id} 
                        draggable={onReorder !== undefined}
                        onDragStart={(e) => handleDragStart(e, ad)}
                        onDragOver={(e) => handleDragOver(e, ad)}
                        onDrop={(e) => handleDrop(e, ad)}
                        onDragEnd={handleDragEnd}
                        onDragLeave={handleDragLeave}
                        className={`bg-gray-700 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 transition-all duration-150
                            ${draggedItem?.id === ad.id ? 'opacity-40' : 'opacity-100'}
                            ${dragOverItem?.id === ad.id ? 'border-2 border-blue-400' : 'border-2 border-transparent'}
                        `}
                    >
                        <div className="flex items-center w-full">
                           {onReorder && <span className="cursor-move mr-3 text-gray-400"><DragIcon /></span>}
                            {hasActiveToggle ? (
                                <button
                                    onClick={() => handleToggleActive(ad)}
                                    title={`Click to set as ${ad.isActive !== false ? 'Inactive' : 'Active'}`}
                                    className={`flex items-center justify-center w-24 text-xs py-1 rounded-full mr-3 flex-shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-700 focus:ring-red-500 ${
                                        ad.isActive !== false 
                                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                                        : 'bg-gray-500 hover:bg-gray-400 text-gray-100'
                                    }`}
                                >
                                    <span className={`w-2 h-2 rounded-full mr-2 ${ad.isActive !== false ? 'bg-white/80' : 'bg-gray-300'}`}></span>
                                    {ad.isActive !== false ? 'Active' : 'Inactive'}
                                </button>
                            ) : (
                               <span className={`w-2 h-2 rounded-full mr-3 flex-shrink-0 ${ad.isActive !== false ? 'bg-green-500' : 'bg-gray-500'}`} title={ad.isActive !== false ? 'Active' : 'Inactive'}></span>
                            )}
                            <div>
                                <p className="font-medium">{ad.title}</p>
                                <p className="text-xs text-gray-400">
                                    {ad.duration}s duration
                                    {hasCuePoint && ad.cuePoint && ` | Cue @ ${ad.cuePoint}s`}
                                    {hasTokenReward && ad.tokenReward && ` | Rewards ${ad.tokenReward} tokens`}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 self-end sm:self-center">
                            <button onClick={() => onPreview(ad)} className="hover:text-blue-400" title="Preview Ad"><PreviewIcon /></button>
                            <button onClick={() => handleEdit(ad)} className="hover:text-yellow-400" title="Edit Ad"><EditIcon /></button>
                            <button onClick={() => handleDelete(ad.id)} className="hover:text-red-500" title="Delete Ad"><TrashIcon /></button>
                        </div>
                    </div>
                ))}
                {ads.length === 0 && <p className="text-center text-gray-400 text-sm">No ads configured.</p>}
            </div>
        </div>
    );
};


// Reusable component for managing a list of image-based ads (Companion, Banner)
interface ImageAdManagementSectionProps {
    title: string;
    ads: CompanionAd[];
    onAdd: (ad: Omit<CompanionAd, 'id'>) => void;
    onUpdate: (ad: CompanionAd) => void;
    onDelete: (id: string) => void;
    onDataChange: () => void;
    onPreview: (ad: CompanionAd) => void;
}

const ImageAdManagementSection: React.FC<ImageAdManagementSectionProps> = ({ title, ads, onAdd, onUpdate, onDelete, onDataChange, onPreview }) => {
    const emptyForm: Omit<CompanionAd, 'id'> = { imageUrl: '', linkUrl: '', altText: '' };
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAd, setEditingAd] = useState<CompanionAd | null>(null);
    const [formData, setFormData] = useState<Omit<CompanionAd, 'id'>>(emptyForm);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(p => ({ ...p, [name]: value }));
    }

    const handleEdit = (ad: CompanionAd) => {
        setEditingAd(ad);
        setFormData(ad);
        setIsFormOpen(true);
    }

    const handleCancel = () => {
        setEditingAd(null);
        setFormData(emptyForm);
        setIsFormOpen(false);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingAd) {
            onUpdate({ ...formData, id: editingAd.id });
        } else {
            onAdd(formData);
        }
        handleCancel();
        onDataChange();
    }
    
    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this image ad?')) {
            onDelete(id);
            onDataChange();
        }
    }

    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            {isFormOpen ? (
                <form onSubmit={handleSubmit} className="space-y-3 mb-4">
                    <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="Image URL" required className="w-full p-2 bg-gray-700 rounded" />
                    <input type="url" name="linkUrl" value={formData.linkUrl} onChange={handleInputChange} placeholder="Link URL" required className="w-full p-2 bg-gray-700 rounded" />
                    <input type="text" name="altText" value={formData.altText} onChange={handleInputChange} placeholder="Alt Text" required className="w-full p-2 bg-gray-700 rounded" />
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={handleCancel} className="py-2 px-4 bg-gray-600 rounded hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="py-2 px-4 bg-red-600 rounded hover:bg-red-700">{editingAd ? 'Update' : 'Add'}</button>
                    </div>
                </form>
            ) : (
                <button onClick={() => setIsFormOpen(true)} className="w-full mb-4 py-2 px-4 bg-red-800 rounded hover:bg-red-700 flex items-center justify-center">
                    <PlusIcon /> <span className="ml-2">Add New</span>
                </button>
            )}
            <div className="space-y-2">
                {ads.map(ad => (
                    <div key={ad.id} className="bg-gray-700 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="flex items-center">
                            <img src={ad.imageUrl} alt={ad.altText} className="w-16 h-10 object-cover rounded mr-3" />
                            <p className="font-medium text-sm truncate">{ad.altText}</p>
                        </div>
                        <div className="flex items-center space-x-3 self-end sm:self-center">
                            <button onClick={() => onPreview(ad)} className="hover:text-blue-400" title="Preview Ad"><PreviewIcon /></button>
                            <button onClick={() => handleEdit(ad)} className="hover:text-yellow-400" title="Edit Ad"><EditIcon /></button>
                            <button onClick={() => handleDelete(ad.id)} className="hover:text-red-500" title="Delete Ad"><TrashIcon /></button>
                        </div>
                    </div>
                ))}
                {ads.length === 0 && <p className="text-center text-gray-400 text-sm">No ads configured.</p>}
            </div>
        </div>
    );
};

// Reusable component for managing a list of token packages
interface TokenPackageManagementSectionProps {
    title: string;
    packages: TokenPackage[];
    onAdd: (pkg: Omit<TokenPackage, 'id'>) => void;
    onUpdate: (pkg: TokenPackage) => void;
    onDelete: (id: string) => void;
    onDataChange: () => void;
}

const TokenPackageManagementSection: React.FC<TokenPackageManagementSectionProps> = ({ title, packages, onAdd, onUpdate, onDelete, onDataChange }) => {
    const emptyForm: Omit<TokenPackage, 'id'> = { amount: 0, price: '' };
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<TokenPackage | null>(null);
    const [formData, setFormData] = useState<Omit<TokenPackage, 'id'>>(emptyForm);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(p => ({ ...p, [name]: type === 'number' ? parseInt(value, 10) || 0 : value }));
    }

    const handleEdit = (pkg: TokenPackage) => {
        setEditingPackage(pkg);
        setFormData(pkg);
        setIsFormOpen(true);
    }

    const handleCancel = () => {
        setEditingPackage(null);
        setFormData(emptyForm);
        setIsFormOpen(false);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPackage) {
            onUpdate({ ...formData, id: editingPackage.id });
        } else {
            onAdd(formData);
        }
        handleCancel();
        onDataChange();
    }
    
    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this token package?')) {
            onDelete(id);
            onDataChange();
        }
    }

    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            {isFormOpen ? (
                <form onSubmit={handleSubmit} className="space-y-3 mb-4">
                    <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} placeholder="Token Amount" required className="w-full p-2 bg-gray-700 rounded" />
                    <input type="text" name="price" value={formData.price} onChange={handleInputChange} placeholder="Price (e.g., $4.99)" required className="w-full p-2 bg-gray-700 rounded" />
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={handleCancel} className="py-2 px-4 bg-gray-600 rounded hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="py-2 px-4 bg-red-600 rounded hover:bg-red-700">{editingPackage ? 'Update' : 'Add'}</button>
                    </div>
                </form>
            ) : (
                <button onClick={() => setIsFormOpen(true)} className="w-full mb-4 py-2 px-4 bg-red-800 rounded hover:bg-red-700 flex items-center justify-center">
                    <PlusIcon /> <span className="ml-2">Add New Package</span>
                </button>
            )}
            <div className="space-y-2">
                {packages.map(pkg => (
                    <div key={pkg.id} className="bg-gray-700 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <p className="font-medium">{pkg.amount} Tokens for {pkg.price}</p>
                        <div className="flex items-center space-x-3 self-end sm:self-center">
                            <button onClick={() => handleEdit(pkg)} className="hover:text-yellow-400" title="Edit Package"><EditIcon /></button>
                            <button onClick={() => handleDelete(pkg.id)} className="hover:text-red-500" title="Delete Package"><TrashIcon /></button>
                        </div>
                    </div>
                ))}
                {packages.length === 0 && <p className="text-center text-gray-400 text-sm">No token packages configured.</p>}
            </div>
        </div>
    );
};


export default AdminPanel;