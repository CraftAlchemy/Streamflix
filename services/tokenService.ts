const TOKEN_KEY = 'userTokenBalance';
const DEFAULT_TOKEN_KEY = 'defaultTokenBalance';

export const getDefaultTokenBalance = (): number => {
    try {
        const balance = localStorage.getItem(DEFAULT_TOKEN_KEY);
        // Default to 100 if not set by admin
        return balance ? parseInt(balance, 10) : 100;
    } catch (error) {
        console.error("Error reading default token balance from localStorage", error);
        return 100;
    }
};

export const setDefaultTokenBalance = (balance: number): void => {
    try {
        localStorage.setItem(DEFAULT_TOKEN_KEY, balance.toString());
    } catch (error) {
        console.error("Error writing default token balance to localStorage", error);
    }
};

export const getTokenBalance = (): number => {
    try {
        const balance = localStorage.getItem(TOKEN_KEY);
        // If user has no balance, give them the admin-defined default
        if (balance === null) {
            const defaultBalance = getDefaultTokenBalance();
            setTokenBalance(defaultBalance);
            return defaultBalance;
        }
        return parseInt(balance, 10);
    } catch (error)
    {
        console.error("Error reading token balance from localStorage", error);
        return getDefaultTokenBalance();
    }
};

export const setTokenBalance = (balance: number): void => {
    try {
        localStorage.setItem(TOKEN_KEY, balance.toString());
    } catch (error) {
        console.error("Error writing token balance to localStorage", error);
    }
};

export const addTokens = (amount: number): void => {
    const currentBalance = getTokenBalance();
    setTokenBalance(currentBalance + amount);
};

export const spendTokens = (amount: number): boolean => {
    const currentBalance = getTokenBalance();
    if (currentBalance >= amount) {
        setTokenBalance(currentBalance - amount);
        return true;
    }
    return false;
};