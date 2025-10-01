import React, { useState } from 'react';
import type { User } from '../types';
import { navLinks } from './Navbar';
import CloseIcon from './icons/CloseIcon';
import SearchIcon from './icons/SearchIcon';
import CoinIcon from './icons/CoinIcon';
import AdminIcon from './icons/AdminIcon';
import UserIcon from './icons/UserIcon';


interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminClick: () => void;
  onNavClick: (category: string) => void;
  activeCategory: string;
  tokenBalance: number;
  onGetTokensClick: () => void;
  currentUser: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onSearch: (query: string) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
    isOpen, 
    onClose,
    onAdminClick,
    onNavClick,
    activeCategory,
    tokenBalance,
    onGetTokensClick,
    currentUser,
    onLoginClick,
    onLogout,
    onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavClick = (category: string) => {
    onNavClick(category);
    onClose();
  }

  const handleAdminClick = () => {
    onAdminClick();
    onClose();
  }

  const handleGetTokensClick = () => {
    onGetTokensClick();
    onClose();
  }
  
  const handleLoginClick = () => {
    onLoginClick();
    onClose();
  }
  
  const handleLogoutClick = () => {
    onLogout();
    onClose();
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setSearchQuery('');
    onClose();
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-70 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-xs bg-gray-900 text-white shadow-lg z-[70] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">Menu</h2>
            <button onClick={onClose} className="hover:text-red-500">
                <CloseIcon />
            </button>
        </div>

        <div className="p-4">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative mb-4">
              <input 
                type="text" 
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
            </form>

            {/* Navigation Links */}
            <nav className="flex flex-col space-y-2 mb-4">
                {navLinks.map(link => (
                <button
                    key={link}
                    onClick={() => handleNavClick(link)}
                    className={`p-2 rounded text-left transition-colors font-medium ${activeCategory === link ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
                >
                    {link}
                </button>
                ))}
            </nav>
            
             <div className="border-t border-gray-700 pt-4">
                 {/* User Profile / Login */}
                 {currentUser ? (
                    <>
                        {/* Token Balance */}
                        <div className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded-lg mb-4">
                            <div className="flex items-center space-x-2">
                                <CoinIcon />
                                <span className="font-semibold text-sm">Your Tokens: {tokenBalance}</span>
                            </div>
                            <button onClick={handleGetTokensClick} className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1 px-3 rounded" title="Get More Tokens">Get More</button>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex items-center space-x-3 p-2">
                                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-lg">
                                    {currentUser.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold">{currentUser.name}</p>
                                    <p className="text-xs text-gray-400 capitalize">{currentUser.role} Account</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleNavClick('Account')}
                                className="w-full flex items-center p-2 rounded text-left transition-colors font-medium text-gray-300 hover:bg-gray-800"
                            >
                                <UserIcon />
                                <span className="ml-2">My Account</span>
                            </button>
                            {currentUser.role === 'admin' && (
                                <button 
                                    onClick={handleAdminClick}
                                    className="w-full flex items-center p-2 rounded text-left transition-colors font-medium text-gray-300 hover:bg-gray-800"
                                >
                                    <AdminIcon />
                                    <span className="ml-2">Admin Panel</span>
                                </button>
                            )}
                            <button
                                onClick={handleLogoutClick}
                                className="w-full p-2 rounded text-left transition-colors font-medium bg-gray-700 hover:bg-gray-600"
                            >
                                Sign Out
                            </button>
                        </div>
                    </>
                 ) : (
                    <button
                        onClick={handleLoginClick}
                        className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition-colors"
                        >
                        Sign In
                    </button>
                 )}
            </div>

        </div>

      </div>
    </>
  );
};

export default MobileMenu;
