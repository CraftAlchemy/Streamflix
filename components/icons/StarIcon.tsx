import React from 'react';

interface StarIconProps {
  filled: boolean;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const StarIcon: React.FC<StarIconProps> = ({ filled, className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-6 w-6 cursor-pointer ${className} ${filled ? 'text-yellow-400' : 'text-gray-500'}`}
    fill="currentColor"
    viewBox="0 0 24 24"
    stroke="none"
    {...props}
  >
    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 18.896l-7.416 4.517 1.48-8.279-6.064-5.828 8.332-1.151L12 .587z" />
  </svg>
);

export default StarIcon;
