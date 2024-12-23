import React from "react";
import profileicon from "../../assets/profile.svg"; // Import the profile icon
import { formatName } from "../../utils/NameFormatter";

interface UserCardProps {
  name: string;
  text: string;
}

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
      <div className="bg-gray-100 shadow rounded-lg flex items-start gap-4 max-w-md w-auto p-4">
        {/* Profile Icon */}
        <div className="w-10 h-10 flex-shrink-0">
          <img
            src={profileicon}
            alt={`${formattedName}'s avatar`}
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        {/* Message Content */}
        <div className="flex-grow">
          <div className="flex items-center gap-1 mb-1">
            {/* User Name */}
            <span
              className="text-[12px]"
              style={{ color: "#000000" }}
            >
              {formattedName}
            </span>
            {/* Centered Dot */}
            <span className="text-[12px] text-gray-500">•</span>
            {/* Timestamp */}
            <span className="text-[12px] text-gray-500">{currentTime}</span>
          </div>
          {/* User Chat Text */}
          <p
            className="text-[14px] font-semibold leading-relaxed mt-1"
            style={{ color: "#000000" }}
          >
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;