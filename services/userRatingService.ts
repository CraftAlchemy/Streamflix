import type { UserRatingData, UserComment } from '../types';

const STORAGE_KEY = 'userContentData';

// Helper function to get all data from localStorage
const getAllData = (): Record<string, UserRatingData> => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.error("Error reading from localStorage", error);
        return {};
    }
};

// Helper function to save all data to localStorage
const saveAllData = (data: Record<string, UserRatingData>): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error("Error writing to localStorage", error);
    }
};

export const getDataForContent = (contentId: string): UserRatingData | undefined => {
    const allData = getAllData();
    return allData[contentId];
};

export const saveRating = (contentId: string, rating: number): void => {
    if (rating < 1 || rating > 5) {
        console.error("Invalid rating value");
        return;
    }
    const allData = getAllData();
    if (!allData[contentId]) {
        allData[contentId] = { rating: 0, comments: [] };
    }
    allData[contentId].rating = rating;
    saveAllData(allData);
};

export const addComment = (contentId: string, commentText: string): void => {
    if (!commentText.trim()) return;

    const allData = getAllData();
    if (!allData[contentId]) {
        allData[contentId] = { rating: 0, comments: [] };
    }
    
    const newComment: UserComment = {
        id: `comment-${Date.now()}`,
        author: 'User', // Static author for now
        text: commentText,
        timestamp: Date.now(),
    };

    allData[contentId].comments.unshift(newComment); // Add to the beginning
    saveAllData(allData);
};
