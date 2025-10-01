import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ContentRow from './components/ContentRow';
import Footer from './components/Footer';
import VideoPlayer from './components/VideoPlayer';
import AdminPanel from './components/AdminPanel';
import BannerAd from './components/BannerAd';
import EpisodeSelector from './components/EpisodeSelector';
import MovieDetailsModal from './components/MovieDetailsModal';
import GetTokensModal from './components/GetTokensModal';
import LoginModal from './components/LoginModal';
import InfoPage from './components/InfoPage';
import AccountPage from './components/AccountPage';

import { getMockContent } from './services/mockDataService';
import { getPromotedAds } from './services/mockPromotedAdService';
import { getBannerAd } from './services/mockBannerAdService';
import { interleaveAdsInContent } from './utils/adUtils';
import { getTokenBalance, spendTokens } from './services/tokenService';
import { getUnlockedContent, unlockContent } from './services/unlockedContentService';
import { getCurrentUser, logout } from './services/authService';
import { getMyList, toggleMyList } from './services/myListService';

import type { ContentItem, ContentCategory, BannerAd as BannerAdType, Episode, User, InfoPageContent, ContentGridItem } from './types';

function App() {
  const [content, setContent] = useState<ContentCategory[]>([]);
  const [heroItem, setHeroItem] = useState<ContentItem | null>(null);
  const [playingItem, setPlayingItem] = useState<{ item: ContentItem | Episode; series?: ContentItem } | null>(null);
  const [seriesForEpisodeSelection, setSeriesForEpisodeSelection] = useState<ContentItem | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<ContentItem | null>(null);
  const [bannerAd, setBannerAd] = useState<BannerAdType | null>(null);
  const [activeCategory, setActiveCategory] = useState('Home');

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ContentGridItem[]>([]);

  // User State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Token and Content Unlock State
  const [tokenBalance, setTokenBalance] = useState(0);
  const [unlockedContentIds, setUnlockedContentIds] = useState<string[]>([]);
  const [isGetTokensModalOpen, setIsGetTokensModalOpen] = useState(false);
  const [contentPendingUnlock, setContentPendingUnlock] = useState<{ item: ContentItem | Episode; series?: ContentItem } | null>(null);
  
  // My List State
  const [myListIds, setMyListIds] = useState<string[]>([]);

  useEffect(() => {
    setCurrentUser(getCurrentUser()); // Check for logged in user on mount

    const allContent = getMockContent();
    const promotedAds = getPromotedAds();
    const contentWithAds = interleaveAdsInContent(allContent, promotedAds);
    
    setContent(contentWithAds);
    if (allContent.length > 0 && allContent[0].items.length > 0) {
      const firstContentItem = allContent[0].items.find(item => !('isAd' in item)) as ContentItem;
      if(firstContentItem) {
        setHeroItem(firstContentItem);
      }
    }
    setBannerAd(getBannerAd());
    
    // Load user-specific data
    handleTokensUpdated();
    handleContentUnlocked();
    setMyListIds(getMyList());
  }, []);

  useEffect(() => {
    if (activeCategory !== 'Search') {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [activeCategory]);


  const handleTokensUpdated = () => {
    setTokenBalance(getTokenBalance());
  };

  const handleContentUnlocked = () => {
      setUnlockedContentIds(getUnlockedContent());
  };

  const playContent = (item: ContentItem | Episode, series?: ContentItem) => {
      if ('episodeNumber' in item) { // It's an episode
          setPlayingItem({ item: item, series: series });
          setSeriesForEpisodeSelection(null);
      } else { // It's a movie
          setPlayingItem({ item: item });
          setSelectedMovie(null);
      }
  };

  const handleInitiatePlayback = (item: ContentItem | Episode, series?: ContentItem, skipConfirmation?: boolean) => {
    const contentToUnlock = (series || item) as ContentItem;

    // Not premium or no cost, just play
    if (!contentToUnlock.isPremium || !contentToUnlock.tokenCost) {
        playContent(item, series);
        return;
    }

    // Already unlocked, just play
    if (unlockedContentIds.includes(contentToUnlock.id)) {
        playContent(item, series);
        return;
    }

    // Check balance and ask to unlock
    if (tokenBalance >= contentToUnlock.tokenCost) {
        const performUnlock = () => {
            if (spendTokens(contentToUnlock.tokenCost)) {
                unlockContent(contentToUnlock.id);
                handleTokensUpdated();
                handleContentUnlocked();
                // Use a slight delay to allow state to update before playing
                setTimeout(() => playContent(item, series), 100);
            }
        };

        if (skipConfirmation) {
            performUnlock();
        } else {
            if (window.confirm(`This content is premium. Unlock "${contentToUnlock.title}" for ${contentToUnlock.tokenCost} tokens? This is a one-time purchase.`)) {
                performUnlock();
            }
        }
    } else {
        alert(`You need ${contentToUnlock.tokenCost} tokens to watch this, but you only have ${tokenBalance}. Please buy or earn more tokens.`);
        setContentPendingUnlock({item, series});
        setIsGetTokensModalOpen(true);
    }
  };

  const handlePlay = (item: ContentItem) => {
    if (item.type === 'Series') {
      setSeriesForEpisodeSelection(item);
    } else {
      setSelectedMovie(item);
    }
  };
  
  const handleStartMoviePlayback = (movie: ContentItem) => {
    handleInitiatePlayback(movie);
  };

  const handleEpisodePlay = (episode: Episode) => {
    handleInitiatePlayback(episode, seriesForEpisodeSelection || undefined);
  };

  const handleClosePlayer = () => {
    if (playingItem?.series) {
      setSeriesForEpisodeSelection(playingItem.series);
    }
    setPlayingItem(null);
  };
  
  const handleAdsUpdated = () => {
    const allContent = getMockContent();
    const promotedAds = getPromotedAds();
    const contentWithAds = interleaveAdsInContent(allContent, promotedAds);
    setContent(contentWithAds);
    setBannerAd(getBannerAd());
  }

  const handleNavClick = (category: string) => {
    setActiveCategory(category);
    setPlayingItem(null);
    setSeriesForEpisodeSelection(null);
    setSelectedMovie(null);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setActiveCategory('Home'); // Go to home on logout
  };

  const handleToggleMyList = (contentId: string) => {
    const allItems = content.flatMap(c => c.items);
    const item = allItems.find(i => !('isAd' in i) && (i as ContentItem).id === contentId);
    if (item) {
        const newList = toggleMyList(contentId);
        setMyListIds(newList);
    }
  };
  
  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      handleNavClick('Home');
      return;
    }
    
    setSearchQuery(trimmedQuery);
    setActiveCategory('Search');
    setPlayingItem(null);
    setSeriesForEpisodeSelection(null);
    setSelectedMovie(null);

    // Using the original unfiltered content for a comprehensive search
    const allContentItems = getMockContent()
      .flatMap(category => category.items)
      .filter(item => !('isAd' in item));
    
    const uniqueItems = Array.from(new Map(allContentItems.map(item => [(item as ContentItem).id, item])).values()) as ContentItem[];

    const lowerCaseQuery = trimmedQuery.toLowerCase();
    const results = uniqueItems.filter(item => 
      item.title.toLowerCase().includes(lowerCaseQuery) ||
      item.description.toLowerCase().includes(lowerCaseQuery)
    );
    
    setSearchResults(results);
  };

  const unlockedContentItems = useMemo(() => {
    if (!unlockedContentIds.length) return [];
    const allContentItems = new Map<string, ContentItem>();
    content
      .flatMap(category => category.items)
      .forEach(item => {
        if (!('isAd' in item)) {
          allContentItems.set(item.id, item);
        }
      });
    return unlockedContentIds.map(id => allContentItems.get(id)).filter((item): item is ContentItem => !!item);
  }, [unlockedContentIds, content]);

  const displayedContent = useMemo(() => {
    if (activeCategory === 'Home') {
      return content;
    }
    if (activeCategory === 'TV Shows') {
      return content
        .map(category => ({
          ...category,
          items: category.items.filter(item => !('isAd' in item) && (item as ContentItem).type === 'Series')
        }))
        .filter(category => category.items.length > 0);
    }
    if (activeCategory === 'Movies') {
      return content
        .map(category => ({
          ...category,
          items: category.items.filter(item => !('isAd' in item) && (item as ContentItem).type === 'Movie')
        }))
        .filter(category => category.items.length > 0);
    }
    if (activeCategory === 'My List') {
      const allItems = content
        .flatMap(category => category.items)
        .filter(item => !('isAd' in item) && myListIds.includes((item as ContentItem).id));
      
      const uniqueItems = Array.from(new Map(allItems.map(item => [(item as ContentItem).id, item])).values());
      
      if (uniqueItems.length > 0) {
        return [{ title: 'My List', items: uniqueItems }];
      }
      return []; // Return empty array so we can show a message
    }
    if (activeCategory === 'Premium') {
      return content
        .map(category => ({
          ...category,
          items: category.items.filter(item => !('isAd' in item) && (item as ContentItem).isPremium === true)
        }))
        .filter(category => category.items.length > 0);
    }
    if (activeCategory === 'New & Popular') {
      return content.filter(category => 
        category.title === 'Most Popular' || category.title === 'Trending Now'
      );
    }
    return content;
  }, [content, activeCategory, myListIds]);

  const fullPageCategories = ['About Us', 'Careers', 'Press', 'Contact Us', 'Help Center', 'FAQ', 'Terms of Use', 'Privacy Policy', 'Cookie Policy', 'Account', 'Admin Panel'];
  const isFullPageCategoryActive = fullPageCategories.includes(activeCategory);
  
  const renderMainContent = () => {
    if (activeCategory === 'Admin Panel' && currentUser?.role === 'admin') {
      return (
        <AdminPanel
          onClose={() => setActiveCategory('Home')}
          onAdsUpdated={handleAdsUpdated}
        />
      );
    }
    
    if (activeCategory === 'Account' && currentUser) {
      return (
        <AccountPage
          currentUser={currentUser}
          tokenBalance={tokenBalance}
          unlockedContent={unlockedContentItems}
          onGetTokensClick={() => setIsGetTokensModalOpen(true)}
          onCardPlay={handlePlay}
          myListIds={myListIds}
          onToggleMyList={handleToggleMyList}
          onClose={() => setActiveCategory('Home')}
        />
      );
    }

    if (fullPageCategories.includes(activeCategory)) {
      return <InfoPage page={activeCategory} onClose={() => setActiveCategory('Home')} />;
    }

    if (activeCategory === 'Search') {
        if (searchResults.length > 0) {
            return (
                <ContentRow 
                    key="search-results"
                    title={`Search Results for "${searchQuery}"`} 
                    items={searchResults}
                    onCardPlay={handlePlay}
                    unlockedContentIds={unlockedContentIds}
                    myListIds={myListIds}
                    onToggleMyList={handleToggleMyList}
                />
            );
        }
        return (
            <div className="text-center text-gray-400 mt-20">
                <h2 className="text-2xl font-bold mb-2">No results found for "{searchQuery}"</h2>
                <p>Try searching for a different movie or show.</p>
            </div>
        );
    }
    
    if (displayedContent.length > 0) {
      return displayedContent.map((category) => (
        <ContentRow 
          key={category.title} 
          title={category.title} 
          items={category.items}
          onCardPlay={handlePlay}
          unlockedContentIds={unlockedContentIds}
          myListIds={myListIds}
          onToggleMyList={handleToggleMyList}
        />
      ));
    }
    
    if (activeCategory === 'My List') {
      return (
        <div className="text-center text-gray-400 mt-20">
            <h2 className="text-2xl font-bold mb-2">Your list is empty</h2>
            <p>Add shows and movies to your list to watch them later.</p>
        </div>
      );
    }

    return null; // Or some other fallback
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar 
        onAdminClick={() => handleNavClick('Admin Panel')}
        onNavClick={handleNavClick}
        activeCategory={activeCategory}
        tokenBalance={tokenBalance}
        onGetTokensClick={() => setIsGetTokensModalOpen(true)}
        currentUser={currentUser}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onSearch={handleSearch}
      />
      
      {!isFullPageCategoryActive && activeCategory === 'Home' && heroItem && (
        <Hero 
            item={heroItem} 
            onPlay={handlePlay} 
            unlockedContentIds={unlockedContentIds}
            myListIds={myListIds}
            onToggleMyList={handleToggleMyList}
        />
      )}

      <main className={`px-4 md:px-12 ${!isFullPageCategoryActive && activeCategory === 'Home' ? 'mt-8' : 'mt-28'}`}>
        {renderMainContent()}
        {!isFullPageCategoryActive && activeCategory !== 'Search' && bannerAd && <BannerAd ad={bannerAd} />}
      </main>

      <Footer onLinkClick={handleNavClick} />
      
      {playingItem && (
        <VideoPlayer 
          item={playingItem.item}
          series={playingItem.series}
          onClose={handleClosePlayer} 
        />
      )}
      
      {seriesForEpisodeSelection && (
        <EpisodeSelector
          series={seriesForEpisodeSelection}
          onClose={() => setSeriesForEpisodeSelection(null)}
          onPlayEpisode={handleEpisodePlay}
          isUnlocked={unlockedContentIds.includes(seriesForEpisodeSelection.id)}
        />
      )}

      {selectedMovie && (
        <MovieDetailsModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
            onPlay={handleStartMoviePlayback}
            isUnlocked={unlockedContentIds.includes(selectedMovie.id)}
        />
      )}
      
      {isGetTokensModalOpen && (
        <GetTokensModal
            onClose={() => {
                setIsGetTokensModalOpen(false);
                setContentPendingUnlock(null);
            }}
            onTokensUpdated={() => {
                handleTokensUpdated();
                // If user was trying to unlock content, re-check if they have enough now
                if (contentPendingUnlock) {
                    const { item, series } = contentPendingUnlock;
                    const contentToUnlock = (series || item) as ContentItem;
                     if (getTokenBalance() >= (contentToUnlock.tokenCost || Infinity)) {
                        setIsGetTokensModalOpen(false);
                        setContentPendingUnlock(null);
                        // Re-initiate playback, but skip the confirmation dialog this time.
                        handleInitiatePlayback(item, series, true);
                    }
                }
            }}
        />
      )}

      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;
