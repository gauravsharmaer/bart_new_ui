// ChatSidebar.tsx
import React, { useState, useEffect } from "react";
import VerifyMailCard from "../components/ui/VerifyMailCard";
import { getUserChats, chatHistory } from "../Api/CommonApi";

interface HistorySideBarProps {
  onChatSelect: (chatId: string) => void;
}

const HistorySideBar: React.FC<HistorySideBarProps> = ({ onChatSelect }) => {
  const [chatHistory, setChatHistory] = useState<chatHistory[]>([]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const data = await getUserChats();
        setChatHistory(data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, []);
  return (
    <aside className=" bg-white border-r border-gray-200 p-4 flex flex-col justify-between h-screen">
      <div className="overflow-y-auto">
        {chatHistory.map((chat) => (
          <p
            key={chat.id}
            className="text-black opacity-80 cursor-pointer hover:bg-zinc-800 p-2 rounded"
            onClick={() => onChatSelect(chat.id)}
          >
            {chat.name}
          </p>
        ))}
      </div>
      {/* <ul className="list-none p-0 m-0 overflow-y-auto">
        <li className="p-3 text-base text-gray-700 cursor-pointer rounded-lg bg-gray-100 font-bold">
          My password reset
        </li>
        <li className="p-3 text-base text-gray-700 cursor-pointer rounded-lg hover:bg-gray-50">
          How to connect wifi?{" "}
          <span className="float-right text-xs py-1 px-2 rounded-lg bg-purple-100 text-purple-600 font-medium">
            Ticket raised
          </span>
        </li>
        <li className="p-3 text-base text-gray-700 cursor-pointer rounded-lg hover:bg-gray-50">
          Requested new laptop{" "}
          <span className="float-right text-xs py-1 px-2 rounded-lg bg-green-100 text-green-500 font-medium">
            Resolved
          </span>
        </li>
        <li className="p-3 text-base text-gray-700 cursor-pointer rounded-lg hover:bg-gray-50">
          HP Printer Setup Help{" "}
          <span className="float-right text-xs text-orange-500">
            2 days ago
          </span>
        </li>
        <li className="p-3 text-base text-gray-700 cursor-pointer rounded-lg hover:bg-gray-50">
          What is the update on my...{" "}
          <span className="float-right text-xs text-orange-500">
            2 days ago
          </span>
        </li>
      </ul> */}
      <div className="mt-auto w-full">
        <VerifyMailCard />
      </div>
    </aside>
  );
};

export default HistorySideBar;
