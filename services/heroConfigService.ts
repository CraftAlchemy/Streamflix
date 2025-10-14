import type { HeroConfig } from '../types';

const HERO_CONFIG_KEY = 'heroConfig';

const getDefaultConfig = (): HeroConfig => ({
  contentIds: ['1', '2', '3', '4', '5'], // Default to the first 5 popular items
  ads: [], // Use an empty array for ads by default
});

export const getHeroConfig = (): HeroConfig => {
    try {
        const configJson = localStorage.getItem(HERO_CONFIG_KEY);
        if (configJson) {
            const parsed = JSON.parse(configJson);
            // Migration logic for old structure (single 'ad' object)
            if (parsed.ad && !parsed.ads) {
                const newConfig: HeroConfig = {
                    contentIds: parsed.contentIds || [],
                    ads: [],
                };
                if (parsed.ad.enabled) {
                    newConfig.ads.push({
                        ...parsed.ad,
                        id: `hero-ad-${Date.now()}` // Generate an ID for the migrated ad
                    });
                }
                saveHeroConfig(newConfig); // Save in new format
                return newConfig;
            }
            // Ensure ads is an array for configs that might have been saved incorrectly
            if (!Array.isArray(parsed.ads)) {
                parsed.ads = [];
            }
            return parsed;
        }
        return getDefaultConfig();
    } catch (error) {
        console.error("Error reading hero config from localStorage", error);
        return getDefaultConfig();
    }
};

export const saveHeroConfig = (config: HeroConfig): void => {
    try {
        localStorage.setItem(HERO_CONFIG_KEY, JSON.stringify(config));
    } catch (error) {
        console.error("Error writing hero config to localStorage", error);
    }
};
