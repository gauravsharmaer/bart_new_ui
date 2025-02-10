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
import { startNewChat } from "../../redux/chatSlice.ts";
// import { resetChat } from "../../redux/chatSlice";

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

  const handleOpenChatHistory = () => {
    setChatHistoryOpen(true);
  };

  const handleCloseChatHistory = () => {
    setChatHistoryOpen(false);
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
        } w-80 h-screen bg-white dark:bg-[#1a1b1e] shadow-md z-[1000] rounded-l-3xl overflow-hidden absolute right-[2px]`}
      >
        {/* Profile Section */}
        <div className="flex items-center p-4 dark:bg-[#2c2d32]">
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

        {/* Toggle Section */}
        <div className="p-3 border border-[#DDE0E4] dark:border-[#2c2d32] dark:bg-[#1a1b1e]">
          <div className="flex justify-between items-center gap-2 bg-[#EEEEEE] dark:bg-[#2c2d32] p-1 rounded-2xl">
            <div
              className={`flex items-center justify-center w-14 h-14 rounded-lg transition-all duration-200 cursor-pointer ${
                isSystem
                  ? "bg-white dark:bg-[#3a3b40] w-28 h-10 shadow-md dark:shadow-[#1a1b1e]"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 dark:hover:bg-[#3a3b40]/40"
              }`}
              onClick={() => setSelected("system")}
            >
              <img src={SystemIcon} alt="System Icon" className="w-6 h-6 " />
            </div>
            <div
              className={`flex items-center justify-center w-14 h-14 rounded-lg transition-all duration-200 cursor-pointer ${
                isLight
                  ? "bg-white dark:bg-[#3a3b40] w-28 h-10 shadow-md dark:shadow-[#1a1b1e]"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 dark:hover:bg-[#3a3b40]/40"
              }`}
              onClick={() => setSelected("light")}
            >
              <img
                src={LightModeIcon}
                alt="Light Mode Icon"
                className="w-6 h-6 "
              />
            </div>
            <div
              className={`flex items-center justify-center w-14 h-14 rounded-lg transition-all duration-200 cursor-pointer ${
                isDark
                  ? "bg-white dark:bg-[#3a3b40] w-28 h-10 shadow-md dark:shadow-[#1a1b1e]"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 dark:hover:bg-[#3a3b40]/40"
              }`}
              onClick={() => setSelected("dark")}
            >
              <img
                src={DarkModeIcon}
                alt="Dark Mode Icon"
                className="w-6 h-6 "
              />
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <ul className="list-none p-0 my-4">
          <li className="px-4 py-3 cursor-pointer text-[#16283F] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2c2d32] text-sm flex items-center transition-colors duration-200">
            <Link 
              to="/"
              onClick={() => {
                dispatch(startNewChat());
              }} 
              className="flex items-center"
            >
              <img src={PlusIcon} alt="New Chat" className="mr-3 w-5 h-5 dark:bg-gray-500" />
              New chat
            </Link>
          </li>
          <li className="px-4 py-3 cursor-pointer text-[#16283F] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2c2d32] text-sm flex items-center transition-colors duration-200">
            <Link to="/password" className="flex items-center">
              <img
                src={DashboardIcon}
                alt="Templates"
                className="mr-3 w-5 h-5 dark:bg-gray-500"
              />
              Templates
            </Link>
          </li>
          <li className="px-4 py-3 cursor-pointer text-[#16283F] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2c2d32] text-sm flex items-center transition-colors duration-200">
            <Link to="/tickets" className="flex items-center">
              <img src={StickerIcon} alt="Tickets" className="mr-3 w-5 h-5 dark:bg-gray-500" />
              Tickets
            </Link>
          </li>
          <li
            className="px-4 py-3 cursor-pointer text-[#16283F] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2c2d32] text-sm flex items-center transition-colors duration-200"
            onClick={handleOpenChatHistory}
          >
            <div className="flex items-center">
              <img
                src={CounterClockwiseIcon}
                alt="History"
                className="mr-3 w-5 h-5 dark:bg-gray-500"
              />
              Chat History
            </div>
          </li>
          <li className="px-4 py-3 cursor-pointer text-[#16283F] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2c2d32] text-sm flex items-center transition-colors duration-200">
            <Link to="/settings" className="flex items-center">
              <img src={SettingIcon} alt="Settings" className="mr-3 w-5 h-5 dark:bg-gray-500" />
              Setting
            </Link>
          </li>
          <li className="px-4 py-3 cursor-pointer text-[#16283F] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2c2d32] text-sm flex items-center transition-colors duration-200">
            <Link to="/settings" className="flex items-center">
              <img src={DeleteChat} alt="Settings" className="mr-3 w-5 h-5 dark:bg-gray-500" />
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

        {/* Log Out Section */}
        <div
          className="absolute bottom-2 left-4 w-full px-4 py-3 text-[#16283F] dark:text-gray-200 cursor-pointer text-sm flex items-center border-t border-[#DDE0E4] dark:border-[#2c2d32] hover:bg-gray-100 dark:hover:bg-[#2c2d32] transition-colors duration-200"
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
