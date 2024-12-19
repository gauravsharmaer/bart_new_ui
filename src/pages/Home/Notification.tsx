import React, { useEffect, useRef } from "react";
import { NotificationProps } from "./Interface/Interface";

const Notification: React.FC<NotificationProps> = ({ isOpen, onClose }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

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
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black/40 z-[999] ${
          isOpen ? "block" : "hidden"
        }`}
      />
      <div
        ref={containerRef}
        className={`w-[367px] h-[734px] ${
          isOpen ? "flex" : "hidden"
        } flex-col bg-white shadow-md z-[1000] rounded-[40px] overflow-hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
      >
        <button
          className="absolute top-4 right-4 bg-transparent border-none text-lg cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="p-6 border-b border-gray-200 relative">
          <button
            className="absolute left-6 top-[16%] -translate-y-1/2 cursor-pointer text-3xl border-none bg-transparent p-0 flex items-center text-gray-700"
            onClick={onClose}
          >
            ←
          </button>
          <div className="ml-6">
            <h2 className="m-0 px-2 text-lg font-bold">Your Notification</h2>
            <p className="mt-1 mb-4 text-sm text-gray-500">
              Get timely updates and alerts when you need them most.
            </p>
            <div className="flex justify-center gap-4 mb-4">
              <div className="px-5 py-1.5 rounded-full text-sm font-medium cursor-pointer bg-white text-black">
                All
              </div>
              <div className="px-5 py-1.5 rounded-full text-sm font-medium cursor-pointer bg-gray-100 text-gray-500">
                Unread
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          <div className="flex items-start pb-4 mb-4 border-b border-gray-200">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-sm text-white mr-4">
              DR
            </div>
            <div className="flex-1 text-sm">
              <div className="flex justify-between items-center mb-1.5">
                <h3 className="text-sm font-bold m-0">
                  Update on password recovery
                </h3>
                <span className="text-xs text-gray-500">Just now</span>
              </div>
              <p>
                Darlene has updated your password, see detail on{" "}
                <a href="#" className="text-blue-500 hover:underline">
                  timeline
                </a>
                .
              </p>
            </div>
          </div>
          <div className="flex items-start pb-4 mb-4 border-b border-gray-200">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-sm text-white mr-4">
              DR
            </div>
            <div className="flex-1 text-sm">
              <div className="flex justify-between items-center mb-1.5">
                <h3 className="text-sm font-bold m-0">Laptop Recovery</h3>
                <span className="text-xs text-gray-500">2 days ago</span>
              </div>
              <p>
                Your "request for new laptop" chat is closed. If your problem is
                not resolved{" "}
                <a href="#" className="text-blue-500 hover:underline">
                  click here
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notification;
