

// import React, { useState } from "react";
// import DeleteChatModal from "./DeleteChatModal";
// import DeleteIcon from "../assets/delete.svg";
// import RenameIcon from "../assets/rename.svg";
// import DotsMenuIcon from "../assets/dots-menu.svg";
// import { ChatHistory } from "../Interface/Interface";
// import { Tooltip } from "@mui/material";
// import SidebarIcon from "../assets/chat.svg";
// import NewChaticon from "../assets/NewChat.svg";
// interface HistorySideBarProps {
//   chatHistory: ChatHistory[];
//   isLoading: boolean;
//   isSidebarOpen: boolean;
//   onToggleSidebar: () => void;
//   onChatSelect: (chatId: string) => void;
//   onDeleteChat: (chatId: string) => Promise<void>;
//   onRenameChat: (chatId: string, newName: string) => Promise<void>;
//   setChatHistory: (history: ChatHistory[]) => void;
//   isGeneralChat?: boolean;
//   maxWidth?: string;
// }

// const HistorySideBar: React.FC<HistorySideBarProps> = ({
//   chatHistory,
//   isLoading,
//   isSidebarOpen,
//   onToggleSidebar,
//   onChatSelect,
//   onDeleteChat,
//   onRenameChat,
//   setChatHistory,
//   isGeneralChat = false,
//   maxWidth,
// }) => {
//   const [activeMenu, setActiveMenu] = useState<string | null>(null);
//   const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
//   const [chatToDelete, setChatToDelete] = useState<ChatHistory | null>(null);
//   const [editingChatId, setEditingChatId] = useState<string | null>(null);
//   const [editingName, setEditingName] = useState("");

//   const handleDeleteClick = (chat: ChatHistory) => {
//     setChatToDelete(chat);
//     setActiveMenu(null);
//   };

//   const handleDeleteConfirm = async () => {
//     if (chatToDelete) {
//       try {
//         await onDeleteChat(chatToDelete.id);
//         setChatHistory(
//           chatHistory.filter((chat) => chat.id !== chatToDelete.id)
//         );
//         setChatToDelete(null);
//       } catch (error) {
//         console.error("Error deleting chat:", error);
//       }
//     }
//   };

//   const handleRenameClick = (chat: ChatHistory) => {
//     setEditingChatId(chat.id);
//     setEditingName(chat.name);
//     setActiveMenu(null);
//   };

//   const handleRenameSubmit = async (chatId: string) => {
//     try {
//       await onRenameChat(chatId, editingName);
//       setChatHistory(
//         chatHistory.map((chat) =>
//           chat.id === chatId ? { ...chat, name: editingName } : chat
//         )
//       );
//       setEditingChatId(null);
//     } catch (error) {
//       console.error("Error renaming chat:", error);
//     }
//   };

//   const toggleMenu = (
//     chatId: string,
//     event: React.MouseEvent<HTMLButtonElement>
//   ) => {
//     const buttonRect = event.currentTarget.getBoundingClientRect();
//     setDropdownPosition({
//       top: buttonRect.bottom + window.scrollY,
//       left: buttonRect.left + window.scrollX,
//     });

//     setActiveMenu((prevMenu) => (prevMenu === chatId ? null : chatId));
//   };

//   const closeMenu = () => {
//     setActiveMenu(null);
//   };

//   if (isLoading) {
//     return (
//       <aside className="bg-white border-r border-gray-200 p-4 flex flex-col justify-between h-full w-[320px]">
//         <div className="flex items-center justify-center h-full">
//           <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-purple-600 animate-spin"></div>
//         </div>
//       </aside>
//     );
//   }

//   return (
//     <>
//       <aside className="bg-white border-r border-gray-200 flex flex-col justify-between h-full">
//         {/* Toggle Button - Always visible */}
//         <div
//           className={`flex items-center border-b border-gray-200 pt-4 ${
//             isSidebarOpen ? "w-[320px]" : "w-[50px]"
//           } transition-all duration-300`}
//         >
//           <button
//             onClick={onToggleSidebar}
//             className="p-4 hover:bg-gray-100 transition-colors font"
//           >
//             {isSidebarOpen ? (
//               <Tooltip title="Collapse Sidebar">
//                 <img
//                   src={SidebarIcon}
//                   alt="Collapse Sidebar"
//                   className="w-18px h-18px"
//                 />
//               </Tooltip>
//             ) : (
//               <Tooltip title="Expand Sidebar">
//                 <img
//                   src={SidebarIcon}
//                   alt="Expand Sidebar"
//                   className="w-18px h-18px"
//                 />
//               </Tooltip>
//             )}
//           </button>
//           <div
//             className={`overflow-hidden transition-all duration-300 ${
//               isSidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"
//             }`}
//           >
//             <span className="whitespace-nowrap font-passenger font-medium text-[#000000]">
//               Chat History
//             </span>
//           </div>
//         </div>

