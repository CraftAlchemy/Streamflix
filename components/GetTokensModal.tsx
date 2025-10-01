import React, { useState, useEffect } from 'react';
import type { VideoAd, TokenPackage } from '../types';
import { getTokenRewardAds } from '../services/mockAdService';
import { getTokenPackages } from '../services/tokenPackageService';
import { addTokens } from '../services/tokenService';

import CloseIcon from './icons/CloseIcon';
import CoinIcon from './icons/CoinIcon';
import PlayIcon from './icons/PlayIcon';
import AdPlayer from './AdPlayer';
import CheckoutModal from './CheckoutModal';

interface GetTokensModalProps {
  onClose: () => void;
  onTokensUpdated: () => void;
}

const GetTokensModal: React.FC<GetTokensModalProps> = ({ onClose, onTokensUpdated }) => {
    const [rewardAds, setRewardAds] = useState<VideoAd[]>([]);
    const [tokenPackages, setTokenPackages] = useState<TokenPackage[]>([]);
    const [playingAd, setPlayingAd] = useState<VideoAd | null>(null);
    const [rewardMessage, setRewardMessage] = useState('');
    const [checkoutPackage, setCheckoutPackage] = useState<TokenPackage | null>(null);

    useEffect(() => {
        setRewardAds(getTokenRewardAds());
        setTokenPackages(getTokenPackages());
    }, []);

    useEffect(() => {
        if (rewardMessage) {
            const timer = setTimeout(() => setRewardMessage(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [rewardMessage]);
    
    const handleCheckoutSuccess = (amount: number) => {
        addTokens(amount);
        onTokensUpdated();
        setRewardMessage(`Successfully added ${amount} tokens!`);
        setCheckoutPackage(null);
    };
    
    const handleAdFinish = () => {
        if (playingAd?.tokenReward) {
            const reward = playingAd.tokenReward;
            addTokens(reward);
            onTokensUpdated();
            setRewardMessage(`You earned ${reward} tokens!`);
        }
        setPlayingAd(null);
    };

    if (playingAd) {
        return (
             <div className="fixed inset-0 bg-black bg-opacity-90 z-[120] flex items-center justify-center p-4 animate-fade-in">
                 <style>{`
                    @keyframes fade-in {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    .animate-fade-in { animation: fade-in 0.3s ease-out; }
                 `}</style>
                 <div className="w-full max-w-4xl aspect-video relative">
                    <AdPlayer ad={playingAd} onAdFinish={handleAdFinish} />
                 </div>
            </div>
        )
    }

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-80 z-[110] flex items-center justify-center p-4" onClick={onClose}>
                <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col relative" onClick={e => e.stopPropagation()}>
                    {rewardMessage && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 transform bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg z-30 animate-fade-in-out">
                        <style>{`
                            @keyframes fade-in-out {
                                0% { opacity: 0; transform: translate(-50%, -20px); }
                                20% { opacity: 1; transform: translate(-50%, 0); }
                                80% { opacity: 1; transform: translate(-50%, 0); }
                                100% { opacity: 0; transform: translate(-50%, -20px); }
                            }
                            .animate-fade-in-out { animation: fade-in-out 4s ease-in-out forwards; }
                        `}</style>
                        {rewardMessage}
                    </div>
                    )}
                    
                    <div className="flex justify-between items-center p-4 border-b border-gray-700">
                        <h2 className="text-2xl font-bold">Get More Tokens</h2>
                        <button onClick={onClose} className="hover:text-red-500"><CloseIcon /></button>
                    </div>

                    <div className="p-6 overflow-y-auto space-y-8">
                        {/* Buy Tokens Section */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-white">Buy Tokens</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {tokenPackages.map(pkg => (
                                    <button key={pkg.id} onClick={() => setCheckoutPackage(pkg)} className="bg-gray-800 p-4 rounded-lg text-center hover:bg-gray-700 border border-gray-700 hover:border-red-500 transition-all">
                                        <div className="flex items-center justify-center text-yellow-400 mb-2">
                                            <CoinIcon />
                                            <span className="text-2xl font-bold ml-2">{pkg.amount}</span>
                                        </div>
                                        <p className="text-lg font-semibold text-white">{pkg.price}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Earn Tokens Section */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-white">Earn Free Tokens</h3>
                            <div className="space-y-3">
                                {rewardAds.length > 0 ? rewardAds.map(ad => (
                                    <div key={ad.id} className="bg-gray-800 p-3 rounded-md flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold">{ad.title}</p>
                                            <p className="text-sm text-gray-400">Watch a {ad.duration}s ad to earn {ad.tokenReward} tokens.</p>
                                        </div>
                                        <button onClick={() => setPlayingAd(ad)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center">
                                            <PlayIcon />
                                            <span className="ml-2">Watch</span>
                                        </button>
                                    </div>
                                )) : (
                                    <p className="text-gray-500 text-center">No token reward ads available at the moment.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {checkoutPackage && (
                <CheckoutModal
                    tokenPackage={checkoutPackage}
                    onClose={() => setCheckoutPackage(null)}
                    onSuccess={handleCheckoutSuccess}
                />
            )}
        </>
    );
};

export default GetTokensModal;