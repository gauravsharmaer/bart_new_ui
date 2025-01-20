"use client";

import { X } from "lucide-react";
import avatar from "../assets/avatar.gif";

interface VoiceChatCardProps {
  text: string;
  onClose: () => void;
}

export default function VoiceChatCard({
  text = "",
  onClose,
}: VoiceChatCardProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-90 bg-black/30">
      <div className="relative bg-white rounded-[32px] p-8 max-w-md w-[350px] h-[350px] shadow-lg flex flex-col items-center justify-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Avatar Container */}
        <div className="mb-6">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Gradient glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-20 blur-md animate-pulse" />

            {/* Avatar image */}
            <div className="relative w-full h-full bg-[#1E1E2E] rounded-full flex items-center justify-center overflow-hidden">
              <img
                src={avatar}
                alt="BART Genie"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Text Container */}
        <p className="text-center text-[#4A4A4A] text-2xl font-medium">
          {text || "Listening..."}
        </p>
      </div>
    </div>
  );
}