//         {/* Chat History List - Collapsible */}
//         <div
//           className={`flex-1 overflow-hidden transition-all duration-300 ${
//             isSidebarOpen ? "w-[320px] opacity-100" : "w-0 opacity-0"
//           }`}
//         >
//           <div className="h-full overflow-y-auto p-4">
//             {chatHistory.map((chat) => (
//               <div
//                 key={chat.id}
//                 className={`text-black opacity-150 cursor-pointer p-2 rounded font-regular flex items-center justify-between group relative ${
//                   chat.isActive
//                     ? "shadow-md bg-[#f3f5f9]"
//                     : "hover:bg-[#f3f5f9]"
//                 }`}
//                 onMouseLeave={closeMenu}
//               >
//                 {/* Left section: Chat details */}
//                 <div className="flex flex-col flex-grow">
//                   {editingChatId === chat.id ? (
//                     <input
//                       type="text"
//                       value={editingName}
//                       onChange={(e) => setEditingName(e.target.value)}
//                       onBlur={() => handleRenameSubmit(chat.id)}
//                       onKeyPress={(e) => {
//                         if (e.key === "Enter") {
//                           handleRenameSubmit(chat.id);
//                         }
//                       }}
//                       className="border rounded px-2 py-1 text-sm w-[140px]"
//                       autoFocus
//                     />
//                   ) : (
//                     <span
//                       onClick={() => onChatSelect(chat.id)}
//                       className="truncate max-w-[140px] font-passenger font-light text-[#000000] text-sm"
//                       title={chat.name}
//                     >
//                       {chat.name}
//                     </span>
//                   )}
//                 </div>

//                 {/* Right section: Tags */}
//                 <div className="flex items-center gap-2">
//                   {chat.status && (
//                     <span
//                       className={`text-xs py-1 px-2 rounded-md font-medium ${
//                         chat.status === "Resolved" || chat.status === "Analyzed"
//                           ? "bg-[#DEF3C1] text-[#385C25]"
//                           : "bg-[#ECE4FF] text-[#5232A0]"
//                       }`}
//                     >
//                       {chat.status}
//                     </span>
//                   )}
//                   {chat.timestamp && (
//                     <span className="text-xs text-[#FF5600]">
//                       {chat.timestamp}
//                     </span>
//                   )}
//                 </div>
//                 <div className="relative">
//                   <button
//                     onClick={(event) => toggleMenu(chat.id, event)}
//                     className="focus:outline-none p-1 rounded-full invisible group-hover:visible"
//                   >
//                     <img
//                       src={DotsMenuIcon}
//                       alt="Menu"
//                       className="w-3.5 h-3.5"
//                     />
//                   </button>
//                   {activeMenu === chat.id && (
//                     <div
//                       className="absolute bg-white rounded-lg shadow-lg w-[130px]"
//                       style={{
//                         position: "fixed",
//                         top: dropdownPosition.top,
//                         left: dropdownPosition.left,
//                         boxShadow: "0px 4px 6px rgba(68, 68, 68, 0.1)",
//                         zIndex: 9999,
//                       }}
//                     >
//                       <ul className="text-sm">
//                         <li
//                           onClick={() => handleRenameClick(chat)}
//                           className="px-4 py-3 cursor-pointer flex items-center gap-2"
//                         >
//                           <img
//                             src={RenameIcon}
//                             alt="Rename"
//                             className="w-6 h-6"
//                           />
//                           Rename
//                         </li>
//                         <li
//                           onClick={() => handleDeleteClick(chat)}
//                           className="px-4 py-3 cursor-pointer text-red-600 flex items-center gap-2"
//                         >
//                           <img
//                             src={DeleteIcon}
//                             alt="Delete"
//                             className="w-6 h-6"
//                           />
//                           Delete
//                         </li>
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </aside>
//       {chatToDelete && (
//         <DeleteChatModal
//           chatName={chatToDelete.name}
//           chatId={chatToDelete.id}
//           onCancel={() => setChatToDelete(null)}
//           onDelete={handleDeleteConfirm}
//         />
//       )}
//     </>
//   );
// };

// export default HistorySideBar;











