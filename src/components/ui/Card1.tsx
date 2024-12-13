import React, { useState } from 'react';

const Card1 = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const options = ["Email", "Employee Portal", "HR Management", "Project Management Tools", "Other"];

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        justifyContent: 'center', // Center buttons for larger screens
      }}
    >
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleClick(index)}
          style={{
            padding: '3px 5px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            backgroundColor: activeIndex === index ? 'orange' : 'white',
            cursor: 'pointer',
            flex: '1 1 120px', // Allow the buttons to be flexible
            minWidth: '120px', // Ensure buttons don't get too small
            maxWidth: '200px', // Prevent buttons from becoming too large
            textAlign: 'center', // Center text
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default Card1;
