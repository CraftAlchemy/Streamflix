import React, { useState } from 'react';
import { login } from '../services/authService';
import type { User } from '../types';
import CloseIcon from './icons/CloseIcon';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = login(username);
    if (user) {
      onLoginSuccess(user);
    } else {
      setError('Invalid username. Try "admin" or "user".');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-[110] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Sign In</h2>
          <button onClick={onClose} className="hover:text-red-500"><CloseIcon /></button>
        </div>
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={e => {
                setUsername(e.target.value);
                setError('');
              }}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">For this demo, enter "admin" or "user".</p>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-red-600 rounded hover:bg-red-700 disabled:bg-gray-500"
            disabled={!username.trim()}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
