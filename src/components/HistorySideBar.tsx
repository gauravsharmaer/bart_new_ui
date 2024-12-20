// import React, { useState, useEffect } from "react";
// import VerifyMailCard from "../components/ui/VerifyMailCard";
// import { getUserChats, chatHistory } from "../Api/CommonApi";

// interface HistorySideBarProps {
//   onChatSelect: (chatId: string) => void;
// }

// const HistorySideBar: React.FC<HistorySideBarProps> = ({ onChatSelect }) => {
//   const [chatHistory, setChatHistory] = useState<
//     (chatHistory & { status?: string; timestamp?: string })[]
//   >([]);

//   useEffect(() => {
//     const fetchChatHistory = async () => {
//       try {
//         const data = await getUserChats();

//         // Add static tags to chats
//         let dayCounter = 1;
//         const updatedData = data.map((chat, index) => {
//           if (index === 0) {
//             return {
//               ...chat,
//               status: "", // First current chat will have blank status
//             };
//           } else if (chat.name.startsWith("Hey") || chat.name.includes("h")) {
//             return {
//               ...chat,
//               status: "Resolved", // Add "Resolved" for other chats starting with "Hey" or containing "h"
//             };
//           } else if ([1, 2, 5, 6].includes(index)) {
//             return { ...chat, status: "Ticket raised" }; // Specific indices get "Ticket raised"
//           } else {
//             const timestamp = `${dayCounter} day${dayCounter > 1 ? "s" : ""} ago`;
//             dayCounter++;
//             return { ...chat, timestamp }; // Other chats get sequential timestamps
//           }
//         });

//         setChatHistory(updatedData);
//       } catch (error) {
//         console.error("Error fetching chat history:", error);
//       }
//     };

//     fetchChatHistory();
//   }, []);

//   return (
//     <aside className="bg-white border-r border-gray-200 p-4 flex flex-col justify-between h-screen">
//       <div className="overflow-y-auto"
//        style={{
//         scrollbarWidth: "none", // Hides scrollbar in Firefox
//         msOverflowStyle: "none", // Hides scrollbar in IE and Edge
//       }}>
//          <style>
//           {`
//             /* Hides scrollbar in WebKit-based browsers */
//             div::-webkit-scrollbar {
//               display: none;
//             }
//           `}
//         </style>
//         {chatHistory.map((chat) => (
//           <div
//             key={chat.id}
//             className={`text-[#000000] opacity-85 cursor-pointer p-2 rounded font-medium flex items-center justify-between ${
//               chat.isActive ? "shadow-md bg-[#f3f5f9]" : "hover:bg-[#f3f5f9]"
//             }`}
//           >
//             <span onClick={() => onChatSelect(chat.id)}>{chat.name}</span>

//             <div className="flex items-center gap-2">
//               {/* Add status */}
//               {chat.status && (
//                 <span
//                   className={`text-xs py-1 px-2 rounded-md font-medium ${
//                     chat.status === "Resolved"
//                       ? "bg-[#DEF3C1] text-[#385C25]"
//                       : "bg-[#ECE4FF] text-[#5232A0]"
//                   }`}
//                 >
//                   {chat.status}
//                 </span>
//               )}
//               {/* Add timestamp */}
//               {chat.timestamp && (
//                 <span className="text-xs text-[#FF5600]">{chat.timestamp}</span>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="mt-auto w-full">
//         <VerifyMailCard />
//       </div>
//     </aside>
//   );
// };

// export default HistorySideBar;

// ChatSidebar.tsx
import React, { useState, useEffect } from "react";
// import VerifyMailCard from "../components/ui/VerifyMailCard";
import { getUserChats, chatHistory } from "../Api/CommonApi";

interface HistorySideBarProps {
  onChatSelect: (chatId: string) => void;
}

const HistorySideBar: React.FC<HistorySideBarProps> = ({ onChatSelect }) => {
  const [chatHistory, setChatHistory] = useState<chatHistory[]>([]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const data = await getUserChats();
        setChatHistory(data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, []);
  return (
    <aside className=" bg-white border-r border-gray-200 p-4 flex flex-col justify-between h-screen">
      <div className="overflow-y-auto">
        {chatHistory.map((chat) => (
          <p
            key={chat.id}
            className="text-black opacity-150 cursor-pointer hover:bg-[#f3f5f9] p-2 rounded font-medium"
            onClick={() => onChatSelect(chat.id)}
          >
            {chat.name}
          </p>
        ))}
      </div>
      {/* <ul className="list-none p-0 m-0 overflow-y-auto">
        <li className="p-3 text-base text-gray-700 cursor-pointer rounded-lg bg-gray-100 font-bold">
          My password reset
        </li>
        <li className="p-3 text-base text-gray-700 cursor-pointer rounded-lg hover:bg-gray-50">
          How to connect wifi?{" "}
          <span className="float-right text-xs py-1 px-2 rounded-lg bg-purple-100 text-purple-600 font-medium">
            Ticket raised
          </span>
        </li>
        <li className="p-3 text-base text-gray-700 cursor-pointer rounded-lg hover:bg-gray-50">
          Requested new laptop{" "}
          <span className="float-right text-xs py-1 px-2 rounded-lg bg-green-100 text-green-500 font-medium">
            Resolved
          </span>
        </li>
        <li className="p-3 text-base text-gray-700 cursor-pointer rounded-lg hover:bg-gray-50">
          HP Printer Setup Help{" "}
          <span className="float-right text-xs text-orange-500">
            2 days ago
          </span>
        </li>
        <li className="p-3 text-base text-gray-700 cursor-pointer rounded-lg hover:bg-gray-50">
          What is the update on my...{" "}
          <span className="float-right text-xs text-orange-500">
            2 days ago
          </span>
        </li>
      </ul> */}
      {/* <div className="mt-auto w-full">
        <VerifyMailCard />
      </div> */}
    </aside>
  );
};

export default HistorySideBar;
