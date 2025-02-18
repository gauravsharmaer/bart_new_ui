import React, { useState } from "react";
import DeleteChatModal from "./DeleteChatModal";
import DeleteIcon from "../assets/delete.svg";
import RenameIcon from "../assets/rename.svg";
import DotsMenuIcon from "../assets/dots-menu.svg";
import darkDotsMenuIcon from "../assets/darkdotsmenu.svg";
import { ChatHistory } from "../Interface/Interface";
import { Tooltip } from "@mui/material";
import SidebarIcon from "../assets/chat.svg";
import NewChaticon from "../assets/NewChat.svg";
import {  useDispatch } from "react-redux";
import { startNewChat } from "../redux/chatSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { HistorySideBarProps } from "../props/Props";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import darkSidebarIcon from "../assets/dark-chat.svg";
import DarkNewChatIcon from "../assets/DarkNewChat.svg"
import darkRenameIcon from "../assets/darkrename.svg";


const HistorySideBar: React.FC<HistorySideBarProps> = ({
  chatHistory,
  isLoading,
  isSidebarOpen,
  onToggleSidebar,
  onChatSelect,
  onDeleteChat,
  onRenameChat,
  setChatHistory,
  maxWidth,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [chatToDelete, setChatToDelete] = useState<ChatHistory | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

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

  const renderChatItem = (chat: ChatHistory) => (
    <div
      key={chat.id}
      className={`text-black opacity-150 cursor-pointer p-2 rounded font-regular flex items-center justify-between group relative ${
        chat.isActive
          ? "bg-[#f3f5f9] dark:bg-[#000000]"
          : "hover:bg-[#f3f5f9] dark:hover:bg-black dark:hover:rounded-lg"
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
            className={`truncate font-passenger font-light ${
              chat.isActive 
                ? 'text-black dark:text-white' 
                : 'text-[#000000] dark:text-[#f0f0f0] opacity-80'
            } text-sm`}
            style={{ maxWidth: maxWidth || '250px' }}
            title={chat.name}
          >
            {chat.name}
          </span>
        )}
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
            className="w-3.5 h-3.5 dark:hidden"
          />
          <img
            src={darkDotsMenuIcon}
            alt="Menu"
            className="w-3.5 h-3.5 hidden dark:block"
          />
        </button>
        {activeMenu === chat.id && (
          <div
            className="absolute bg-white dark:bg-[#313131] rounded-lg shadow-lg w-[130px]"
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
                className="px-4 py-3 cursor-pointer flex items-center gap-2 dark:text-[#ffffff]"
              >
                <img
                  src={RenameIcon}
                  alt="Rename"
                  className="w-6 h-6 dark:hidden"
                />
                <img
                  src={darkRenameIcon}
                  alt="Rename"
                  className="w-6 h-6 hidden dark:block"
                />
                Rename
              </li>
              <li
                onClick={() => handleDeleteClick(chat)}
                className="px-4 py-3 cursor-pointer text-red-600 flex items-center gap-2 dark:text-[#ED2B31]"
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
  );

  const renderChatList = () => {
    return chatHistory.map((chat) => renderChatItem(chat));
  };

  if (isLoading) {
    return (
      <aside className="bg-white p-4 flex flex-col justify-between h-[calc(100vh-45px)] w-[320px] dark:bg-[#1E1E1E]">
        <div className="flex items-center justify-center h-full">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-purple-600 animate-spin"></div>
        </div>
      </aside>
    );
  }

  return (
    <>
       <aside className="bg-white flex flex-col justify-between h-full dark:bg-[#1E1E1E] ">

        {/* Toggle Button - Always visible */}
        <div
          className={`flex items-center border-b border-t border-gray-200 dark:border-[#f0f0f0] dark:border-opacity-10 pt-2 ${
            isSidebarOpen ? "w-[320px]" : "w-[50px]"
          } transition-all duration-300`}
        >
          <button
            onClick={onToggleSidebar}
            className="p-4 hover:bg-white dark:hover:bg-[#1e1e1e] transition-colors font"
          >
            {isSidebarOpen ? (
              <Tooltip title="Collapse Sidebar">
                <img
                  src={isDarkMode ? darkSidebarIcon : SidebarIcon}
                  alt="Collapse Sidebar"
                  className="w-7 h-7"
                />
              </Tooltip>
            ) : (
              <Tooltip title="Expand Sidebar">
                <img
                  src={isDarkMode ? darkSidebarIcon : SidebarIcon}
                  alt="Expand Sidebar"
                  className="w-10 h-5"
                />
              </Tooltip>
            )}
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isSidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"
            }`}
          >
            <span className="whitespace-nowrap font-passenger font-medium text-[#000000] flex items-center pr-[15px] dark:text-[#f0f0f0]">
              Chat History
              <img
                src={isDarkMode ? DarkNewChatIcon : NewChaticon}
                alt="New Chat"
                className="ml-[120px] w-9 h-9"
                onClick={() => {
                  dispatch(startNewChat());
                  if (location.pathname === "/general-chat") {
                    navigate("/general-chat");
                  } else if (location.pathname === "/chat-with-pdf") {
                    navigate("/chat-with-pdf");
                  } else {
                    navigate("/");
                  }
                }}
              />
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
