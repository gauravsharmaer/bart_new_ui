import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { ProfileProps } from "./Interface/Interface";
import { formatName } from "../../utils/NameFormatter";
import { Link } from "react-router-dom";
import { logout } from "../../Api/CommonApi";
import { useDispatch } from "react-redux";
import { handleOneloginAuth } from "../../redux/authSlice";
import { BackendBaseUrl } from "../../config";
import { getInitials } from "../../utils/NameInitials";
import CounterClockwiseIcon from "../../assets/CounterClockwise.svg";
import DarkModeIcon from "../../assets/dark-mode.svg";
import DashboardIcon from "../../assets/Dashboard.svg";
import LightModeIcon from "../../assets/light-mode.svg";
import PlusIcon from "../../assets/Plus.svg";
import SettingIcon from "../../assets/setting.svg";
import StickerIcon from "../../assets/Sticker.svg";
import SystemIcon from "../../assets/system.svg";
import Logouticon from "../../assets/log-out.svg"

const Profile: React.FC<ProfileProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState<'system' | 'light' | 'dark'>('light')
  const isSystem = selected === 'system';
  const isLight = selected === 'light';
  const isDark = selected === 'dark';

  // const getInitials = (name: string): string => {
  //   if (!name) return "";
  //   return name
  //     .split(" ")
  //     .map((word) => word.charAt(0))
  //     .join("")
  //     .toUpperCase()
  //     .slice(0, 2);
  // };

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
        className={`fixed inset-0 bg-black bg-opacity-50 z-[999] ${isOpen ? "block" : "hidden"}`}
        onClick={onClose}
      ></div>
      <div
        className={`$ {
          isOpen ? "block" : "hidden"
        } w-80 h-screen bg-white shadow-md z-[1000] rounded-l-3xl overflow-hidden absolute right-[2px]`}
      >
        {/* Profile Section */}
        <div className="flex items-center p-4">
          {localStorage.getItem("image") && localStorage.getItem("image") !== "undefined" ? (
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
            <strong>{formatName(`${localStorage.getItem("name")}`)}</strong>
            <span className="text-sm text-gray-500">{localStorage.getItem("email")}</span>
          </div>
        </div>

        {/* Toggle Section */}
              <div className="p-3 border border-[#DDE0E4]">
        <div className="flex justify-between items-center gap-2 bg-[#EEEEEE] p-1 rounded-2xl">
          <div
            className={`flex items-center justify-center w-14 h-14 rounded-lg transition-all duration-200 cursor-pointer ${
              isSystem
                ? "bg-white w-28 h-10 shadow-md "
                : "text-gray-500 hover:text-gray-900 hover:bg-white/40"
            }`}
            onClick={() => setSelected("system")}
          >
            <img src={SystemIcon} alt="System Icon" className="w-6 h-6" />
          </div>
          <div
            className={`flex items-center justify-center w-14 h-14 rounded-lg transition-all duration-200 cursor-pointer ${
              isLight
                ? "bg-white w-28 h-10  shadow-md "
                : "text-gray-500 hover:text-gray-900 hover:bg-white/40"
            }`}
            onClick={() => setSelected("light")}
          >
            <img src={LightModeIcon} alt="Light Mode Icon" className="w-6 h-6" />
          </div>
          <div
            className={`flex items-center justify-center w-14 h-14 rounded-lg transition-all duration-200 cursor-pointer ${
              isDark
                ? "bg-white w-28 h-10  shadow-md "
                : "text-gray-500 hover:text-gray-900 hover:bg-white/40"
            }`}
            onClick={() => setSelected("dark")}
          >
            <img src={DarkModeIcon} alt="Dark Mode Icon" className="w-6 h-6" />
          </div>
        </div>
      </div>



        {/* Menu Items */}
        <ul className="list-none p-0 my-4">
          <li className="px-4 py-3 cursor-pointer text-[#16283F] text-sm flex items-center">
            <Link to="/" className="flex items-center">
              <img src={PlusIcon} alt="New Chat" className="mr-3 w-5 h-5" />
              New chat
            </Link>
          </li>
          <li className="px-4 py-3 cursor-pointer text-[#16283F] text-sm flex items-center">
            <Link to="/" className="flex items-center">
              <img src={DashboardIcon} alt="Templates" className="mr-3 w-5 h-5" />
              Templates
            </Link>
          </li>
          <li className="px-4 py-3 cursor-pointer text-[#16283F] text-sm flex items-center">
            <Link to="/" className="flex items-center">
              <img src={CounterClockwiseIcon} alt="History" className="mr-3 w-5 h-5" />
              History
            </Link>
          </li>
          <li className="px-4 py-3 cursor-pointer text-[#16283F] text-sm flex items-center">
            <Link to="/" className="flex items-center">
              <img src={StickerIcon} alt="Tickets" className="mr-3 w-5 h-5" />
              Tickets
            </Link>
          </li>
          <li className="px-4 py-3 cursor-pointer text-[#16283F] text-sm flex items-center">
            <Link to="/" className="flex items-center">
              <img src={SettingIcon} alt="Settings" className="mr-3 w-5 h-5" />
              Setting
            </Link>
          </li>
        </ul>

        {/* Log Out Section */}

              <div
                className="absolute bottom-2 left-4 w-full px-4 py-3 text-[#16283F] cursor-pointer text-sm flex items-center border-t border-[#DDE0E4]"
                style={{ left: 0 }}
                onClick={handleLogout}
              >
                <img src={Logouticon} alt="Log Out" className="mr-2 w-6 h-6" />
                <span className="font-semibold">Log out</span>
                </div>

            </div>
      
    </>
  );
};

export default Profile;