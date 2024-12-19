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
    <form onSubmit={handleSubmit} className="relative bottom-20">
      <div className="flex items-center p-[5px_6px] bg-[#f5f5f5] rounded-[20px] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        <div className="w-9 h-9 flex justify-center items-center rounded-full cursor-pointer ">
          <div
            className="w-[18px] h-[18px] bg-contain bg-no-repeat bg-center"
            style={{ backgroundImage: `url(${plusIcon})` }}
          ></div>
        </div>
        <input
          type="text"
          placeholder="Type a message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 h-10 px-2 text-base border-none rounded-[20px] bg-[#f5f5f5] outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-9 h-9 flex justify-center items-center rounded-full cursor-pointer m-0"
        >
          <div
            className="w-[18px] h-[18px] bg-contain bg-no-repeat bg-center"
            style={{ backgroundImage: `url(${arrowIcon})` }}
          ></div>
        </button>
      </div>
    </form>
  );
};

export default ChatInputBar;
