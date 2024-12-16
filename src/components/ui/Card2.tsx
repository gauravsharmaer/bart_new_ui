import React, { useState } from 'react';

const Card2 = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const options = ['Email Verification', 'Face Recognition'];

  return (
  
    <div className="flex gap-2 "
      style={{ gap: '10px' }} // For better spacing control in smaller screens
    >
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleClick(index)}
          className={`px-5 py-3 rounded-md transition-all duration-200 ease-in-out ${
            activeIndex === index
              ? 'bg-orange-500 text-white'
              : 'bg-white border border-gray-300 hover:bg-gray-100'
          }`}
          style={{
            flex: '1 1 120px', // Flex-grow and flex-shrink properties
            minWidth: '120px', // Minimum width for buttons
            maxWidth: '250px', // Maximum width to prevent buttons from being too large
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default Card2;
