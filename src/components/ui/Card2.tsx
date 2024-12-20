import { useState } from "react";

const Card2 = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const options = ["Email Verification", "Face Recognition"];

  return (
    <div className="flex gap-4 mt-4">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleClick(index)}
          className={`px-5 py-3 rounded-md ${
            activeIndex === index
              ? "bg-orange-500 text-white"
              : "bg-white border border-gray-300 hover:bg-gray-100"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
export default Card2;
