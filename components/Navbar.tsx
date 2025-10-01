import React, { useState, useEffect } from 'react';
import SearchIcon from './icons/SearchIcon';
import MenuIcon from './icons/MenuIcon';
import AdminIcon from './icons/AdminIcon';
import CoinIcon from './icons/CoinIcon';
import MobileMenu from './MobileMenu';
import type { User } from '../types';

interface NavbarProps {
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

export const navLinks = ['Home', 'TV Shows', 'Movies', 'My List', 'Premium', 'New & Popular'];

const Navbar: React.FC<NavbarProps> = (props) => {
  const { onAdminClick, onNavClick, activeCategory, tokenBalance, onGetTokensClick, currentUser, onLoginClick, onLogout, onSearch } = props;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
  }, [isMobileMenuOpen]);

  const handleLogoutClick = () => {
    setIsProfileOpen(false);
    onLogout();
  }
  
  const handleProfileNavClick = (category: string) => {
    setIsProfileOpen(false);
    onNavClick(category);
  }
  
  const handleAdminClick = () => {
    setIsProfileOpen(false);
    onAdminClick();
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setSearchQuery(''); // Clear input after search
  };


  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isScrolled || isMobileMenuOpen ? 'bg-gray-900' : 'bg-transparent'}`}
      >
        <div className="container mx-auto px-4 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button onClick={() => onNavClick('Home')} className="text-2xl font-bold text-red-600">STREAMFLIX</button>
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map(link => (
                <button
                  key={link}
                  onClick={() => onNavClick(link)}
                  className={`transition-colors text-sm font-medium ${activeCategory === link ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  {link}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
              <input 
                type="text" 
                placeholder="Search titles, descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-md py-1.5 pl-8 pr-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
            </form>
            {currentUser && (
              <div className="hidden md:flex items-center space-x-2 bg-gray-800 px-3 py-1.5 rounded-full">
                  <CoinIcon />
                  <span className="font-semibold text-sm">{tokenBalance}</span>
                  <button onClick={onGetTokensClick} className="bg-green-600 hover:bg-green-700 w-5 h-5 rounded-full text-white flex items-center justify-center font-bold text-lg leading-none pb-0.5" title="Get More Tokens">+</button>
              </div>
            )}
            
            <div className="hidden md:flex items-center space-x-4">
              {currentUser ? (
                <div className="relative">
                  <button onClick={() => setIsProfileOpen(prev => !prev)} className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-sm">
                      {currentUser.name.charAt(0)}
                    </div>
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-md shadow-lg z-50 border border-gray-700">
                        <div className="p-3 border-b border-gray-700">
                           <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-lg">
                                    {currentUser.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-white">{currentUser.name}</p>
                                    <p className="text-xs text-gray-400 capitalize">{currentUser.role} Account</p>
                                </div>
                            </div>
                        </div>
                        <div className="py-2">
                            <a href="#" onClick={(e) => { e.preventDefault(); handleProfileNavClick('Account'); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Account</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); handleProfileNavClick('My List'); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">My List</a>
                             <a href="#" onClick={(e) => { e.preventDefault(); handleProfileNavClick('Help Center'); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Help Center</a>
                             {currentUser.role === 'admin' && (
                                <button 
                                onClick={handleAdminClick}
                                className="w-full flex items-center text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                aria-label="Open Admin Panel"
                                >
                                <AdminIcon />
                                <span className="ml-2">Admin Panel</span>
                                </button>
                            )}
                        </div>
                        <div className="py-2 border-t border-gray-700">
                            <button
                                onClick={handleLogoutClick}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="bg-red-600 text-white font-bold text-sm py-1.5 px-4 rounded hover:bg-red-700 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>

            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-white">
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} {...props} />
    </>
  );
};

export default Navbar;
