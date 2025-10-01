import React from 'react';
import type { User, ContentItem } from '../types';
import CoinIcon from './icons/CoinIcon';
import ContentCard from './ContentCard'; // Re-using ContentCard for a consistent look

interface AccountPageProps {
  currentUser: User;
  tokenBalance: number;
  unlockedContent: ContentItem[];
  onGetTokensClick: () => void;
  onCardPlay: (item: ContentItem) => void;
  myListIds: string[];
  onToggleMyList: (contentId: string) => void;
  onClose: () => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ 
  currentUser, 
  tokenBalance, 
  unlockedContent, 
  onGetTokensClick, 
  onCardPlay,
  myListIds,
  onToggleMyList,
}) => {

  return (
    <div className="animate-fade-in text-white max-w-5xl mx-auto">
       <style>{`
          @keyframes fade-in {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fade-in 0.5s ease-out; }
       `}</style>

      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold">My Account</h1>
        <p className="text-gray-400 mt-2">Manage your profile, tokens, and unlocked content.</p>
      </div>

      <div className="space-y-10">
        {/* Profile & Tokens Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Info */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Profile</h2>
                <div className="space-y-3">
                    <div>
                        <p className="text-sm text-gray-400">Name</p>
                        <p className="text-lg">{currentUser.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Username</p>
                        <p className="text-lg">{currentUser.username}</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-400">Account Type</p>
                        <p className="text-lg capitalize">{currentUser.role}</p>
                    </div>
                </div>
            </div>

            {/* Token Balance */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Your Tokens</h2>
                    <div className="flex items-center text-yellow-400">
                        <CoinIcon />
                        <span className="text-4xl font-bold ml-3">{tokenBalance}</span>
                    </div>
                     <p className="text-gray-400 mt-2 text-sm">Use tokens to unlock exclusive premium content.</p>
                </div>
                <button 
                    onClick={onGetTokensClick}
                    className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-transform hover:scale-105"
                >
                    Get More Tokens
                </button>
            </div>
        </div>

        {/* Unlocked Content Section */}
        <div>
            <h2 className="text-2xl font-semibold mb-4">Unlocked Content</h2>
            {unlockedContent.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                   {unlockedContent.map(item => (
                        <ContentCard 
                            key={item.id} 
                            item={item} 
                            onPlay={onCardPlay} 
                            unlockedContentIds={[item.id]} // Pass only this ID to show it as unlocked
                            myListIds={myListIds}
                            onToggleMyList={onToggleMyList}
                        />
                   ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-800 rounded-lg">
                    <p className="text-gray-400">You haven't unlocked any premium content yet.</p>
                    <p className="text-sm text-gray-500 mt-1">Unlocked movies and series will appear here.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
