import React from "react";
import plusIcon from "../../assets/plus.png";
import arrowIcon from "../../assets/arrow-up-right.png";

const InputBar: React.FC = () => {
  return (
    <div className="flex items-center p-[5px_6px] bg-[#f5f5f5] rounded-[20px] m-3 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <div className="w-9 h-9 flex justify-center items-center rounded-full cursor-pointer m-0">
        <div
          className="w-[18px] h-[18px] bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${plusIcon})` }}
        ></div>
      </div>
      <input
        className="flex-1 h-10 px-2 text-base border-none rounded-[20px] bg-[#f5f5f5] outline-none"
        type="text"
        placeholder="Type a message"
      />
      <div className="w-9 h-9 flex justify-center items-center rounded-full cursor-pointer m-0">
        <div
          className="w-[18px] h-[18px] bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${arrowIcon})` }}
        ></div>
      </div>
    </div>
  );
};

export default InputBar;
