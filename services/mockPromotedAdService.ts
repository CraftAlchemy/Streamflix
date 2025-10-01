import type { PromotedContentAd } from '../types';

let promotedAds: PromotedContentAd[] = [
    {
      id: 'promo-1',
      title: 'Galaxy Explorer VR',
      description: 'Experience the universe like never before. The most immersive VR headset is here. Pre-order now!',
      imageUrl: 'https://picsum.photos/id/1056/400/600',
      trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      genres: ['Technology', 'Gaming'],
      linkUrl: '#',
      isAd: true,
    },
    {
      id: 'promo-2',
      title: 'Gourmet Delivered',
      description: 'Tired of cooking? Get chef-prepared meals delivered to your door. First week is 50% off!',
      imageUrl: 'https://picsum.photos/id/1060/400/600',
      trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      genres: ['Food', 'Lifestyle'],
      linkUrl: '#',
      isAd: true,
    },
];

export const getPromotedAds = (): PromotedContentAd[] => {
    return [...promotedAds];
};

export const addPromotedAd = (ad: Omit<PromotedContentAd, 'id' | 'isAd'>): PromotedContentAd => {
    const newAd: PromotedContentAd = {
        ...ad,
        id: `promo-${Date.now()}`,
        isAd: true,
    };
    promotedAds.push(newAd);
    return newAd;
}

export const updatePromotedAd = (updatedAd: PromotedContentAd): PromotedContentAd | null => {
    const adIndex = promotedAds.findIndex(ad => ad.id === updatedAd.id);
    if (adIndex > -1) {
        promotedAds[adIndex] = updatedAd;
        return updatedAd;
    }
    return null;
}

export const deletePromotedAd = (adId: string): boolean => {
    const initialLength = promotedAds.length;
    promotedAds = promotedAds.filter(ad => ad.id !== adId);
    return promotedAds.length < initialLength;
}