import React, { useState, useEffect } from "react";
import { getUserChats } from "../Api/CommonApi";

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

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const data = await getUserChats();

        // Add "days ago" timestamps with controlled repetition
        let dayCounter = 1;
        let repetitionCount = Math.floor(Math.random() * 3) + 2; // Random repetitions (2-4 times)
        let currentRepetition = 0;

        const updatedData = data.map((chat, index) => {
          let timestamp = `${dayCounter} day${dayCounter > 1 ? "s" : ""} ago`;

          // Increment the dayCounter and reset repetitions when limit is reached
          if (currentRepetition >= repetitionCount) {
            dayCounter++;
            currentRepetition = 0;
            repetitionCount = Math.floor(Math.random() * 3) + 2; // New random repetition
            timestamp = `${dayCounter} day${dayCounter > 1 ? "s" : ""} ago`;
          }

          currentRepetition++;

          if (index === 0) {
            return {
              ...chat,
              status: "", // First current chat will have blank status
            };
          } else if (chat.name.startsWith("Hey") || chat.name.includes("h")) {
            return {
              ...chat,
              status: "Resolved", // Add "Resolved" for other chats starting with "Hey" or containing "h"
            };
          } else if ([1, 2, 5, 6].includes(index)) {
            return { ...chat, status: "Ticket raised" }; // Specific indices get "Ticket raised"
          } else {
            return { ...chat, timestamp }; // Assign calculated timestamp
          }
        });

        setChatHistory(updatedData);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, []);

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
