const UNLOCKED_KEY = 'unlockedContentIds';

export const getUnlockedContent = (): string[] => {
    try {
        const unlocked = localStorage.getItem(UNLOCKED_KEY);
        return unlocked ? JSON.parse(unlocked) : [];
    } catch (error) {
        console.error("Error reading unlocked content from localStorage", error);
        return [];
    }
};

export const isUnlocked = (contentId: string): boolean => {
    const unlocked = getUnlockedContent();
    return unlocked.includes(contentId);
};

export const unlockContent = (contentId: string): void => {
    try {
        const unlocked = getUnlockedContent();
        if (!unlocked.includes(contentId)) {
            unlocked.push(contentId);
            localStorage.setItem(UNLOCKED_KEY, JSON.stringify(unlocked));
        }
    } catch (error) {
        console.error("Error writing unlocked content to localStorage", error);
    }
};
