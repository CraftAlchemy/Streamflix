const MY_LIST_KEY = 'myContentList';

export const getMyList = (): string[] => {
    try {
        const listJson = localStorage.getItem(MY_LIST_KEY);
        return listJson ? JSON.parse(listJson) : [];
    } catch (error) {
        console.error("Error reading 'My List' from localStorage", error);
        return [];
    }
};

const saveMyList = (list: string[]): void => {
    try {
        localStorage.setItem(MY_LIST_KEY, JSON.stringify(list));
    } catch (error) {
        console.error("Error writing 'My List' to localStorage", error);
    }
};

export const toggleMyList = (contentId: string): string[] => {
    const currentList = getMyList();
    const itemIndex = currentList.indexOf(contentId);

    if (itemIndex > -1) {
        // Item exists, remove it
        currentList.splice(itemIndex, 1);
    } else {
        // Item doesn't exist, add it
        currentList.push(contentId);
    }
    
    saveMyList(currentList);
    return currentList;
};
