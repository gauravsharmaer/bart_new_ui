//chatmessage
import React, { useState, useCallback } from "react";
import ChatLogo from "../assets/Genie.svg";
import VerifyAuth from "../pages/Home/verifyAuth";
import { askBart, verifyOTP } from "../Api/CommonApi";
import OtpInputCard from "./ui/OtpInputCard";
// import { speakText, stopSpeaking, createTimestamp } from "../utils/chatUtils";
import {
  createTimestamp,
  handleTextToAvatarConversion,
} from "../utils/chatUtils";
import { toast } from "react-toastify";
import ChatButtonCard from "./ui/ChatButtonCard";
import UserCard from "./ui/UserCard";
import TicketCard from "./ui/ticketcard";
import { ChatMessageProps } from "../props/Props";
// import { Message } from "../Interface/Interface";
import { ThumbsUp, ThumbsDown, Copy, Check } from "lucide-react";
import { SpeakerHigh } from "@phosphor-icons/react";
import TypingEffect from "./TypingEffect";
import createMarkup from "../utils/chatUtils";
import { createBotMessage, createUserMessage } from "../utils/chatFields";
import { useGetAvatarMutation, getAvatarCacheKey } from "../redux/features/avatarSlice";
// Add these helper functions at the top of the component

// const createBotMessage = (result: any): Message => ({
//   text: result.answer || "No response received",
//   isUserMessage: false,
//   timestamp: createTimestamp(),
//   button_display: result.display_settings?.button_display || false,
//   number_of_buttons: result.display_settings?.options?.buttons?.length || 0,
//   button_text: result.display_settings?.options?.buttons || [],
//   ticket: result.display_settings?.ticket || false,
//   ticket_options: result.display_settings?.options?.ticket_options || {},
//   history_id: result.display_settings?.message_history[0]?.history_id,
//   like: result.display_settings?.message_history[0]?.like,
//   un_like: result.display_settings?.message_history[0]?.un_like,
// });

// const createUserMessage = (text: string): Message => ({
//   text,
//   isUserMessage: true,
//   timestamp: createTimestamp(),
//   button_display: false,
//   number_of_buttons: 0,
//   button_text: [],
//   ticket: false,
// });



