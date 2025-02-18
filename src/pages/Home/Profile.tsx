import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileProps } from "../../props/Props";
import { formatName } from "../../utils/NameFormatter";
import { Link } from "react-router-dom";
import { logout } from "../../Api/CommonApi";
import { useDispatch, useSelector } from "react-redux";
import { handleOneloginAuth } from "../../redux/authSlice";
import { setTheme } from "../../redux/themeSlice";
import { RootState } from "../../redux/store";
import { BackendBaseUrl } from "../../config";
import { getInitials } from "../../utils/NameInitials";
import CounterClockwiseIcon from "../../assets/CounterClockwise.svg";
import DarkModeIcon from "../../assets/dark-mode.svg";
import DashboardIcon from "../../assets/Dashboard.svg";
import LightModeIcon from "../../assets/light-mode.svg";
import PlusIcon from "../../assets/New-Chat.svg";
import SettingIcon from "../../assets/setting.svg";
import StickerIcon from "../../assets/Sticker.svg";
import SystemIcon from "../../assets/system.svg";
import Logouticon from "../../assets/log-out.svg";
import DeleteChat from "../../assets/delete-chat.svg";
import ChatHistoryTable from "../../components/ChatHistoryTable.tsx";
//import { startNewChat } from "../../redux/chatSlice.ts";
import ChatbracesIcon from "../../assets/Chatbraces.svg";
import DownIcon from "../../assets/down.svg"
import UpIcon from "../../assets/up.svg"
import darkCounterClockwiseIcon from "../../assets/darkClockCounterClockwise.svg";
import darkDashboardIcon from "../../assets/darkdashborad.svg";
import darkPlusIcon from "../../assets/dark-new-chat.svg";
import darkSettingIcon from "../../assets/darksetting.svg";
import darkStickerIcon from "../../assets/darkSticker.svg";
import darkDeleteChat from "../../assets/darkdeletechat.svg";
import darkDownIcon from "../../assets/darkdown.svg"
import darkUpIcon from "../../assets/darkup.svg"
import darkDarkModeIcon from "../../assets/dark-dark-mode.svg";
import darkLightModeIcon from "../../assets/dark-light-mode.svg";
import darkSystemIcon from "../../assets/darksystem.svg";
import darkChatbracesIcon from "../../assets/darkChatBraces.svg";



