import type { VideoAd, SeriesAd } from '../types';

// --- Pre-Roll Ads ---
let preRollAds: VideoAd[] = [
    {
        id: 'preroll-1',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        linkUrl: '#',
        duration: 15,
        title: 'Visit our sponsors!',
        skipDelay: 5,
    },
];

export const getPreRollAds = (): VideoAd[] => [...preRollAds];
export const getPreRollAd = (): VideoAd | null => {
    if (preRollAds.length === 0) return null;
    // Serve ads in the configured order, not randomly.
    return { ...preRollAds[0] }; // For simplicity, always takes the first. A real system might track views.
};
export const addPreRollAd = (ad: Omit<VideoAd, 'id'>) => {
    preRollAds.push({ ...ad, id: `preroll-${Date.now()}`});
};
export const updatePreRollAd = (updatedAd: VideoAd) => {
    const index = preRollAds.findIndex(ad => ad.id === updatedAd.id);
    if (index !== -1) preRollAds[index] = updatedAd;
};
export const deletePreRollAd = (id: string) => {
    preRollAds = preRollAds.filter(ad => ad.id !== id);
};
export const reorderPreRollAds = (startIndex: number, endIndex: number) => {
    if (startIndex < 0 || startIndex >= preRollAds.length || endIndex < 0 || endIndex >= preRollAds.length) return;
    const result = Array.from(preRollAds);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    preRollAds = result;
};


// --- Mid-Roll Ads ---
let midRollAds: VideoAd[] = [
    {
        id: 'midroll-1',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        linkUrl: '#',
        duration: 10,
        title: 'A message from our partners',
        skipDelay: 5,
        cuePoint: 30, // Show at 30 seconds
    },
    {
        id: 'midroll-2',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        linkUrl: '#',
        duration: 15,
        title: 'Enjoying the show?',
        skipDelay: 10,
        cuePoint: 90, // Show at 90 seconds
    },
];

export const getMidRollAds = (): VideoAd[] => [...midRollAds];
export const addMidRollAd = (ad: Omit<VideoAd, 'id'>) => {
    midRollAds.push({ ...ad, id: `midroll-${Date.now()}`});
};
export const updateMidRollAd = (updatedAd: VideoAd) => {
    const index = midRollAds.findIndex(ad => ad.id === updatedAd.id);
    if (index !== -1) midRollAds[index] = updatedAd;
};
export const deleteMidRollAd = (id: string) => {
    midRollAds = midRollAds.filter(ad => ad.id !== id);
};
export const reorderMidRollAds = (startIndex: number, endIndex: number) => {
    if (startIndex < 0 || startIndex >= midRollAds.length || endIndex < 0 || endIndex >= midRollAds.length) return;
    const result = Array.from(midRollAds);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    midRollAds = result;
};


// --- Post-Roll Ads ---
let postRollAds: VideoAd[] = [
    {
        id: 'postroll-1',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        linkUrl: '#',
        duration: 12,
        title: 'Thanks for watching!',
        skipDelay: 5,
    },
];

export const getPostRollAds = (): VideoAd[] => [...postRollAds];
export const getPostRollAd = (): VideoAd | null => {
    if (postRollAds.length === 0) return null;
    // Serve ads in the configured order.
    return { ...postRollAds[0] };
};
export const addPostRollAd = (ad: Omit<VideoAd, 'id'>) => {
    postRollAds.push({ ...ad, id: `postroll-${Date.now()}`});
};
export const updatePostRollAd = (updatedAd: VideoAd) => {
    const index = postRollAds.findIndex(ad => ad.id === updatedAd.id);
    if (index !== -1) postRollAds[index] = updatedAd;
};
export const deletePostRollAd = (id: string) => {
    postRollAds = postRollAds.filter(ad => ad.id !== id);
};
export const reorderPostRollAds = (startIndex: number, endIndex: number) => {
    if (startIndex < 0 || startIndex >= postRollAds.length || endIndex < 0 || endIndex >= postRollAds.length) return;
    const result = Array.from(postRollAds);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    postRollAds = result;
};

// --- Token Reward Ads ---
let tokenRewardAds: VideoAd[] = [
    {
        id: 'token-ad-1',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        linkUrl: '#',
        duration: 10,
        title: 'Watch and Earn!',
        skipDelay: 10,
        tokenReward: 5,
        isActive: true,
    },
    {
        id: 'token-ad-2',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        linkUrl: '#',
        duration: 15,
        title: 'Get More Tokens',
        skipDelay: 15,
        tokenReward: 10,
        isActive: true,
    }
];

export const getTokenRewardAds = (): VideoAd[] => {
    // Treat ads without `isActive` property as active for backward compatibility
    return [...tokenRewardAds.filter(ad => ad.isActive !== false)];
};
export const addTokenRewardAd = (ad: Omit<VideoAd, 'id'>) => {
    tokenRewardAds.push({ ...ad, id: `token-ad-${Date.now()}`});
};
export const updateTokenRewardAd = (updatedAd: VideoAd) => {
    const index = tokenRewardAds.findIndex(ad => ad.id === updatedAd.id);
    if (index !== -1) tokenRewardAds[index] = updatedAd;
};
export const deleteTokenRewardAd = (id: string) => {
    tokenRewardAds = tokenRewardAds.filter(ad => ad.id !== id);
};
export const reorderTokenRewardAds = (startIndex: number, endIndex: number) => {
    if (startIndex < 0 || startIndex >= tokenRewardAds.length || endIndex < 0 || endIndex >= tokenRewardAds.length) return;
    const result = Array.from(tokenRewardAds);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    tokenRewardAds = result;
};


// --- Series-Specific Pre-Roll Ads ---
let seriesAds: SeriesAd[] = [];

export const getSeriesAds = (): SeriesAd[] => [...seriesAds];

export const addSeriesAd = (seriesId: string, seriesTitle: string, adId: string) => {
    // Prevent assigning the same ad to the same series multiple times
    // Or assigning multiple ads to the same series. A series can only have one assigned ad.
    if (seriesAds.some(sa => sa.seriesId === seriesId)) {
        console.warn(`Series ${seriesId} already has an ad assigned.`);
        return;
    }
    seriesAds.push({
        id: `seriesad-${Date.now()}`,
        seriesId,
        seriesTitle,
        adId
    });
};

export const deleteSeriesAd = (id: string) => {
    seriesAds = seriesAds.filter(sa => sa.id !== id);
};

export const getAdForSeries = (seriesId: string): VideoAd | null => {
    const seriesAdLink = seriesAds.find(sa => sa.seriesId === seriesId);
    if (!seriesAdLink) {
        return null;
    }
    const ad = preRollAds.find(ad => ad.id === seriesAdLink.adId);
    return ad ? { ...ad } : null;
};