const ChatMessage: React.FC<ChatMessageProps> = React.memo(
  ({ message, onNewMessage, onLike, onDislike }) => {
    const [showAuthVideoCard, setShowAuthVideoCard] = useState(false);
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [clickedButton, setClickedButton] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    // const [isSpeaking, setIsSpeaking] = useState(false);
    // const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    //   // null
    // );
    // const [isPaused, setIsPaused] = useState(false);
    // const messageId = message.history_id || message.timestamp;
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [getAvatar] = useGetAvatarMutation();

    // Clean up speech synthesis when component unmounts
    // React.useEffect(() => {
    //   return () => {
    //     if (utterance) {
    //       window.speechSynthesis.cancel();
    //     }
    //   };
    // }, [utterance]);

    // Add resetSpeakingState function
    // const resetSpeakingState = useCallback(() => {
    //   setIsSpeaking(false);
    //   setIsPaused(false);
    //   setUtterance(null);
    // }, []);

    // Register this component as active when mounted
    // React.useEffect(() => {
    //   setActiveMessageComponent({ resetSpeakingState });
    //   return () => {
    //     if (getCurrentSpeakingMessageId() === messageId) {
    //       cancelSpeaking();
    //     }
    //   };
    // }, [messageId, resetSpeakingState]);

    // React.useEffect(() => {
    //   // Cleanup function for component unmount and page refresh
    //   return () => {
    //     if (utterance) {
    //       window.speechSynthesis.cancel();
    //       resetSpeakingState();
    //     }
    //   };
    // }, [utterance, resetSpeakingState]);

    const handleVerificationComplete = useCallback(async () => {
      setShowAuthVideoCard(false);

      try {
        onNewMessage(createUserMessage("Facial Recognition Verified"));

        const result = await askBart({
          question: "verified_success",
          user_id: localStorage.getItem("user_id") || "",
          chat_id: localStorage.getItem("chat_id") || "",
        });
        localStorage.setItem("chat_id", result.chat_id);

        onNewMessage(createBotMessage(result));
      } catch (error) {
        console.error("API Error:", error);
      }
    }, [onNewMessage]);

    const handleButtonClick = async (button: string) => {
      setClickedButton(button);
      if (button.toLowerCase() === "facial recognition") {
        setShowAuthVideoCard(true);
        return;
      }

      onNewMessage(createUserMessage(button));

      try {
        const result = await askBart({
          question: button,
          user_id: localStorage.getItem("user_id") || "",
          chat_id: localStorage.getItem("chat_id") || "",
        });
        localStorage.setItem("chat_id", result.chat_id);

        onNewMessage(createBotMessage(result));
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    const handleOtpSubmit = async (otpString: string) => {
      try {
        onNewMessage(createUserMessage("Done"));

        const result = await verifyOTP({
          otp: parseInt(otpString),
          email: localStorage.getItem("email") || "",
          chat_id: localStorage.getItem("chat_id") || "",
        });

        onNewMessage(createBotMessage(result));
      } catch (error) {
        onNewMessage({
          text: error instanceof Error ? error.message : "OTP verification failed",
          isUserMessage: false,
          timestamp: createTimestamp(),
          button_display: false,
          number_of_buttons: 0,
          button_text: [],
          ticket: false,
        });
      }
    };

    const handleSpeak = async () => {
      try {
        setIsLoading(true);
        const cleanText = message.text.replace(/<[^>]*>/g, "")
          .replace(/\[(.*?)\]\(.*?\)/g, "$1")
          .replace(/https?:\/\/\S+/g, "")
          .trim();
          
        // Check if we already have a cached response
        const cacheKey = getAvatarCacheKey(cleanText);
        const cachedResponse = localStorage.getItem(cacheKey);
        
        if (cachedResponse) {
          setVideoUrl(JSON.parse(cachedResponse).output.output_video);
          setIsLoading(false);
          return;
        }

        const url = await handleTextToAvatarConversion(
          message.text,
          async (text) => {
            const response = await getAvatar(text).unwrap();
            // Cache the response
            localStorage.setItem(cacheKey, JSON.stringify(response));
            return response;
          }
        );
        
        console.log("Video URL:", url);
        if (url) {
          setVideoUrl(url);
        }
      } catch (error) {
        console.error("Error converting text to avatar:", error);
        toast.error("Failed to generate avatar video");
      } finally {
        setIsLoading(false);
      }
    };

    const handleCopy = async () => {
      try {
        // Create a temporary div to handle HTML content
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = message.text;
        // Get text content without HTML tags
        const textToCopy = tempDiv.textContent || tempDiv.innerText || "";
        await navigator.clipboard.writeText(textToCopy);
        setIsCopied(true);
        toast.success("Text copied to clipboard");

        // Reset back to copy icon after 2 seconds
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      } catch (error) {
        console.error("Failed to copy text:", error);
      }
    };

    console.log("Message data:", {
      ticket: message.ticket,
      ticket_options: message.ticket_options,
    });

    return (
      <div
        className={`flex ${
          message.isUserMessage ? "justify-end" : "justify-start"
        } mb-4`}
      >
        {message.isUserMessage ? (
          <UserCard
            name={localStorage.getItem("name") || "User"}
            text={message.text}
          />
        ) : (
          <div className="flex items-start w-full">
            <img
              src={ChatLogo}
              alt="BART Genie"
              className="w-8 h-8 rounded-full object-cover mx-2 dark:opacity-90"
            />
            <div className="flex-1">
              <div className="flex items-center justify-start">
                <span className="text-[14px] font-passenger font-light text-gray-900 dark:text-black mr-2 transition-colors duration-200">
                  BART Genie
                </span>
                <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-1"></span>
                <span className="text-[12px] font-passenger font-light text-gray-600 dark:text-black/70 transition-colors duration-200">
                  {(() => {
                    try {
                      const date = new Date(message.timestamp);
                      return date.toLocaleString();
                    } catch {
                      return "Invalid date";
                    }
                  })()}
                </span>
              </div>
              <div className="flex mt-2">
                {(message.button_display ||
                  message.text.includes("verification code")) && (
                  <div
                    className="w-1 h-auto mr-2 bg-purple-600 dark:bg-purple-500 rounded-sm transition-colors duration-200"
                  ></div>
                )}
                <div className="flex-1">
                  <div className="flex-1">
                    {message.isFromHistory ? (
                      <div
                        className="text-sm text-gray-800 dark:text-black font-passenger transition-colors duration-200"
                        dangerouslySetInnerHTML={createMarkup(message.text)}
                      />
                    ) : (
                      <TypingEffect text={message.text} speed={1} />
                    )}
                  </div>

                  {message.text.includes("verification code") && (
                    <OtpInputCard
                      onSubmitOTP={(otpString) => handleOtpSubmit(otpString)}
                      otp={otp}
                      setOtp={setOtp}
                    />
                  )}
                  {message.button_display &&
                    !message.text.includes("verification code") && (
                      <ChatButtonCard
                        buttons={message.button_text}
                        onButtonClick={handleButtonClick}
                        clickedButton={clickedButton}
                      />
                    )}
                  {message.ticket && message.ticket_options && (
                    <TicketCard
                      name={message.ticket_options.name}
                      description={message.ticket_options.description}
                      ticket_id={message.ticket_options.ticket_id}
                      assignee_name={message.ticket_options.assignee_name}
                      ticket_link={message.ticket_options.link}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {showAuthVideoCard && (
          <div className="fixed inset-0 bg-black/80 dark:bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative w-[500px] bg-white dark:bg-[#2c2d32] rounded-3xl p-4 shadow-lg dark:shadow-[#1a1b1e]">
              <button
                onClick={() => setShowAuthVideoCard(false)}
                className="absolute top-1 right-4 text-xl text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                aria-label="Close modal"
              >
                x
              </button>
              <div className="rounded-lg p-6">
                <div className="flex flex-col items-center">
                  <VerifyAuth onVerificationComplete={handleVerificationComplete} />
                </div>
              </div>
            </div>
          </div>
        )}

        {!message.isUserMessage && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <button
              className={`p-1 rounded transition-colors hover:bg-gray-100 dark:hover:bg-[#3a3b40]
                ${message.like ? "text-green-600 dark:text-green-500" : ""}`}
              onClick={() => onLike(message.history_id || "")}
              aria-label="Like message"
            >
              <ThumbsUp size={16} />
            </button>
            <button
              className={`p-1 rounded transition-colors hover:bg-gray-100 dark:hover:bg-[#3a3b40]
                ${message.un_like ? "text-red-600 dark:text-red-500" : ""}`}
              onClick={() => onDislike(message.history_id || "")}
              aria-label="Dislike message"
            >
              <ThumbsDown size={16} />
            </button>
            <button
              className="p-1 rounded transition-colors hover:bg-gray-100 dark:hover:bg-[#3a3b40]"
              onClick={handleSpeak}
            >
              <SpeakerHigh size={16} />
            </button>
            <button
              className="p-1 rounded transition-colors hover:bg-gray-100 dark:hover:bg-[#3a3b40]"
              onClick={handleCopy}
            >
              {isCopied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        )}

        {isLoading && (
          <div className="fixed inset-0 bg-black/80 dark:bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative w-[500px] bg-white dark:bg-[#2c2d32] rounded-3xl p-4 shadow-lg dark:shadow-[#1a1b1e]">
              <div className="rounded-lg p-6">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600 dark:border-purple-500"></div>
                  <p className="text-gray-900 dark:text-black mt-4 transition-colors duration-200">
                    Generating avatar video...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && videoUrl && (
          <div className="fixed inset-0 bg-black/80 dark:bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative w-[500px] bg-white dark:bg-[#2c2d32] rounded-3xl p-4 shadow-lg dark:shadow-[#1a1b1e]">
              <button
                onClick={() => setVideoUrl(null)}
                className="absolute top-1 right-4 text-xl text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                aria-label="Close modal"
              >
                x
              </button>
              <div className="rounded-lg p-6">
                <div className="flex flex-col items-center">
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    className="rounded-lg w-full"
                    onEnded={() => setVideoUrl(null)}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default ChatMessage;
