import React, { useState } from 'react';

const Card1 = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const options = ["Email", "Employee Portal", "HR Management", "Project Management Tools", "Other"];

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleClick(index)}
          style={{
            padding: '10px 20px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            backgroundColor: activeIndex === index ? 'orange' : 'white',
            cursor: 'pointer',
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default Card1;