const Profile: React.FC<ProfileProps> = ({ isOpen, onClose }): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const [selected, setSelected] = useState<"system" | "light" | "dark">(
    (localStorage.getItem("theme") as "system" | "light" | "dark") ||
      (isDarkMode ? "dark" : "light")
  );

  const isSystem = selected === "system";
  const isLight = selected === "light";
  const isDark = selected === "dark";

  const [isChatHistoryOpen, setChatHistoryOpen] = useState(false); // State for ChatHistoryTable
  const [showNewChatDropdown, setShowNewChatDropdown] = useState(false);
  

  const handleOpenChatHistory = () => {
    setChatHistoryOpen(true);
  };

  const handleCloseChatHistory = () => {
    setChatHistoryOpen(false);
  };

  const handleNewChatClick = () => {
    setShowNewChatDropdown(!showNewChatDropdown);
  };


  useEffect(() => {
    if (selected === "dark") {
      dispatch(setTheme(true));
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else if (selected === "light") {
      dispatch(setTheme(false));
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    } else {
      // Handle system preference
      localStorage.setItem("theme", "system");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      dispatch(setTheme(prefersDark));
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      // Listen for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        dispatch(setTheme(e.matches));
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [selected, dispatch]);

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(handleOneloginAuth(false));
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-[999] ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={onClose}
      ></div>
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } w-80 h-screen bg-white dark:bg-[#313131] shadow-md z-[1000] rounded-l-3xl overflow-hidden absolute right-[2px]`}
      >
        {/* Profile Section */}
        <div className="flex items-center p-4 dark:bg-[#313131] border-b border-[#f6f6f6] dark:border-[#dde0e4] dark:border-opacity-20">
          {localStorage.getItem("image") &&
          localStorage.getItem("image") !== "undefined" ? (
            <img
              src={`${BackendBaseUrl}/${localStorage.getItem("image")}`}
              alt="Profile"
              className="w-12 h-12 rounded-full flex justify-center items-center mr-3"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#FF6F61] flex justify-center items-center text-xl text-white mr-3">
              {getInitials(localStorage.getItem("name") || "")}
            </div>
          )}

          <div className="flex flex-col">
            <strong className="dark:text-white">
              {formatName(`${localStorage.getItem("name")}`)}
            </strong>
            <span className="text-sm text-gray-500 ">
              {localStorage.getItem("email")}
            </span>
          </div>
        </div>



        {/* Menu Items */}
        <ul className="list-none p-0 my-4">
          <div className="px-4 pt-0">
            <button 
              onClick={handleNewChatClick}
              className={`w-full flex items-center justify-between 
                ${showNewChatDropdown ? 'bg-[#f6f6f6] dark:bg-[#464646]' : 'bg-transparent'} 
                text-[#16283F] dark:text-gray-200 rounded-lg px-4 py-3 text-sm 
                hover:bg-[#f6f6f6] dark:hover:bg-[#464646] transition-colors duration-200`}
            >
              <div className="flex items-center">
                <img src={ isDarkMode ? darkPlusIcon : PlusIcon} alt="New Chat" className="mr-3 w-5 h-5 dark:bg-none" />
                New Chat
              </div>
              {showNewChatDropdown ? (
                <img src={isDarkMode ? darkDownIcon : DownIcon} alt="Dropdown" className="w-4 h-4" />
              ) : (
                <img src={isDarkMode ? darkUpIcon : UpIcon} alt="Dropdown" className="w-4 h-4" />
              )}
            </button>
            {showNewChatDropdown && (
              <div className="flex flex-col mt-2 ml-4">
                <div className="flex items-center mb-[-100px]">
                  <img src={isDarkMode ? darkChatbracesIcon : ChatbracesIcon} alt="Chat Options" className="w-18 h-24" />                
                  </div>
                <div className="flex flex-col mt-1">
                  <div 
                    className="flex items-center ml-4 px-0 py-2 rounded-lg cursor-pointer text-[#757575] dark:text-gray-200 hover:bg-[#f6f6f6] dark:hover:bg-[#464646] text-sm transition-colors duration-200"
                    onClick={() => navigate('/general-chat')}
                  >
                    <span className="mr-2 ml-2">General Chat</span>
                  </div>
                  <div 
                    className="flex items-center ml-4 px-0 py-2 rounded-lg cursor-pointer text-[#757575] dark:text-gray-200 hover:bg-[#f6f6f6] dark:hover:bg-[#464646] text-sm transition-colors duration-200"
                    onClick={() => navigate("/chat-with-pdf")}
                  >
                    <span className="mr-2 ml-2">PDF Chat</span>
                  </div>
                  <div 
                    className="flex items-center ml-4 px-0 py-2 rounded-lg cursor-pointer text-[#757575] dark:text-gray-200 hover:bg-[#f6f6f6] dark:hover:bg-[#464646] text-sm transition-colors duration-200"
                    onClick={() => navigate("/")}
                  >
                    <span className="mr-2 ml-2">BART Chat</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <li className="mx-4 px-4 py-3 cursor-pointer text-[#16283F] dark:text-gray-200 hover:bg-[#f6f6f6] rounded-lg dark:hover:bg-[#464646] text-sm flex items-center transition-colors duration-200 ">
            <Link to="/password" className="flex items-center">
              <img
                src={ isDarkMode ? darkDashboardIcon : DashboardIcon}
                alt="Templates"
                className="mr-3 w-5 h-5 dark:bg-none"
              />
              Templates
            </Link>
          </li>
          <li className="mx-4 px-4  py-3 cursor-pointer text-[#16283F] dark:text-gray-200 hover:bg-[#f6f6f6] rounded-lg dark:hover:bg-[#464646] text-sm flex items-center transition-colors duration-200">
            <Link to="/tickets" className="flex items-center">
              <img src={ isDarkMode ? darkStickerIcon : StickerIcon} alt="Tickets" className="mr-3 w-5 h-5 dark:bg-none" />
              Tickets
            </Link>
          </li>
          <li
            className="mx-4 px-4 py-3 cursor-pointer text-[#16283F] dark:text-gray-200 hover:bg-[#f6f6f6] rounded-lg dark:hover:bg-[#464646] text-sm flex items-center transition-colors duration-200"
            onClick={handleOpenChatHistory}
          >
            <div className="flex items-center">
              <img
                src={ isDarkMode ? darkCounterClockwiseIcon : CounterClockwiseIcon}
                alt="History"
                className="mr-3 w-5 h-5 dark:bg-none"
              />
              Chat History
            </div>
          </li>
          <li className="mx-4 px-4 py-3 cursor-pointer text-[#16283F] dark:text-gray-200 hover:bg-[#f6f6f6] rounded-lg dark:hover:bg-[#464646] text-sm flex items-center transition-colors duration-200">
            <Link to="/settings" className="flex items-center">
              <img src={ isDarkMode ? darkSettingIcon : SettingIcon} alt="Settings" className="mr-3 w-5 h-5 dark:bg-none" />
              Setting
            </Link>
          </li>
          <li className="mx-4 px-4 py-3 cursor-pointer text-[#16283F] dark:text-gray-200 hover:bg-[#f6f6f6] rounded-lg dark:hover:bg-[#464646] text-sm flex items-center transition-colors duration-200">
            <Link to="/settings" className="flex items-center">
              <img src={ isDarkMode ? darkDeleteChat : DeleteChat} alt="Settings" className="mr-3 w-5 h-5 dark:bg-none" />
              Deleted Chat
            </Link>
          </li>
        </ul>

        {/* Chat History Side Panel */}
        {isChatHistoryOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[999]">
            <div className="w-80 h-screen bg-white dark:bg-[#1a1b1e] shadow-md z-[1000] rounded-l-3xl overflow-hidden absolute right-0">
              <ChatHistoryTable onClose={handleCloseChatHistory} />
              <button
                onClick={handleCloseChatHistory}
                className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Toggle Section */}
        <div className="absolute bottom-12 left-0 w-full p-3 border-t border-[#f6f6f6] dark:border-[#dde0e4] dark:border-opacity-20 dark:bg-[#313131]">
          <div className="flex justify-between items-center gap-2 bg-[#f6f6f6] dark:bg-[#575757] p-1.5 rounded-2xl">
            <div
              className={`flex items-center justify-center w-28 h-10 rounded-lg transition-all duration-200 cursor-pointer ${
                isSystem
                ? "bg-white dark:bg-[#383838] border border-[#000000] border-opacity-10 dark:border-[#ffffff] dark:border-opacity-20 dark:border-radius-[0.5px] w-28 h-10 shadow-md"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 dark:hover:bg-[#3a3b40]/40"
              }`}
              onClick={() => setSelected("system")}
            >
              <img src={isDarkMode ? darkSystemIcon : SystemIcon} alt="System Icon" className="w-6 h-6 " />
            </div>
            <div
              className={`flex items-center justify-center w-28 h-10 rounded-lg transition-all duration-200 cursor-pointer ${
                isLight
                ? "bg-white dark:bg-[#383838] border border-[#000000] border-opacity-10 dark:border-[#ffffff] dark:border-opacity-20 dark:border-radius-[0.5px] w-28 h-10 shadow-md"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 dark:hover:bg-[#3a3b40]/40"
              }`}
              onClick={() => setSelected("light")}
            >
              <img
                src={isDarkMode ? darkLightModeIcon : LightModeIcon}
                alt="Light Mode Icon"
                className="w-6 h-6 "
              />
            </div>
            <div
              className={`flex items-center justify-center w-28 h-10 rounded-lg transition-all duration-200 cursor-pointer ${
                isDark
                  ? "bg-white dark:bg-[#383838] border border-[#000000] border-opacity-10 dark:border-[#ffffff] dark:border-opacity-20 dark:border-radius-[0.5px] w-28 h-10 shadow-md"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 dark:hover:bg-[#3a3b40]/40"
              }`}
              onClick={() => setSelected("dark")}
            >
              <img
                src={isDarkMode ? darkDarkModeIcon : DarkModeIcon}
                alt="Dark Mode Icon"
                className="w-6 h-6 "
              />
            </div>
          </div>
        </div>

        {/* Log Out Section */}
        <div
          className="absolute bottom-0 left-0 w-full px-4 py-3 text-[#16283F] dark:text-gray-200 cursor-pointer text-sm flex items-center border-t border-[#f6f6f6] dark:border-[#dde0e4] dark:border-opacity-20 hover:bg-gray-100 dark:hover:bg-[#2c2d32] transition-colors duration-200"
          style={{ left: 0 }}
          onClick={handleLogout}
        >
          <img src={Logouticon} alt="Log Out" className="mr-3 w-5 h-5" />
          Log out
        </div>
      </div>
    </>
  );
};

export default Profile;
