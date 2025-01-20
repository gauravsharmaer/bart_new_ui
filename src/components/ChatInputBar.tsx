import React, { useState, useEffect, useRef } from "react";
import arrowIcon from "../assets/arrow-up-right.png";
import { ChatInputBarProps } from "../props/Props";
import { Mic, MicOff, FileText } from "lucide-react";
import {
  startSpeechRecognition,
  stopSpeechRecognition,
} from "../utils/chatUtils";
import VoiceChatCard from "../components/VoiceChatCard";

const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showVoiceCard, setShowVoiceCard] = useState(false);
  const [voiceInput, setVoiceInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null);
  const lastSpeechRef = useRef<number>(Date.now());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "40px"; // Reset height to recalculate
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(Math.max(40, scrollHeight), 200)}px`; // Min 40px, Max 200px
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputMessage]);

  useEffect(() => {
    if (!showVoiceCard && isListening) {
      stopSpeechRecognition();
      setIsListening(false);
    }
  }, [showVoiceCard, isListening]);

  const handleSpeechInput = () => {
    setVoiceInput(""); // Reset voice input for new session
    setShowVoiceCard(true);

    const started = startSpeechRecognition(
      (text) => {
        // Update last speech timestamp whenever we get new input
        lastSpeechRef.current = Date.now();

        // Clear any existing silence timer
        if (silenceTimer) {
          clearTimeout(silenceTimer);
        }

        // Set new silence timer
        const timer = setTimeout(() => {
          // If 3 seconds have passed since last speech
          if (Date.now() - lastSpeechRef.current >= 3000) {
            stopSpeechRecognition();
            setIsListening(false);
            setShowVoiceCard(false);
            setSilenceTimer(null);
          }
        }, 3000);

        setSilenceTimer(timer);
        setVoiceInput(text);
        setInputMessage(text);
      },
      () => {
        // Only handle unexpected endings here
        if (isListening) {
          setIsListening(false);
          setShowVoiceCard(false);
          if (silenceTimer) {
            clearTimeout(silenceTimer);
            setSilenceTimer(null);
          }
        }
      }
    );

    if (started) {
      setIsListening(true);
    }
  };

  // Cleanup effect for silence timer
  useEffect(() => {
    return () => {
      if (silenceTimer) {
        clearTimeout(silenceTimer);
      }
    };
  }, [silenceTimer]);

  const submitMessage = () => {
    if (!inputMessage.trim()) return;
    onSubmit(inputMessage);
    setInputMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage();
  };

  const handlePdfClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <div className={showVoiceCard ? "blur-background" : ""}>
        <form onSubmit={handleSubmit} className="relative mb-5">
          <div className="flex items-center p-1 bg-white rounded-[15px] mx-[-15px] mb-10 border border-gray-200">
            <div className="flex gap-2">
              <div className="w-14 h-10 flex justify-center items-center bg-[#f9f9f9] shadow-[inset_0_0_1px_rgba(128,128,128,0.5)] rounded-[10px]">
                <button
                  type="button"
                  onClick={handleSpeechInput}
                  className={`relative p-2 rounded-full transition-colors ${
                    isListening
                      ? "text-red-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="w-14 h-10 flex justify-center items-center bg-[#f9f9f9] shadow-[inset_0_0_1px_rgba(128,128,128,0.5)] rounded-[10px]">
                <button
                  type="button"
                  onClick={handlePdfClick}
                  className="relative p-2 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                >
                  <FileText className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Handle PDF file here
                      console.log("PDF file selected:", file);
                    }
                  }}
                />
              </div>
            </div>

            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder={isListening ? "Listening..." : "Type a message..."}
              className="flex-1 min-h-[40px] px-4 text-base border-none bg-transparent outline-none resize-none py-2 overflow-y-auto
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              style={{ lineHeight: "1.5" }}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-12 h-10 flex justify-center items-center bg-[#f9f9f9] shadow-[inset_0_0_1px_rgba(128,128,128,0.5)] rounded-[10px]"
            >
              <img src={arrowIcon} alt="Submit" className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>
      {showVoiceCard && (
        <VoiceChatCard
          text={voiceInput}
          onClose={() => {
            setShowVoiceCard(false);
            setIsListening(false);
            stopSpeechRecognition();
            if (silenceTimer) {
              clearTimeout(silenceTimer);
              setSilenceTimer(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default ChatInputBar;
