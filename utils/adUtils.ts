import type { ContentCategory, PromotedContentAd, ContentGridItem } from '../types';

/**
 * A type guard to check if an item is a PromotedContentAd.
 * @param item The item to check.
 * @returns True if the item is a PromotedContentAd.
 */
function isPromotedAd(item: ContentGridItem): item is PromotedContentAd {
  return (item as PromotedContentAd).isAd === true;
}

/**
 * Interleaves promoted content ads into a list of content categories.
 * This function avoids placing ads in predictable positions by using a frequency-based approach.
 *
 * @param contentCategories The original list of content categories.
 * @param ads The list of promoted ads to be interleaved.
 * @returns A new list of content categories with ads mixed in.
 */
export const interleaveAdsInContent = (
  contentCategories: ContentCategory[],
  ads: PromotedContentAd[]
): ContentCategory[] => {
  if (!ads.length || !contentCategories.length) {
    return contentCategories;
  }

  const AD_START_POSITION = 2; // Don't place an ad before this index in a row.
  const AD_FREQUENCY = 5;      // Place an ad roughly every 5 content items.
  let adCycleIndex = 0;        // To cycle through the available ads.

  return contentCategories.map(category => {
    // Ensure we are working with a clean list of content, in case this function is run multiple times.
    const originalContentItems = category.items.filter(item => !isPromotedAd(item));

    if (originalContentItems.length <= AD_START_POSITION) {
      return category; // Category is too short to place an ad.
    }

    const newItemsWithAds: ContentGridItem[] = [];
    let itemsSinceLastAd = 0;

    for (let i = 0; i < originalContentItems.length; i++) {
      newItemsWithAds.push(originalContentItems[i]);

      const isPastStartPosition = i >= AD_START_POSITION;
      const isFrequencyMet = itemsSinceLastAd >= AD_FREQUENCY - 1;

      if (isPastStartPosition && isFrequencyMet) {
        const adToInsert = ads[adCycleIndex % ads.length];
        newItemsWithAds.push(adToInsert);
        adCycleIndex++;
        itemsSinceLastAd = 0; // Reset counter.
      } else {
        itemsSinceLastAd++;
      }
    }

    return { ...category, items: newItemsWithAds };
  });
};
