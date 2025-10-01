import React, { useState, useEffect } from 'react';
import type { TokenPackage } from '../types';

import CloseIcon from './icons/CloseIcon';
import CoinIcon from './icons/CoinIcon';
import CreditCardIcon from './icons/CreditCardIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface CheckoutModalProps {
    tokenPackage: TokenPackage;
    onClose: () => void;
    onSuccess: (amount: number) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ tokenPackage, onClose, onSuccess }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (isProcessing || isSuccess) return;
        
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
        }, 2000); // Simulate 2s processing time
    };
    
    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                onSuccess(tokenPackage.amount);
            }, 1500); // Wait 1.5s on success screen before closing
            return () => clearTimeout(timer);
        }
    }, [isSuccess, onSuccess, tokenPackage.amount]);
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-[120] flex items-center justify-center p-4" onClick={onClose}>
             <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-lg font-semibold">Complete Your Purchase</h2>
                    <button onClick={onClose} className="hover:text-red-500"><CloseIcon /></button>
                </div>

                <div className="p-6">
                    {isSuccess ? (
                        <div className="text-center py-8 flex flex-col items-center justify-center">
                            <CheckCircleIcon className="text-green-500 w-16 h-16 mb-4" />
                            <h3 className="text-2xl font-bold">Payment Successful!</h3>
                            <p className="text-gray-400 mt-2">{tokenPackage.amount} tokens have been added to your account.</p>
                        </div>
                    ) : (
                    <>
                        <div className="bg-gray-700 p-4 rounded-lg mb-6 text-center">
                            <p className="text-gray-300">You are purchasing:</p>
                            <div className="flex items-center justify-center text-yellow-400 my-2">
                                <CoinIcon />
                                <span className="text-3xl font-bold ml-2">{tokenPackage.amount} Tokens</span>
                            </div>
                            <p className="text-2xl font-bold text-white">Total: {tokenPackage.price}</p>
                        </div>
                        
                        <form onSubmit={handlePayment}>
                            <div className="space-y-4">
                                <div className="relative">
                                    <label htmlFor="card-number" className="sr-only">Card Number</label>
                                    <input type="text" id="card-number" placeholder="Card Number" defaultValue="4242 4242 4242 4242" readOnly className="w-full p-3 bg-gray-600 rounded pl-10 border border-gray-500 focus:ring-red-500 focus:border-red-500" />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <CreditCardIcon />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="expiry" className="sr-only">Expiry Date</label>
                                        <input type="text" id="expiry" placeholder="MM / YY" defaultValue="12 / 28" readOnly className="w-full p-3 bg-gray-600 rounded border border-gray-500 focus:ring-red-500 focus:border-red-500" />
                                    </div>
                                    <div>
                                        <label htmlFor="cvc" className="sr-only">CVC</label>
                                        <input type="text" id="cvc" placeholder="CVC" defaultValue="123" readOnly className="w-full p-3 bg-gray-600 rounded border border-gray-500 focus:ring-red-500 focus:border-red-500" />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 text-center">This is a simulated checkout process. No real payment will be made.</p>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={isProcessing}
                                className="mt-6 w-full py-3 px-4 bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-500 flex items-center justify-center font-bold"
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : `Pay ${tokenPackage.price}`}
                            </button>
                        </form>
                    </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;