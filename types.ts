export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export interface Season {
  id: string;
  seasonNumber: number;
  episodes: Episode[];
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  backdropUrl: string;
  videoUrl: string; // Used for Movies
  trailerUrl: string;
  type: 'Movie' | 'Series';
  genres: string[];
  seasons?: Season[]; // Only for Series
  isPremium?: boolean;
  tokenCost?: number;
}

export interface PromotedContentAd {
  id:string;
  title: string;
  description: string;
  imageUrl: string;
  trailerUrl: string;
  genres: string[];
  linkUrl: string;
  isAd: true;
}

export type ContentGridItem = ContentItem | PromotedContentAd;

export interface ContentCategory {
  title: string;
  items: ContentGridItem[];
}

export interface BannerAd {
  id: string;
  imageUrl: string;
  linkUrl: string;
  altText: string;
}

export interface VideoAd {
  id: string;
  videoUrl: string;
  linkUrl: string;
  duration: number; // in seconds
  title: string;
  skipDelay: number; // in seconds
  cuePoint?: number; // in seconds, for mid-roll ads
  tokenReward?: number; // For token-earning ads
  isActive?: boolean;
}

export interface SeriesAd {
  id: string;
  seriesId: string;
  seriesTitle: string; // For easier display in admin UI
  adId: string;
}

export interface CompanionAd {
  id: string;
  imageUrl: string;
  linkUrl: string;
  altText: string;
}

export interface UserComment {
  id: string;
  author: string;
  text: string;
  timestamp: number;
}

export interface UserRatingData {
  rating: number; // 0-5, 0 means not rated
  comments: UserComment[];
}

export interface TokenPackage {
  id: string;
  amount: number;
  price: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'user';
}

export interface InfoPageContent {
  title: string;
  imageUrl: string;
  content: string[];
}

export interface HeroAdConfig {
  id: string;
  enabled: boolean;
  position: number; // 0-based index
  backdropUrl: string;
  title: string;
  description: string;
  ctaText: string;
  linkUrl: string;
}

export interface HeroAd extends HeroAdConfig {
  isAd: true;
}

export interface HeroConfig {
    contentIds: string[];
    ads: HeroAdConfig[];
}
