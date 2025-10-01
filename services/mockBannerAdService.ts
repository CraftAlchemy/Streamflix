import type { BannerAd } from '../types';

let bannerAd: BannerAd = {
    id: 'banner-1',
    imageUrl: 'https://picsum.photos/id/1018/1200/200',
    linkUrl: '#',
    altText: 'A beautiful mountain landscape. Advertise with us!',
};

export const getBannerAd = (): BannerAd => {
    return { ...bannerAd };
};

export const updateBannerAd = (updatedAd: Partial<BannerAd>): void => {
    bannerAd = { ...bannerAd, ...updatedAd };
}
