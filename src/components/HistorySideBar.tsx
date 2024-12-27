import React, { useState, useEffect } from "react";
import { getUserChats, deleteChat } from "../Api/CommonApi";

// Add this interface definition
interface ChatHistory {
  id: string;
  name: string;
  isActive?: boolean;
}

interface HistorySideBarProps {
  onChatSelect: (chatId: string) => void;
}

const HistorySideBar: React.FC<HistorySideBarProps> = ({ onChatSelect }) => {
  const [chatHistory, setChatHistory] = useState<
    (ChatHistory & { status?: string; timestamp?: string })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const deleteChatHandler = async (chatId: string) => {
    try {
      const data = await deleteChat(chatId);
      setChatHistory(data);
      console.log(data);
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const data = await getUserChats();

        // Add "days ago" timestamps with controlled repetition
        let dayCounter = 1;
        let repetitionCount = Math.floor(Math.random() * 3) + 2;
        let currentRepetition = 0;

        const updatedData = data.map((chat, index) => {
          let timestamp = `${dayCounter} day${dayCounter > 1 ? "s" : ""} ago`;

          if (currentRepetition >= repetitionCount) {
            dayCounter++;
            currentRepetition = 0;
            repetitionCount = Math.floor(Math.random() * 3) + 2;
            timestamp = `${dayCounter} day${dayCounter > 1 ? "s" : ""} ago`;
          }

          currentRepetition++;

          if (index === 0) {
            return {
              ...chat,
              status: "",
            };
          } else if (chat.name.startsWith("Hey") || chat.name.includes("h")) {
            return {
              ...chat,
              status: "Resolved",
            };
          } else if ([1, 2, 5, 6].includes(index)) {
            return { ...chat, status: "Ticket raised" };
          } else {
            return { ...chat, timestamp };
          }
        });

        setChatHistory(updatedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching chat history:", error);
        setIsLoading(false);
      }
    };

    fetchChatHistory();
  }, []);

  if (isLoading) {
    return (
      <aside className="bg-white border-r border-gray-200 p-4 flex flex-col justify-between h-full w-[320px]">
        <div className="flex items-center justify-center h-full">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-purple-600 animate-spin"></div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="bg-white border-r border-gray-200 p-4 flex flex-col justify-between h-full w-[320px]">
      <div
        className="overflow-y-auto"
        style={{
          scrollbarWidth: "none", // Hides scrollbar in Firefox
          msOverflowStyle: "none", // Hides scrollbar in IE and Edge
        }}
      >
        {chatHistory.map((chat) => (
          <div
            key={chat.id}
            className={`text-black opacity-150 cursor-pointer p-2 rounded font-regular flex items-center justify-between ${
              chat.isActive ? "shadow-md bg-[#f3f5f9]" : "hover:bg-[#f3f5f9]"
            }`}
          >
            <span
              onClick={() => onChatSelect(chat.id)}
              className="truncate max-w-[140px]" // Add truncation styles
              title={chat.name} // Tooltip to show full text on hover
            >
              {chat.name}
            </span>
            <div className="flex items-center gap-2">
              <span
                onClick={() => deleteChatHandler(chat.id)}
                className="text-red-500 cursor-pointer"
              >
                Delete
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Add status */}
              {chat.status && (
                <span
                  className={`text-xs py-1 px-2 rounded-md font-medium ${
                    chat.status === "Resolved"
                      ? "bg-[#DEF3C1] text-[#385C25]"
                      : "bg-[#ECE4FF] text-[#5232A0]"
                  }`}
                >
                  {chat.status}
                </span>
              )}
              {/* Add timestamp */}
              {chat.timestamp && (
                <span className="text-xs text-[#FF5600]">{chat.timestamp}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Uncomment the below section if VerifyMailCard is needed */}
      {/* <div className="mt-auto w-full">
        <VerifyMailCard />
      </div> */}
    </aside>
  );
};

export default HistorySideBar;
