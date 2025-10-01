import type { CompanionAd } from '../types';

let companionAds: CompanionAd[] = [
    {
        id: 'companion-1',
        imageUrl: 'https://picsum.photos/id/10/300/250',
        linkUrl: '#',
        altText: 'A stunning photo of a forest path. Explore nature.',
    },
    {
        id: 'companion-2',
        imageUrl: 'https://picsum.photos/id/20/300/250',
        linkUrl: '#',
        altText: 'A high-angle shot of a city street. Discover downtown.',
    },
];

export const getCompanionAds = (): CompanionAd[] => {
    return [...companionAds];
};

export const getCompanionAd = (): CompanionAd | null => {
    if (companionAds.length === 0) return null;
    // For simplicity, always return the first companion ad.
    // A more advanced system could rotate them or match them to video ads.
    return { ...companionAds[0] }; 
}

export const addCompanionAd = (ad: Omit<CompanionAd, 'id'>): CompanionAd => {
    const newAd: CompanionAd = {
        ...ad,
        id: `companion-${Date.now()}`,
    };
    companionAds.push(newAd);
    return newAd;
}

export const updateCompanionAd = (updatedAd: CompanionAd): CompanionAd | null => {
    const adIndex = companionAds.findIndex(ad => ad.id === updatedAd.id);
    if (adIndex > -1) {
        companionAds[adIndex] = updatedAd;
        return updatedAd;
    }
    return null;
}

export const deleteCompanionAd = (adId: string): boolean => {
    const initialLength = companionAds.length;
    companionAds = companionAds.filter(ad => ad.id !== adId);
    return companionAds.length < initialLength;
}
