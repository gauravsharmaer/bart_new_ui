import React, { useState, useEffect, useRef } from "react";
import arrowIcon from "../assets/arrow-up-right.png";
import { Mic, MicOff, FileText, Plus } from "lucide-react";
import {
  startSpeechRecognition,
  stopSpeechRecognition,
} from "../utils/chatUtils";
import VoiceChatCard from "./VoiceChatCard";

interface InputBarProps {
  onSubmit: (message: string) => void;
  onFileUpload?: (file: File) => void;
  loading?: boolean;
  enableVoiceInput?: boolean;
  enableFileUpload?: boolean;
}

const InputBar: React.FC<InputBarProps> = ({
  onSubmit,
  onFileUpload,
  loading = false,
  enableVoiceInput = false,
  enableFileUpload = false,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showVoiceCard, setShowVoiceCard] = useState(false);
  const [voiceInput, setVoiceInput] = useState("");
  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastSpeechRef = useRef<number>(Date.now());

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "40px";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(Math.max(40, scrollHeight), 200)}px`;
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
    if (isListening) {
      stopSpeechRecognition();
      setIsListening(false);
      setShowVoiceCard(false);
      return;
    }

    setVoiceInput("");
    setShowVoiceCard(true);

    const started = startSpeechRecognition(
      (text) => {
        lastSpeechRef.current = Date.now();
        if (silenceTimer) clearTimeout(silenceTimer);

        const timer = setTimeout(() => {
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

    if (started) setIsListening(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf" && onFileUpload) {
      onFileUpload(file);
    }
  };

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

  return (
    <div className="relative">
      <div className={showVoiceCard ? "blur-background" : ""}>
        <form onSubmit={(e) => { e.preventDefault(); submitMessage(); }} className="relative">
          <div className="flex items-center gap-2 p-2 bg-white rounded-[15px] border border-gray-200">
            {enableFileUpload && (
              <div className="flex gap-2">
                <button
                  type="button"
                  className="w-14 h-10 flex items-center justify-center bg-[#f9f9f9] shadow-[inset_0_0_1px_rgba(128,128,128,0.5)] rounded-[10px] hover:bg-gray-100"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="w-14 h-10 flex items-center justify-center bg-[#f9f9f9] shadow-[inset_0_0_1px_rgba(128,128,128,0.5)] rounded-[10px] hover:bg-gray-100"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileText className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileUpload}
                />
              </div>
            )}

            {enableVoiceInput && (
              <button
                type="button"
                onClick={handleSpeechInput}
                className={`w-14 h-10 flex items-center justify-center bg-[#f9f9f9] shadow-[inset_0_0_1px_rgba(128,128,128,0.5)] rounded-[10px] ${
                  isListening ? "text-red-500" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}

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
              className="w-12 h-10 flex items-center justify-center bg-[#f9f9f9] shadow-[inset_0_0_1px_rgba(128,128,128,0.5)] rounded-[10px] hover:bg-gray-100"
            >
              <img src={arrowIcon} alt="Send" className="w-6 h-6" />
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

export default InputBar;
