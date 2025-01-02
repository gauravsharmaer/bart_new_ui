// import React, { useEffect, useRef } from "react";
// import { NotificationProps } from "./Interface/Interface";

// const Notification: React.FC<NotificationProps> = ({ isOpen, onClose }) => {
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(event.target as Node)
//       ) {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen, onClose]);

//   return (
//     <>
//       <div
//         className={`fixed top-0 left-0 w-full h-full bg-black/40 z-[999] ${
//           isOpen ? "block" : "hidden"
//         }`}
//       />
//       <div
//         ref={containerRef}
//         className={`w-[367px] h-[734px] ${
//           isOpen ? "flex" : "hidden"
//         } flex-col bg-white shadow-md z-[1000] rounded-[40px] overflow-hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
//       >
//         <button
//           className="absolute top-4 right-4 bg-transparent border-none text-lg cursor-pointer"
//           onClick={onClose}
//         >
//           ✕
//         </button>
//         <div className="p-6 border-b border-gray-200 relative">
//           <button
//             className="absolute left-6 top-[16%] -translate-y-1/2 cursor-pointer text-3xl border-none bg-transparent p-0 flex items-center text-gray-700"
//             onClick={onClose}
//           >
//             ←
//           </button>
//           <div className="ml-6">
//             <h2 className="m-0 px-2 text-lg font-bold">Your Notification</h2>
//             <p className="mt-1 mb-4 text-sm text-gray-500">
//               Get timely updates and alerts when you need them most.
//             </p>
//             <div className="flex justify-center gap-4 mb-4">
//               <div className="px-5 py-1.5 rounded-full text-sm font-medium cursor-pointer bg-white text-black">
//                 All
//               </div>
//               <div className="px-5 py-1.5 rounded-full text-sm font-medium cursor-pointer bg-gray-100 text-gray-500">
//                 Unread
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="p-4 overflow-y-auto flex-1">
//           <div className="flex items-start pb-4 mb-4 border-b border-gray-200">
//             <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-sm text-white mr-4">
//               DR
//             </div>
//             <div className="flex-1 text-sm">
//               <div className="flex justify-between items-center mb-1.5">
//                 <h3 className="text-sm font-bold m-0">
//                   Update on password recovery
//                 </h3>
//                 <span className="text-xs text-gray-500">Just now</span>
//               </div>
//               <p>
//                 Darlene has updated your password, see detail on{" "}
//                 <a href="#" className="text-blue-500 hover:underline">
//                   timeline
//                 </a>
//                 .
//               </p>
//             </div>
//           </div>
//           <div className="flex items-start pb-4 mb-4 border-b border-gray-200">
//             <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-sm text-white mr-4">
//               DR
//             </div>
//             <div className="flex-1 text-sm">
//               <div className="flex justify-between items-center mb-1.5">
//                 <h3 className="text-sm font-bold m-0">Laptop Recovery</h3>
//                 <span className="text-xs text-gray-500">2 days ago</span>
//               </div>
//               <p>
//                 Your "request for new laptop" chat is closed. If your problem is
//                 not resolved{" "}
//                 <a href="#" className="text-blue-500 hover:underline">
//                   click here
//                 </a>
//                 .
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Notification;

import React, { useEffect, useRef, useState } from "react";
import { NotificationProps } from "../../props/Props";

const Notification: React.FC<NotificationProps> = ({ isOpen, onClose }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const notifications = [
    {
      id: 1,
      title: "Update on password recovery",
      description: "Darlene has updated your password, see detail on timeline.",
      timestamp: "Just now",
      unread: true,
    },
    {
      id: 2,
      title: "Laptop Recovery",
      description:
        'Your "request for new laptop" chat is closed. If your problem is not resolved click here.',
      timestamp: "2 day ago",
      unread: false,
    },
  ];

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((notification) => notification.unread);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Blur Background */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-[999] ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={onClose}
      />
      {/* Notification Sidebar */}
      <div
        ref={containerRef}
        className={`w-[390px] h-screen bg-white shadow-md z-[1000] rounded-l-3xl overflow-hidden absolute right-0 transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-[#DDE0E4] relative">
          <button
            className="absolute left-6 top-5.5 text-[#000000] text-2xl"
            onClick={onClose}
          >
            ←
          </button>
          <div className="ml-8">
            <h2 className="text-xl font-semibold text-black">
              Your Notification
            </h2>
            <p className="text-sm text-[rgba(0,0,0,1)] mt-1">
              Get timely updates and alerts when you need them most.
            </p>
          </div>

          <div className="mt-6 px-2">
            <div className="bg-gray-50 p-1 rounded-lg flex gap-1 w-[170px]">
              <button
                className={`relative flex-1 px-4 py-2 text-sm rounded-lg transition-all ${
                  filter === "all"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500"
                }`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={`relative flex-1 px-4 py-2 text-sm rounded-lg transition-all ${
                  filter === "unread"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500"
                }`}
                onClick={() => setFilter("unread")}
              >
                Unread
                {notifications.filter((notification) => notification.unread)
                  .length > 0 && (
                  <span className="ml-1 bg-[#EF613C] text-white text-xs px-2 py-0.5 rounded-sm">
                    {
                      notifications.filter(
                        (notification) => notification.unread
                      ).length
                    }
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          {filteredNotifications.map((notification, index) => (
            <div key={notification.id}>
              <div className="py-4 flex items-start">
                <div className="w-10 h-10 rounded-full bg-[#EF613C] flex items-center justify-center text-sm text-white">
                  DR
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`font-medium ${
                        notification.unread
                          ? "text-[#000000]"
                          : "text-[#000000]"
                      }`}
                    >
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {notification.timestamp}
                    </span>
                  </div>
                  <p className="text-[#050505] text-sm">
                    {notification.description.includes("timeline") ? (
                      <>
                        Darlene has updated your password, see detail on{" "}
                        <a
                          href="#"
                          className="text-blue-500 border-b border-dotted border-blue-500"
                        >
                          timeline
                        </a>
                        .
                      </>
                    ) : (
                      <>
                        Your "request for new laptop" chat is closed. If your
                        problem is not resolved{" "}
                        <a
                          href="#"
                          className="text-blue-500 border-b border-dotted border-blue-500"
                        >
                          click here
                        </a>
                        .
                      </>
                    )}
                  </p>
                </div>
              </div>
              {index < filteredNotifications.length - 1 && (
                <div className="border-b border-[#DDE0E4]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Notification;
