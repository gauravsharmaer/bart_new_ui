import { useState, useEffect } from "react";
import { getUserChats, deleteChat } from "../Api/CommonApi";
import DeleteChatModal from "./DeleteChatModal";
import DeleteIcon from "../assets/delete.svg";
import Arrow from "../assets/ArrowLeft.svg";
import SearchIcon from "../assets/search.svg";
import DeleteAllChatsModal from "./DeleteAllChatsModal";
import { ChatHistory } from "../Interface/Interface";

const ChatHistorySidebar = ({ onClose }: { onClose: () => void }) => {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatToDelete, setChatToDelete] = useState<ChatHistory | null>(null);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false); // State for delete all modal

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const data = await getUserChats();

        let dayCounter = 1;
        let repetitionCount = Math.floor(Math.random() * 3) + 2;
        let currentRepetition = 0;

        const updatedData = data.map((chat: ChatHistory, index: number) => {
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

  const handleDeleteClick = (chat: ChatHistory) => {
    setChatToDelete(chat);
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

  // const handleDeleteAll = () => {
  //   setIsDeleteAllModalOpen(true); // Open the "Delete All" modal
  // };

  const handleConfirmDeleteAll = async () => {
    try {
      // Replace with your API call to delete all chats if available
      for (const chat of chatHistory) {
        await deleteChat(chat.id);
      }
      setChatHistory([]); // Clear chat history in state
      setIsDeleteAllModalOpen(false); // Close the modal
    } catch (error) {
      console.error("Error deleting all chats:", error);
    }
  };

  const filteredChats = chatHistory.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed right-0 top-0 h-full w-[630px] bg-white dark:bg-[#1a1b1e] shadow-lg dark:shadow-[#1a1b1e] z-50 flex flex-col rounded-3xl transition-colors duration-200">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start">
          <button onClick={onClose} className="mr-3 p-2">
            <img
              src={Arrow}
              alt="Arrow Left"
              className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1"
            />
          </button>
          <div className="mt-2">
            <h1 className="text-lg font-semibold mt-0 ml-[-15px] text-gray-900 dark:text-white">
              Chat History
            </h1>
            <p className="text-sm text-gray-500 dark:text-white/70 mt-1 ml-[-40px] transition-colors duration-200">
              Start with our most-used template for work and life.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative p-2 rounded-lg">
          <img
            src={SearchIcon}
            alt="Search"
            className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
          />
          <input
            type="text"
            placeholder="Search chat"
            className="w-full h-[50px] pl-10 pr-4 py-2.5 rounded-lg bg-[#F3F5F9] dark:bg-[#2c2d32] 
            placeholder-[#000000] dark:placeholder-white/70 text-gray-900 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-500 transition-colors duration-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 rounded-full border-4 border-gray-200  border-t-purple-600 animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Header */}
            <div className="w-full bg-[#FAFAFA] dark:bg-[#2c2d32] border-b border-[#EBEBEB] dark:border-[#3a3b40] transition-colors duration-200">
              <div className="flex py-2 px-8">
                <div className="w-1/3 text-base text-gray-900 dark:text-white">Chat</div>
                <div className="w-1/3 text-base text-center text-gray-900 dark:text-white">Status</div>
                <div className="w-1/4 text-base text-center text-gray-900 dark:text-white">Date created</div>
                <div className="w-12"></div>
              </div>
            </div>

            {/* List Items */}
            <div className="flex flex-col">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-center py-2 px-8 border-b border-[#EBEBEB] dark:border-[#3a3b40] w-full 
                  hover:bg-gray-50 dark:hover:bg-[#2c2d32] transition-colors duration-200"
                >
                  <div className="w-1/3">
                    <div className="truncate text-sm pr-4 text-gray-900 dark:text-white" title={chat.name}>
                      {chat.name}
                    </div>
                  </div>
                  <div className="w-1/3 flex justify-center">
                    {chat.status && (
                      <span
                        className={`px-2 py-1 rounded-md text-sm ${
                          chat.status === "Resolved"
                            ? "text-[#27B452] dark:text-green-400"
                            : "text-[#9039FF] dark:text-purple-400"
                        } transition-colors duration-200`}
                      >
                        {chat.status}
                      </span>
                    )}
                  </div>
                  <div className="w-1/4 text-sm text-gray-500 dark:text-white/70 text-center transition-colors duration-200">
                    {chat.timestamp || "-"}
                  </div>
                  <div className="w-12 flex justify-end">
                    <button
                      className="p-2 hover:bg-gray-100 dark:hover:bg-[#3a3b40] rounded-full transition-colors duration-200"
                      onClick={() => handleDeleteClick(chat)}
                    >
                      <img
                        src={DeleteIcon}
                        alt="Delete"
                        className="w-4 h-4 text-gray-400 dark:text-gray-500"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {/* <div className="p-4 border-t border-[#EBEBEB]">
        <button className="text-red-600 font-medium" onClick={handleDeleteAll}>
          Delete all
        </button>
      </div> */}

      {/* Delete Modal */}
      {chatToDelete && (
        <DeleteChatModal
          chatName={chatToDelete.name}
          chatId={chatToDelete.id}
          onCancel={() => setChatToDelete(null)}
          onDelete={handleDeleteConfirm}
        />
      )}

      {isDeleteAllModalOpen && (
        <DeleteAllChatsModal
          onCancel={() => setIsDeleteAllModalOpen(false)}
          onDelete={handleConfirmDeleteAll}
        />
      )}
    </div>
  );
};

export default ChatHistorySidebar;
