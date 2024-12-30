import React, { useState, useEffect, useRef } from "react";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "40px"; // Reset height to recalculate
      const scrollHeight = textarea.scrollHeight;

      textarea.style.height = `${Math.min(Math.max(40, scrollHeight), 200)}px`; // Min 40px, Max 200px
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputMessage]);

  const submitMessage = () => {
    if (!inputMessage.trim()) return;
    onSubmit(inputMessage);
    setInputMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage();
  };

  return (
    <form onSubmit={handleSubmit} className="relative mb-5 ">
      <div className="flex items-center p-1 bg-white rounded-[15px] mx-[-15px] mb-10 border border-gray-200">
        <div className="w-14 h-10 flex justify-center items-center bg-[#f9f9f9] shadow-[inset_0_0_1px_rgba(128,128,128,0.5)] rounded-[10px]">
          <div className="relative">
            <img src={plusIcon} alt="Plus" className="w-6 h-6" />
            <div className="absolute top-0 right-0 w-1 h-1 bg-green-500 rounded-full" />
          </div>
        </div>

        <textarea
          ref={textareaRef}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          className="flex-1 min-h-[40px] px-4 text-base border-none bg-transparent outline-none resize-none py-2 overflow-y-auto
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ lineHeight: "1.5" }}
        />

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
