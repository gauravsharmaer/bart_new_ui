import React from "react";
import { useNavigate } from "react-router-dom";
import { ProfileProps } from "./Interface/Interface";

const Profile: React.FC<ProfileProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
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
        } w-[280px] h-[734px] bg-white shadow-md z-[1000] rounded-lg overflow-hidden absolute top-4 left-4`}
      >
        <div className="flex items-center p-4 border-b border-gray-100">
          <div className="w-12 h-12 rounded-full bg-[#FF6F61] flex justify-center items-center text-xl text-white mr-3">
            JD
          </div>
          <div className="flex flex-col">
            <strong>John Doe</strong>
            <span className="text-sm text-gray-500">
              john.doe@brightcone.com
            </span>
          </div>
        </div>

        {/* Toggle Section */}
        <div className="flex justify-around px-2.5 py-1.5 border-b border-gray-100">
          <div className="p-1.5 rounded bg-gray-50 cursor-pointer flex items-center justify-center">
            🖥
          </div>
          <div className="p-1.5 rounded bg-gray-50 cursor-pointer flex items-center justify-center">
            🌞
          </div>
          <div className="p-1.5 rounded bg-gray-50 cursor-pointer flex items-center justify-center">
            🌙
          </div>
        </div>

        {/* Menu Items */}
        <ul className="list-none p-0 my-4">
          <li className="px-4 py-3 cursor-pointer text-gray-700 text-sm flex items-center">
            <span className="mr-2">🖥</span> New chat
          </li>
          <li className="px-4 py-3 cursor-pointer text-gray-700 text-sm flex items-center">
            <span className="mr-2">📋</span> Templates
          </li>
          <li className="px-4 py-3 cursor-pointer text-gray-700 text-sm flex items-center">
            <span className="mr-2">⏳</span> History
          </li>
          <li className="px-4 py-3 cursor-pointer text-gray-700 text-sm flex items-center">
            <span className="mr-2">🎫</span> Tickets
          </li>
          <li className="px-4 py-3 cursor-pointer text-gray-700 text-sm flex items-center">
            <span className="mr-2">⚙</span> Setting
          </li>
        </ul>

        {/* Log Out Section */}
        <div
          className="absolute bottom-4 left-4 px-4 py-3 text-[#FF6F61] cursor-pointer text-center w-[calc(100%-32px)]"
          onClick={handleLogout}
        >
          <span>🔓 Log out</span>
        </div>
      </div>
    </>
  );
};

export default Profile;
