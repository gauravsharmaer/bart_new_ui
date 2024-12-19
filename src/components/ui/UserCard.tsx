import React from "react";
// import genie from "../../assets/genie.svg";

interface UserCardProps {
  name: string;
  text: string;
}

const UserCard: React.FC<UserCardProps> = ({ name, text }) => {
  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex items-start my-2">
      <img
        src={"https://avatar.vercel.sh/jill"}
        alt={`${name}'s logo`}
        className="w-10 h-10 rounded-full mr-3"
      />
      <div className="bg-gray-100 rounded-xl p-3 ">
        <div className="flex items-center text-sm mb-2">
          <span className="font-bold text-blue-600 mr-2">{name}</span>
          <span className="text-gray-500 text-xs">{currentTime}</span>
        </div>
        <div className="text-sm text-gray-600">{text}</div>
      </div>
    </div>
  );
};

export default UserCard;
