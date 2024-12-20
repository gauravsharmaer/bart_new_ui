import React, { useState } from "react";
import plusIcon from "../assets/plus.png";
import arrowIcon from "../assets/arrow-up-right.png";

interface ChatInputBarProps {
  onSubmit: (message: string) => void;
  loading?: boolean;
}

const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [inputMessage, setInputMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    onSubmit(inputMessage);
    setInputMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative mb-5">
      <div className="flex items-center p-1 bg-white rounded-[15px] shadow-[0_2px_4px_rgba(0,0,0,0.1)] w-[80%] mx-auto mb-10">
        {/* Plus Icon */}
        <div className="w-14 h-10 flex justify-center items-center bg-[#f9f9f9] shadow-[inset_0_0_1px_rgba(128,128,128,0.5)] rounded-[10px]">
          <div className="relative">
            <img src={plusIcon} alt="Plus" className="w-6 h-6" />
            <div className="absolute top-0 right-0 w-1 h-1 bg-green-500 rounded-full" />
          </div>
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 h-10 px-4 text-base border-none bg-transparent outline-none"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-12 h-10 flex justify-center items-center bg-[#f9f9f9] shadow-[inset_0_0_1px_rgba(128,128,128,0.5)] rounded-[10px]"
        >
          <img src={arrowIcon} alt="Submit" className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
};

export default ChatInputBar;
