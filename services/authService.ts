import type { User } from '../types';

const USER_SESSION_KEY = 'currentUser';

const mockUsers: User[] = [
    { id: '1', username: 'admin', name: 'Admin', role: 'admin' },
    { id: '2', username: 'user', name: 'John Doe', role: 'user' },
];

// In a real app, password would be handled securely. Here we just check username.
export const login = (username: string): User | null => {
    const user = mockUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (user) {
        try {
            sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
            return user;
        } catch (error) {
            console.error("Error setting user in sessionStorage", error);
            return null;
        }
    }
    return null;
};

export const logout = (): void => {
    try {
        sessionStorage.removeItem(USER_SESSION_KEY);
    } catch (error) {
        console.error("Error removing user from sessionStorage", error);
    }
};

export const getCurrentUser = (): User | null => {
    try {
        const userJson = sessionStorage.getItem(USER_SESSION_KEY);
        return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
        console.error("Error getting user from sessionStorage", error);
        return null;
    }
};
