import React from 'react';
import type { BannerAd as BannerAdType } from '../types';

interface BannerAdProps {
    ad: BannerAdType;
}

const BannerAd: React.FC<BannerAdProps> = ({ ad }) => {
    return (
        <div className="my-8 rounded-lg overflow-hidden shadow-lg">
            <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer">
                <img 
                    src={ad.imageUrl}
                    alt={ad.altText}
                    className="w-full h-auto object-cover"
                />
            </a>
        </div>
    );
};

export default BannerAd;
