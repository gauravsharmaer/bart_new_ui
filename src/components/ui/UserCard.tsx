import React from "react";
import { formatName } from "../../utils/NameFormatter";
import { BackendBaseUrl } from "../../config";
import { getInitials } from "../../utils/NameInitials";
import { UserCardProps } from "../../props/Props";

const UserCard: React.FC<UserCardProps> = ({ name, text }) => {
  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formattedName = formatName(name);

  return (
    <div className="w-full py-4 px-4 flex justify-end">
      {/* Main User Message Container */}
      <div className="rounded-lg flex items-start gap-4 max-w-md w-auto p-4">
        {/* Message Container with Background */}
        <div className="rounded-lg flex items-start gap-4 max-w-md w-auto p-4 bg-[#A3A3A3]/[0.07] dark:bg-[#2c2d32] transition-colors duration-200">
          {/* Profile Icon */}
          <div className="w-10 h-10 flex-shrink-0">
            {localStorage.getItem("image") &&
            localStorage.getItem("image") !== "undefined" ? (
              <img
                src={`${BackendBaseUrl}/${localStorage.getItem("image")}`}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover dark:opacity-90"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#FF6F61] dark:bg-[#ff8851] flex justify-center items-center text-xl text-white dark:text-gray-100 mr-3 transition-colors duration-200">
                {getInitials(localStorage.getItem("name") || "")}
              </div>
            )}
          </div>

          {/* Message Content */}
          <div className="flex-grow">
            <div className="flex items-center gap-1 mb-1">
              {/* User Name */}
              <span className="text-[12px] font-passenger font-light text-gray-900 dark:text-gray-200 transition-colors duration-200">
                {formattedName}
              </span>
              {/* Centered Dot */}
              <span className="text-[12px] font-passenger font-light text-gray-900 dark:text-gray-200 transition-colors duration-200">
                •
              </span>
              {/* Timestamp */}
              <span className="text-[12px] font-passenger font-light text-gray-600 dark:text-gray-400 transition-colors duration-200">
                {currentTime}
              </span>
            </div>
            {/* User Chat Text */}
            <p className="text-[14px] font-passenger font-normal text-gray-900 dark:text-gray-200 leading-relaxed mt-1 transition-colors duration-200">
              {text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