import React, { useState } from "react";
import DeleteChatModal from "./DeleteChatModal";
import DeleteIcon from "../assets/delete.svg";
import RenameIcon from "../assets/rename.svg";
import DotsMenuIcon from "../assets/dots-menu.svg";
import { ChatHistory } from "../Interface/Interface";
import { Tooltip } from "@mui/material";
import SidebarIcon from "../assets/chat.svg";
import NewChaticon from "../assets/NewChat.svg";

interface HistorySideBarProps {
  chatHistory: ChatHistory[];
  isLoading: boolean;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onChatSelect: (chatId: string) => void;
  onDeleteChat: (chatId: string) => Promise<void>;
  onRenameChat: (chatId: string, newName: string) => Promise<void>;
  setChatHistory: (history: ChatHistory[]) => void;
  isGeneralChat?: boolean;
  maxWidth?: string;
}

const HistorySideBar: React.FC<HistorySideBarProps> = ({
  chatHistory,
  isLoading,
  isSidebarOpen,
  onToggleSidebar,
  onChatSelect,
  onDeleteChat,
  onRenameChat,
  setChatHistory,
  isGeneralChat = false,
  maxWidth,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [chatToDelete, setChatToDelete] = useState<ChatHistory | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleDeleteClick = (chat: ChatHistory) => {
    setChatToDelete(chat);
    setActiveMenu(null);
  };

  const handleDeleteConfirm = async () => {
    if (chatToDelete) {
      try {
        await onDeleteChat(chatToDelete.id);
        setChatHistory(
          chatHistory.filter((chat) => chat.id !== chatToDelete.id)
        );
        setChatToDelete(null);
      } catch (error) {
        console.error("Error deleting chat:", error);
      }
    }
  };

  const handleRenameClick = (chat: ChatHistory) => {
    setEditingChatId(chat.id);
    setEditingName(chat.name);
    setActiveMenu(null);
  };

  const handleRenameSubmit = async (chatId: string) => {
    try {
      await onRenameChat(chatId, editingName);
      setChatHistory(
        chatHistory.map((chat) =>
          chat.id === chatId ? { ...chat, name: editingName } : chat
        )
      );
      setEditingChatId(null);
    } catch (error) {
      console.error("Error renaming chat:", error);
    }
  };

  const toggleMenu = (
    chatId: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: buttonRect.bottom + window.scrollY,
      left: buttonRect.left + window.scrollX,
    });

    setActiveMenu((prevMenu) => (prevMenu === chatId ? null : chatId));
  };

  const closeMenu = () => {
    setActiveMenu(null);
  };

  const renderChatList = () => {
    if (!isGeneralChat) {
      return chatHistory.map((chat) => (
        <div
          key={chat.id}
          className={`text-black opacity-150 cursor-pointer p-2 rounded font-regular flex items-center justify-between group relative mb-1 ${
            chat.isActive
              ? "bg-[#f3f5f9]"
              : "hover:bg-[#f3f5f9]"
          }`}
          onMouseLeave={closeMenu}
        >
          {/* Left section: Chat details */}
          <div className="flex flex-col flex-grow">
            {editingChatId === chat.id ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => handleRenameSubmit(chat.id)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleRenameSubmit(chat.id);
                  }
                }}
                className="border rounded px-2 py-1 text-sm w-[140px]"
                autoFocus
              />
            ) : (
              <span
                onClick={() => onChatSelect(chat.id)}
                className="truncate font-passenger font-light text-[#000000] text-sm"
                style={{ maxWidth: maxWidth || '140px' }}
                title={chat.name}
              >
                {chat.name}
              </span>
            )}
          </div>

          {/* Right section: Tags */}
          <div className="flex items-center gap-2">
            {chat.status ? (
              <span className={`text-xs py-1 px-2 rounded-md font-medium bg-[#ECE4FF] text-[#5232A0]`}>
                {chat.status}
              </span>
            ) : (
              <span className="text-xs text-[#FF5600]">
                {chat.timestamp}
              </span>
            )}
          </div>
          <div className="relative">
            <button
              onClick={(event) => toggleMenu(chat.id, event)}
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
                className="absolute bg-white rounded-lg shadow-lg w-[130px]"
                style={{
                  position: "fixed",
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                  boxShadow: "0px 4px 6px rgba(68, 68, 68, 0.1)",
                  zIndex: 9999,
                }}
              >
                <ul className="text-sm">
                  <li
                    onClick={() => handleRenameClick(chat)}
                    className="px-4 py-3 cursor-pointer flex items-center gap-2"
                  >
                    <img
                      src={RenameIcon}
                      alt="Rename"
                      className="w-6 h-6"
                    />
                    Rename
                  </li>
                  <li
                    onClick={() => handleDeleteClick(chat)}
                    className="px-4 py-3 cursor-pointer text-red-600 flex items-center gap-2"
                  >
                    <img
                      src={DeleteIcon}
                      alt="Delete"
                      className="w-6 h-6"
                    />
                    Delete
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      ));
    }

    const groupedChats = chatHistory.reduce((groups: { [key: string]: ChatHistory[] }, chat) => {
      const group = chat.timeGroup || 'Other';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(chat);
      return groups;
    }, {});

    return Object.entries(groupedChats).map(([timeGroup, chats]) => (
      <div key={timeGroup} className="mb-6">
        <h3 className="text-sm font-bold text-black mb-2">{timeGroup}</h3>
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`text-black opacity-150 cursor-pointer p-2 rounded font-regular flex items-center justify-between group relative mb-1 ${
              chat.isActive
                ? "bg-[#f3f5f9]"
                : "hover:bg-[#f3f5f9]"
            }`}
            onMouseLeave={closeMenu}
          >
            {/* Left section: Chat details */}
            <div className="flex flex-col flex-grow">
              {editingChatId === chat.id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => handleRenameSubmit(chat.id)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleRenameSubmit(chat.id);
                    }
                  }}
                  className="border rounded px-2 py-1 text-sm w-[140px]"
                  autoFocus
                />
              ) : (
                <span
                  onClick={() => onChatSelect(chat.id)}
                  className="truncate font-passenger font-light text-[#000000] text-sm"
                  style={{ maxWidth: maxWidth || '140px' }}
                  title={chat.name}
                >
                  {chat.name}
                </span>
              )}
            </div>

            {/* Right section: Tags */}
            <div className="flex items-center gap-2">
              {chat.status ? (
                <span className={`text-xs py-1 px-2 rounded-md font-medium bg-[#ECE4FF] text-[#5232A0]`}>
                  {chat.status}
                </span>
              ) : null}
            </div>

            {/* Menu button */}
            <div className="relative">
              <button
                onClick={(event) => toggleMenu(chat.id, event)}
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
                  className="absolute bg-white rounded-lg shadow-lg w-[130px]"
                  style={{
                    position: "fixed",
                    top: dropdownPosition.top,
                    left: dropdownPosition.left,
                    boxShadow: "0px 4px 6px rgba(68, 68, 68, 0.1)",
                    zIndex: 9999,
                  }}
                >
                  <ul className="text-sm">
                    <li
                      onClick={() => handleRenameClick(chat)}
                      className="px-4 py-3 cursor-pointer flex items-center gap-2"
                    >
                      <img
                        src={RenameIcon}
                        alt="Rename"
                        className="w-6 h-6"
                      />
                      Rename
                    </li>
                    <li
                      onClick={() => handleDeleteClick(chat)}
                      className="px-4 py-3 cursor-pointer text-red-600 flex items-center gap-2"
                    >
                      <img
                        src={DeleteIcon}
                        alt="Delete"
                        className="w-6 h-6"
                      />
                      Delete
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    ));
  };

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
      <aside className="bg-white border-r border-gray-200 flex flex-col justify-between h-full">
        {/* Toggle Button - Always visible */}
        <div
          className={`flex items-center border-b border-gray-200 pt-4 ${
            isSidebarOpen ? "w-[320px]" : "w-[50px]"
          } transition-all duration-300`}
        >
          <button
            onClick={onToggleSidebar}
            className="p-4 hover:bg-gray-100 transition-colors font"
          >
            {isSidebarOpen ? (
              <Tooltip title="Collapse Sidebar">
                <img
                  src={SidebarIcon}
                  alt="Collapse Sidebar"
                  className="w-18px h-18px"
                />
              </Tooltip>
            ) : (
              <Tooltip title="Expand Sidebar">
                <img
                  src={SidebarIcon}
                  alt="Expand Sidebar"
                  className="w-18px h-18px"
                />
              </Tooltip>
            )}
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isSidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"
            }`}
          >
            <span className="whitespace-nowrap font-passenger font-medium text-[#000000] flex items-center">
              Chat History
              <img src={NewChaticon} alt="New Chat" className="ml-[120px] w-9 h-9" />
            </span>
          </div>
        </div>

        {/* Chat History List - Collapsible */}
        <div
          className={`flex-1 overflow-hidden transition-all duration-300 ${
            isSidebarOpen ? "w-[320px] opacity-100" : "w-0 opacity-0"
          }`}
        >
          <div className="h-full overflow-y-auto p-4">
            {renderChatList()}
          </div>
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
