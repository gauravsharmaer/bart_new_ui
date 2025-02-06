import React from "react";
import VoicesIcon from "../assets/Voices.svg";
import { VOICE_OPTIONS } from "../redux/features/avatarSlice";

interface VoiceOptionsProps {
  showVoiceOptions: boolean;
  handleVoiceIconClick: (voiceIndex: number) => void;
  setShowVoiceOptions: (show: boolean) => void;
}

const VoiceOptions: React.FC<VoiceOptionsProps> = ({
  showVoiceOptions,
  handleVoiceIconClick,
  setShowVoiceOptions,
}) => {
  return (
    showVoiceOptions && (
      <div className="absolute z-50 top-[-55px] -left-11">
        <div className="relative group">
          <img
            src={VoicesIcon}
            alt="Voice Options"
            className="w-60 h-60 object-contain hover:opacity-90 transition-opacity cursor-pointer"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const width = rect.width;
              const position = x / width;

              const tooltips = document.querySelectorAll(".voice-tooltip");
              tooltips.forEach(
                (tooltip) => ((tooltip as HTMLElement).style.opacity = "0")
              );

              if (position < 0.33) {
                const tooltip = document.querySelector(
                  ".voice-tooltip-1"
                ) as HTMLElement;
                if (tooltip) tooltip.style.opacity = "1";
              } else if (position < 0.66) {
                const tooltip = document.querySelector(
                  ".voice-tooltip-2"
                ) as HTMLElement;
                if (tooltip) tooltip.style.opacity = "1";
              } else {
                const tooltip = document.querySelector(
                  ".voice-tooltip-3"
                ) as HTMLElement;
                if (tooltip) tooltip.style.opacity = "1";
              }
            }}
            onMouseLeave={() => {
              const tooltips = document.querySelectorAll(".voice-tooltip");
              tooltips.forEach(
                (tooltip) => ((tooltip as HTMLElement).style.opacity = "0")
              );
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const width = rect.width;
              const position = x / width;

              if (position < 0.33) {
                handleVoiceIconClick(0);
              } else if (position < 0.66) {
                handleVoiceIconClick(1);
              } else {
                handleVoiceIconClick(2);
              }
            }}
          />
          <div className="absolute bottom-[75px] -left-7 right-0 flex justify-between px-[34px] py-[10px] w-[144px]">
            <div className="voice-tooltip voice-tooltip-1 opacity-0 transition-opacity duration-200 text-xs text-white bg-[#2a292e] rounded-xl px-2 py-1 whitespace-nowrap absolute -right-[139px] -translate-x-full">
              {VOICE_OPTIONS[0].name}
            </div>
            <div className="voice-tooltip voice-tooltip-2 opacity-0 transition-opacity duration-200 text-xs text-white bg-[#2a292e] rounded-xl px-2 py-1 whitespace-nowrap absolute -right-32 -translate-x-full">
              {VOICE_OPTIONS[1].name}
            </div>
            <div className="voice-tooltip voice-tooltip-3 opacity-0 transition-opacity duration-200 text-xs text-white bg-[#2a292e] rounded-xl px-2 py-1 whitespace-nowrap absolute -right-[90px] ">
              {VOICE_OPTIONS[2].name}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default VoiceOptions;
