'use client';

import avatar from '../../assets/avatar.gif';

interface VoiceChatCardProps {
  text: string;
}

export default function VoiceChatCard({ text = "" }: VoiceChatCardProps) {
  return (
    <div className="bg-white rounded-[32px] p-8 max-w-md w-[350px] h-[350px] mx-auto shadow-lg">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-24 h-24">
          {/* Gradient glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-20 blur-md animate-pulse" />
          
          {/* Avatar image */}
          <div className="relative w-full h-full bg-[#1E1E2E] rounded-full flex items-center justify-center overflow-hidden">
            <img src={avatar} alt="BART Genie" className="w-full h-full object-cover" />
          </div>
        </div>
        
        <p className="text-center text-[#4A4A4A] text-xl font-medium max-w-sm">
          {text || "Listening..."}
        </p>
      </div>
    </div>
  );
}