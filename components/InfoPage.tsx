import React, { useEffect } from 'react';
import { getInfoPageContent } from '../services/infoPageService';
import CloseIcon from './icons/CloseIcon';

interface InfoPageProps {
  page: string;
  onClose: () => void;
}

const InfoPage: React.FC<InfoPageProps> = ({ page, onClose }) => {
  const content = getInfoPageContent(page);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when page view changes
  }, [page]);

  if (!content) {
    return (
      <div className="text-center py-20 mt-28">
        <h2 className="text-2xl font-bold">Page Not Found</h2>
        <button onClick={onClose} className="mt-4 text-red-500 hover:underline">
          Go back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in text-white">
       <style>{`
          @keyframes fade-in {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fade-in 0.5s ease-out; }
       `}</style>
      <div className="relative mb-8">
        <h1 className="text-4xl md:text-5xl font-bold">{content.title}</h1>
        <button 
          onClick={onClose} 
          className="absolute top-0 right-0 text-gray-400 hover:text-white transition-colors"
          aria-label="Close page"
        >
          <CloseIcon />
        </button>
      </div>
      
      <div className="w-full h-48 md:h-64 lg:h-80 rounded-lg overflow-hidden shadow-lg mb-8">
        <img src={content.imageUrl} alt={content.title} className="w-full h-full object-cover" />
      </div>

      <div className="max-w-4xl mx-auto space-y-6 text-gray-300 leading-relaxed whitespace-pre-line">
        {content.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="text-center mt-12">
          <button onClick={onClose} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-transform hover:scale-105">
              Back to Browsing
          </button>
      </div>
    </div>
  );
};

export default InfoPage;
