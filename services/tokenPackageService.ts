import type { TokenPackage } from '../types';

let tokenPackages: TokenPackage[] = [
    { id: 'pkg-1', amount: 50, price: '$4.99' },
    { id: 'pkg-2', amount: 100, price: '$8.99' },
    { id: 'pkg-3', amount: 250, price: '$19.99' },
];

export const getTokenPackages = (): TokenPackage[] => {
    return [...tokenPackages];
};

export const addTokenPackage = (pkg: Omit<TokenPackage, 'id'>): void => {
    tokenPackages.push({ ...pkg, id: `pkg-${Date.now()}` });
};

export const updateTokenPackage = (updatedPkg: TokenPackage): void => {
    const index = tokenPackages.findIndex(p => p.id === updatedPkg.id);
    if (index !== -1) {
        tokenPackages[index] = updatedPkg;
    }
};

export const deleteTokenPackage = (id: string): void => {
    tokenPackages = tokenPackages.filter(p => p.id !== id);
};
