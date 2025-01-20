import React, { useState, useCallback } from "react";
import ChatLogo from "../assets/Genie.svg";
import VerifyAuth from "../pages/Home/verifyAuth";
import { askBart, verifyOTP } from "../Api/CommonApi";
import OtpInputCard from "./ui/OtpInputCard";
import { speakText, stopSpeaking, createTimestamp, resumeSpeaking, cancelSpeaking, getCurrentSpeakingMessageId, setActiveMessageComponent } from "../utils/chatUtils";
import ChatButtonCard from "./ui/ChatButtonCard";
import UserCard from "./ui/UserCard";
import TicketCard from "./ui/ticketcard";
import { ChatMessageProps } from "../props/Props";
import { Message } from "../Interface/Interface";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { SpeakerHigh, SpeakerX } from "@phosphor-icons/react";
import TypingEffect from "./TypingEffect";
import AvatarVideo from "../assets/speaking-avatar.mp4";

const ChatMessage: React.FC<ChatMessageProps> = React.memo(
  ({ message, onNewMessage, onLike, onDislike }) => {
    // const profilePhoto = "https://avatar.vercel.sh/jill";
    const [showAuthVideoCard, setShowAuthVideoCard] = useState(false);
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [clickedButton, setClickedButton] = useState<string | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
      null
    );
    const [isPaused, setIsPaused] = useState(false);
    const messageId = message.history_id || message.timestamp;
    const [showAvatarCard, setShowAvatarCard] = useState(false);

    // Add resetSpeakingState function
    const resetSpeakingState = useCallback(() => {
      setIsSpeaking(false);
      setIsPaused(false);
      setUtterance(null); 
    }, []);

    // Register this component as active when mounted
    React.useEffect(() => {
      setActiveMessageComponent({ resetSpeakingState });
      return () => {
        if (getCurrentSpeakingMessageId() === messageId) {
          cancelSpeaking();
        }
      };
    }, [messageId, resetSpeakingState]);
 
    React.useEffect(() => {
      // Cleanup function for component unmount and page refresh
      return () => {
        if (utterance) {
          window.speechSynthesis.cancel();
          resetSpeakingState();
        }
      };
    }, [utterance, resetSpeakingState]);

    const handleVerificationComplete = useCallback(async () => {
      setShowAuthVideoCard(false);

      try {
        const userMessage: Message = {
          text: "Facial Recognition Verified",
          isUserMessage: true,
          timestamp: createTimestamp(),
          button_display: false,
          number_of_buttons: 0,
          button_text: [],
          ticket: false,
        };
        onNewMessage(userMessage);

        const result = await askBart({
          question: "verified_success",
          user_id: localStorage.getItem("user_id") || "",
          chat_id: localStorage.getItem("chat_id") || "",
        });
        localStorage.setItem("chat_id", result.chat_id);

        const botMessage: Message = {
          text: result.answer || "No response received",
          isUserMessage: false,
          timestamp: createTimestamp(),
          button_display: result.display_settings?.button_display || false,
          number_of_buttons:
            result.display_settings?.options?.buttons?.length || 0,
          button_text: result.display_settings?.options?.buttons || [],
          ticket: result.display_settings?.ticket || false,
          ticket_options:
            result.display_settings?.options?.ticket_options || {},
          history_id: result.display_settings?.message_history[0]?.history_id,
          like: result.display_settings?.message_history[0]?.like,
          un_like: result.display_settings?.message_history[0]?.un_like,
        };

        onNewMessage(botMessage);
      } catch (error) {
        console.error("API Error:", error);
      }
    }, [onNewMessage]);

    const handleButtonClick = async (button: string) => {
      setClickedButton(button);
      if (button.toLowerCase() === "facial recognition") {
        setShowAuthVideoCard(true);
      } else {
        const userMessage: Message = {
          text: button,
          isUserMessage: true,
          timestamp: createTimestamp(),
          button_display: false,
          number_of_buttons: 0,
          button_text: [],
          ticket: false,
        };
        onNewMessage(userMessage);

        try {
          const result = await askBart({
            question: button,
            user_id: localStorage.getItem("user_id") || "",
            chat_id: localStorage.getItem("chat_id") || "",
          });
          localStorage.setItem("chat_id", result.chat_id);

          const botMessage: Message = {
            text: result.answer || "No response received",
            isUserMessage: false,
            timestamp: createTimestamp(),
            button_display: result.display_settings?.button_display || false,
            number_of_buttons:
              result.display_settings?.options?.buttons?.length || 0,
            button_text: result.display_settings?.options?.buttons || [],
            ticket: result.display_settings?.ticket || false,
            ticket_options:
              result.display_settings?.options?.ticket_options || {},
            history_id: result.display_settings?.message_history[0]?.history_id,
            like: result.display_settings?.message_history[0]?.like,
            un_like: result.display_settings?.message_history[0]?.un_like,
          };

          onNewMessage(botMessage);
        } catch (error) {
          console.error("API Error:", error);
        }
      }
    };

    const handleOtpSubmit = async (otpString: string) => {
      try {
        const userMessage: Message = {
          text: "Done",
          isUserMessage: true,
          timestamp: createTimestamp(),
          button_display: false,
          number_of_buttons: 0,
          button_text: [],
          ticket: false,
        };
        onNewMessage(userMessage);

        const result = await verifyOTP({
          otp: parseInt(otpString),
          email: localStorage.getItem("email") || "",
          chat_id: localStorage.getItem("chat_id") || "",
        });

        const botMessage: Message = {
          text: result.answer || "No response received",
          isUserMessage: false,
          timestamp: createTimestamp(),
          button_display: result.display_settings?.button_display || false,
          number_of_buttons:
            result.display_settings?.options?.buttons?.length || 0,
          button_text: result.display_settings?.options?.buttons || [],
          ticket: result.display_settings?.ticket || false,
          ticket_options:
            result.display_settings?.options?.ticket_options || {},
          history_id: result.display_settings?.message_history[0]?.history_id,
          like: result.display_settings?.message_history[0]?.like,
          un_like: result.display_settings?.message_history[0]?.un_like,
        };

        onNewMessage(botMessage);
      } catch (error) {
        const errorMessage: Message = {
          text:
            error instanceof Error ? error.message : "OTP verification failed",
          isUserMessage: false,
          timestamp: createTimestamp(),
          button_display: false,
          number_of_buttons: 0,
          button_text: [],
          ticket: false,
        };
        onNewMessage(errorMessage);
      }
    };

    const handleSpeak = () => {
      const currentSpeakingId = getCurrentSpeakingMessageId();
      
      // If we're already speaking this message
      if (currentSpeakingId === messageId && isSpeaking) {
        if (isPaused) {
          resumeSpeaking();
          setIsPaused(false);
        } else {
          stopSpeaking();
          setIsPaused(true);
        }
        return;
      }

      // Reset states before starting new speech
      setIsSpeaking(false);
      setIsPaused(false);
      
      // Cancel any existing speech
      cancelSpeaking();
      
      // Start new speech after a small delay to ensure previous speech is cancelled
      setTimeout(() => {
        const newUtterance = speakText(message.text, messageId);

        newUtterance.onend = () => {
          resetSpeakingState();
          setShowAvatarCard(false);
        };

        newUtterance.onerror = () => {
          resetSpeakingState();
          setShowAvatarCard(false);
        };

        setIsSpeaking(true);
        setUtterance(newUtterance);
        setShowAvatarCard(true);
      }, 100);
    };

    // Add Avatar Card Component
    const AvatarCard = () => {
      const videoRef = React.useRef<HTMLVideoElement | null>(null);

      React.useEffect(() => {
        if (videoRef.current) {
          if (isSpeaking) {
            videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
        }
      }, [isSpeaking]);

      React.useEffect(() => {
        if (videoRef.current) {
          videoRef.current.loop = true;
        }
      }, []);

      React.useEffect(() => {
        if (videoRef.current) {
          if (isPaused) {
            videoRef.current.pause();
          } else if (isSpeaking) {
            videoRef.current.play();
          }
        }
      }, [isPaused, isSpeaking]);

      return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative w-[400px] bg-gradient-to-b from-gray-900 to-gray-800 rounded-3xl p-6 shadow-2xl border border-gray-700">
            <button
              onClick={() => {
                setShowAvatarCard(false);
                cancelSpeaking();
                resetSpeakingState();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 text-xl"
              aria-label="Close modal"
            >
              ×
            </button>
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25"></div>
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    className="relative w-full rounded-lg shadow-xl"
                    style={{ maxWidth: '300px' }}
                  >
                    <source src={AvatarVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="flex items-center justify-center mt-6">
                  <button
                    onClick={() => {
                      if (isPaused) {
                        resumeSpeaking();
                        setIsPaused(false);
                      } else {
                        stopSpeaking();
                        setIsPaused(true);
                      }
                    }}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {isPaused ? (
                      <span className="flex items-center gap-2">
                        <span className="text-xl">▶️</span>
                        Resume
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span className="text-xl">⏸</span>
                        Pause
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    console.log("Message data:", {
      ticket: message.ticket,
      ticket_options: message.ticket_options,
    });

    return (
      <div className="flex items-start mb-8 w-full text-left">
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
              className="w-8 h-8 rounded-full object-cover mx-2"
            />
            <div className="flex-1">
              <div className="flex items-center justify-start">
                <span className="text-sm font-semibold mr-2 text-black">
                  BART Genie
                </span>
                <span className="w-1 h-1 bg-white rounded-full mx-1"></span>
                <span className="text-xs text-gray-400">
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
                    className="w-1 h-auto mr-2"
                    style={{
                      background: "#523EC6",
                      borderRadius: "4px",
                    }}
                  ></div>
                )}
                <div className="flex-1">
                  {/* <div
                    className="text-sm text-black mb-2 
                      [&_a:hover]:text-blue-300 
                    [&_ol]:list-decimal [&_ul]:list-disc [&_li]:ml-4 [&_li]:block [&_li]:my-1
                    "
                    dangerouslySetInnerHTML={createMarkup(
                      message.text
                        .replace(/^## Response\n\n/g, "")
                        .replace(/\n*## Sources\n\n/g, "\n\n")
                    )}
                  /> */}

                  <div className="flex-1">
                    <TypingEffect
                      text={message.text
                        .replace(/^## Response\n\n/g, "")
                        .replace(/\n*## Sources\n\n/g, "\n\n")}
                      speed={1}
                    />
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
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="relative w-[500px] bg-[#2C2C2E] rounded-3xl p-4">
              <button
                onClick={() => setShowAuthVideoCard(false)}
                className="absolute top-1 right-4 text-xl text-white hover:text-gray-400"
                aria-label="Close modal"
              >
                x
              </button>
              <div className="bg-[#2C2C2E] rounded-lg p-6">
                <div className="flex flex-col items-center">
                  <VerifyAuth
                    onVerificationComplete={handleVerificationComplete}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {showAvatarCard && <AvatarCard />}

        {!message.isUserMessage && (
          <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
            <button
              className={`p-1 rounded transition-colors hover:bg-gray-100 
                ${message.like ? "text-green-600" : ""}`}
              onClick={() => onLike(message.history_id || "")}
              aria-label="Like message"
            >
              <ThumbsUp size={16} />
            </button>
            <button
              className={`p-1 rounded transition-colors hover:bg-gray-100 
                ${message.un_like ? "text-red-600" : ""}`}
              onClick={() => onDislike(message.history_id || "")}
              aria-label="Dislike message"
            >
              <ThumbsDown size={16} />
            </button>
            <button
              className={`p-1 rounded transition-colors hover:bg-gray-100 
                ${isSpeaking ? "text-blue-600" : ""}`}
              onClick={handleSpeak}
              aria-label={isSpeaking ? (isPaused ? "Resume speaking" : "Pause speaking") : "Speak message"}
            >
              {isSpeaking && !isPaused ? (
                <SpeakerX size={16} weight="fill" />
              ) : (
                <SpeakerHigh size={16} />
              )}
            </button>
          </div>
        )}
      </div>
    );
  }
);

export default ChatMessage;