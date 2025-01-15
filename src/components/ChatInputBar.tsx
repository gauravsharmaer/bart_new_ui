// import React, { useState, useEffect, useRef } from "react";
// import arrowIcon from "../assets/arrow-up-right.png";
// import { ChatInputBarProps } from "../props/Props";
// import { Mic, MicOff } from "lucide-react";
// import {
//   startSpeechRecognition,
//   stopSpeechRecognition,
// } from "../utils/chatUtils";

// const ChatInputBar: React.FC<ChatInputBarProps> = ({
//   onSubmit,
//   loading = false,
// }) => {
//   const [inputMessage, setInputMessage] = useState("");
//   const [isListening, setIsListening] = useState(false);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   const adjustTextareaHeight = () => {
//     const textarea = textareaRef.current;
//     if (textarea) {
//       textarea.style.height = "40px"; // Reset height to recalculate
//       const scrollHeight = textarea.scrollHeight;
//       textarea.style.height = `${Math.min(Math.max(40, scrollHeight), 200)}px`; // Min 40px, Max 200px
//     }
//   };

//   useEffect(() => {
//     adjustTextareaHeight();
//   }, [inputMessage]);

//   const handleSpeechInput = () => {
//     if (isListening) {
//       stopSpeechRecognition();
//       setIsListening(false);
//     } else {
//       const started = startSpeechRecognition(
//         (text) => {
//           setInputMessage(text);
//         },
//         () => {
//           setIsListening(false);
//         }
//       );
//       if (started) {
//         setIsListening(true);
//       }
//     }
//   };

//   const submitMessage = () => {
//     if (!inputMessage.trim()) return;
//     onSubmit(inputMessage);
//     setInputMessage("");
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       submitMessage();
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     submitMessage();
//   };

//   return (
//     <form onSubmit={handleSubmit} className="relative mb-5">
//       <div className="flex items-center p-1 bg-white rounded-[15px] mx-[-15px] mb-10 border border-gray-200">
//         <div className="w-14 h-10 flex justify-center items-center bg-[#f9f9f9] shadow-[inset_0_0_1px_rgba(128,128,128,0.5)] rounded-[10px]">
//           <button
//             type="button"
//             onClick={handleSpeechInput}
//             className={`relative p-2 rounded-full transition-colors ${
//               isListening ? "text-red-500" : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             {isListening ? (
//               <MicOff className="w-5 h-5" />
//             ) : (
//               <Mic className="w-5 h-5" />
//             )}
//           </button>
//         </div>

//         <textarea
//           ref={textareaRef}
//           value={inputMessage}
//           onChange={(e) => setInputMessage(e.target.value)}
//           onKeyDown={handleKeyDown}
//           rows={1}
//           placeholder={isListening ? "Listening..." : "Type a message..."}
//           className="flex-1 min-h-[40px] px-4 text-base border-none bg-transparent outline-none resize-none py-2 overflow-y-auto
//           [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
//           style={{ lineHeight: "1.5" }}
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-12 h-10 flex justify-center items-center bg-[#f9f9f9] shadow-[inset_0_0_1px_rgba(128,128,128,0.5)] rounded-[10px]"
//         >
//           <img src={arrowIcon} alt="Submit" className="w-6 h-6" />
//         </button>
//       </div>
//     </form>
//   );
// };

// export default ChatInputBar;

import React, { useState, useEffect, useRef } from "react";
import arrowIcon from "../assets/arrow-up-right.png";
import { ChatInputBarProps } from "../props/Props";
import { Mic, MicOff } from "lucide-react";
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
        setVoiceInput(text);
        setInputMessage(text);
      },
      () => {
        // Only handle unexpected endings here
        if (isListening) {
          setIsListening(false);
          setShowVoiceCard(false);
        }
      }
    );
    if (started) {
      setIsListening(true);
      // Automatically close the VoiceChatCard after 3 seconds
      setTimeout(() => {
        stopSpeechRecognition();
        setIsListening(false);
        setShowVoiceCard(false);
      }, 3000);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage();
  };

  return (
    <div className="relative">
      <div className={showVoiceCard ? "blur-background" : ""}>
        <form onSubmit={handleSubmit} className="relative mb-5">
          <div className="flex items-center p-1 bg-white rounded-[15px] mx-[-15px] mb-10 border border-gray-200">
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
      {showVoiceCard && <VoiceChatCard text={voiceInput} />}
    </div>
  );
};

export default ChatInputBar;
