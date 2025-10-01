import React, { useState } from 'react';
import StarIcon from './icons/StarIcon';

interface StarRatingProps {
  rating: number; // Current rating (0-5)
  onRatingChange: (newRating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center" onMouseLeave={() => setHoverRating(0)}>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <StarIcon
            key={starValue}
            filled={starValue <= (hoverRating || rating)}
            onClick={() => onRatingChange(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
