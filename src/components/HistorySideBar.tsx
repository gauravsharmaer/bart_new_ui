import React, { useState, useEffect } from "react";
import { getUserChats, deleteChat } from "../Api/CommonApi";
import DeleteChatModal from "./DeleteChatModal";
import DeleteIcon from "../assets/delete.svg";
import RenameIcon from "../assets/rename.svg";
import DotsMenuIcon from "../assets/dots-menu.svg";

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
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [chatToDelete, setChatToDelete] = useState<ChatHistory | null>(null);

  const handleDeleteClick = (chat: ChatHistory) => {
    setChatToDelete(chat);
    setActiveMenu(null);
  };

  const handleDeleteConfirm = async () => {
    if (chatToDelete) {
      try {
        await deleteChat(chatToDelete.id);
        setChatHistory((prevChats) =>
          prevChats.filter((chat) => chat.id !== chatToDelete.id)
        );
        setChatToDelete(null);
      } catch (error) {
        console.error("Error deleting chat:", error);
      }
    }
  };

  const toggleMenu = (chatId: string) => {
    setActiveMenu((prevMenu) => (prevMenu === chatId ? null : chatId));
  };

  const closeMenu = () => {
    setActiveMenu(null);
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
    <>
      <aside className="bg-white border-r border-gray-200 p-4 flex flex-col justify-between h-full w-[320px] pt-7">
        <div
          className="overflow-y-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className={`text-black opacity-150 cursor-pointer p-2 rounded font-regular flex items-center justify-between group ${
                chat.isActive ? "shadow-md bg-[#f3f5f9]" : "hover:bg-[#f3f5f9]"
              }`}
              onMouseLeave={closeMenu} // Close menu on mouse leave
            >
              {/* Left section: Chat details */}
              <div className="flex flex-col flex-grow">
                <span
                  onClick={() => onChatSelect(chat.id)}
                  className="truncate max-w-[140px]"
                  title={chat.name}
                >
                  {chat.name}
                </span>
              </div>

              {/* Right section: Tags */}
              <div className="flex items-center gap-2">
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
                {chat.timestamp && (
                  <span className="text-xs text-[#FF5600]">{chat.timestamp}</span>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => toggleMenu(chat.id)}
                  className="focus:outline-none p-1 rounded-full invisible group-hover:visible"
                >
                  <img
                    src={DotsMenuIcon}
                    alt="Menu"
                    className="w-3.5 h-3.5"
                  />
                </button>
                {activeMenu === chat.id && (
                  <div
                    className="fixed bg-white rounded-lg shadow-lg w-[130px]"
                    style={{
                      boxShadow: "0px 4px 6px rgba(68, 68, 68, 0.1)", 
                      zIndex:9999,
                    }}
                  >
                    <ul className="text-sm">
                      <li
                        onClick={() => console.log("Rename clicked")}
                        className="px-4 py-3 cursor-pointer flex items-center gap-2"
                      >
                        <img src={RenameIcon} alt="Rename" className="w-6 h-6" />
                        Rename
                      </li>
                      <li
                        onClick={() => handleDeleteClick(chat)}
                        className="px-4 py-3 cursor-pointer text-red-600 flex items-center gap-2"
                      >
                        <img src={DeleteIcon} alt="Delete" className="w-6 h-6" />
                        Delete
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </aside>
      {chatToDelete && (
        <DeleteChatModal
          chatName={chatToDelete.name}
          chatId={chatToDelete.id}
          onCancel={() => setChatToDelete(null)}
          onDelete={handleDeleteConfirm}
        />
      )}
    </>
  );
};

export default HistorySideBar;