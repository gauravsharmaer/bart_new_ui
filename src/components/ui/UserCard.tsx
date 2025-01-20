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
    // <div className="w-full py-4 px-4 flex justify-end">
    <div
      className="w-full py-4 px-4 flex justify-end "
      style={{ marginRight: "0px" }}
    >
      {/* Main User Message Container */}
      <div className=" rounded-lg flex items-start gap-4 max-w-md w-auto p-4">
        {/* Profile Icon */}
        <div
          className="rounded-lg flex items-start gap-4 max-w-md w-auto p-4 bg-[#A3A3A3] bg-opacity-7"
          style={{ backgroundColor: "rgba(163, 163, 163, 0.07)" }}
        >
          <div className="w-10 h-10 flex-shrink-0">
            {localStorage.getItem("image") &&
            localStorage.getItem("image") !== "undefined" ? (
              <img
                src={`${BackendBaseUrl}/${localStorage.getItem("image")}`}
                alt="Profile"
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-full bg-[#FF6F61] flex
               justify-center items-center text-xl text-white mr-3"
              >
                {getInitials(localStorage.getItem("name") || "")}
              </div>
            )}
          </div>

          {/* Message Content */}
          <div className="flex-grow ">
            <div className="flex items-center gap-1 mb-1">
              {/* User Name */}
              <span className="text-[12px] font-passenger font-light text-[#000000]">
                {formattedName}
              </span>
              {/* Centered Dot */}
              <span className="text-[12px] font-passenger font-light text-[#000000]">
                •
              </span>
              {/* Timestamp */}
              <span className="text-[12px] font-passenger font-light text-[#000000] opacity-60">
                {currentTime}
              </span>
            </div>
            {/* User Chat Text */}
            <p className="text-[14px] font-passenger font-normal text-[#000000] leading-relaxed mt-1">
              {text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
