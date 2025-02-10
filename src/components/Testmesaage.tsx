import React, { useState, useCallback } from "react";
import ChatLogo from "../assets/Genie.svg";
import VerifyAuth from "../pages/Home/verifyAuth";
import { askBart, verifyOTP } from "../Api/CommonApi";
import OtpInputCard from "./ui/OtpInputCard";
import { createTimestamp, handleTextToAvatarConversion } from "../utils/chatUtils";
import { toast } from "react-toastify";
import ChatButtonCard from "./ui/ChatButtonCard";
import UserCard from "./ui/UserCard";
import TicketCard from "./ui/ticketcard";
import { ChatMessageProps } from "../props/Props";
import TypingEffect from "./TypingEffect";
import createMarkup from "../utils/chatUtils";
import { useGetAvatarMutation, getAvatarCacheKey, VOICE_OPTIONS } from "../redux/features/avatarSlice";
import VoiceOptions from "./VoiceOptions";
import SpeakerHigh from "../assets/speaker.svg";
import ThumbsUp from "../assets/thumb-up.svg";
import ThumbsDown from "../assets/thumb-down.svg";
import Copy from "../assets/copy.svg";
import TextCopied from "../assets/TextCopied.svg";

interface MessageComponentProps extends ChatMessageProps {
  type: 'chat' | 'pdf';
  inline?: boolean;
}

const MessageComponent: React.FC<MessageComponentProps> = React.memo(
  ({ message, onNewMessage, onLike, onDislike, type, inline = false }) => {
    const [showAuthVideoCard, setShowAuthVideoCard] = useState(false);
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [clickedButton, setClickedButton] = useState<string | null>(null);
    const [showCopiedNotification, setShowCopiedNotification] = useState(false);
    const [showVoiceOptions, setShowVoiceOptions] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [getAvatar] = useGetAvatarMutation();

    // Handlers
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

    const handleCopy = async () => {
      try {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = message.text;
        const textToCopy = tempDiv.textContent || tempDiv.innerText || "";
        await navigator.clipboard.writeText(textToCopy);
        setShowCopiedNotification(true);
        setTimeout(() => {
          setShowCopiedNotification(false);
        }, 2000);
      } catch (error) {
        console.error("Failed to copy text:", error);
      }
    };

    const handleSpeak = async (voiceOption?: any) => {
      if (!voiceOption) {
        setShowVoiceOptions(true);
        return;
      }
      // ... rest of handleSpeak implementation ...
    };

    const handleVoiceIconClick = (voiceIndex: number) => {
      const selectedVoice = VOICE_OPTIONS[voiceIndex];
      if (selectedVoice) {
        handleSpeak(selectedVoice);
      }
    };

    return (
      <>
        {showCopiedNotification && (
          <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50" 
               style={{ top: '13%', left: '64%', marginLeft: '-50px' }}>
            <img src={TextCopied} alt="Text Copied" className="h-10 w-auto" />
          </div>
        )}

        <div className={`flex ${message.isUserMessage ? "justify-end" : "justify-start"} mb-4`}>
          {message.isUserMessage ? (
            <UserCard
              name={localStorage.getItem("name") || "User"}
              text={message.text}
            />
          ) : (
            <div className={`flex ${type === 'pdf' ? 'flex-col' : ''} w-full`}>
              <div className="flex items-start">
                <img
                  src={ChatLogo}
                  alt="BART Genie"
                  className="w-8 h-8 rounded-full object-cover mx-2 dark:opacity-90"
                />
                <div className="flex-1">
                  {/* Message Header */}
                  <div className="flex items-center justify-start">
                    <span className="text-[14px] font-passenger font-light text-gray-900 dark:text-black mr-2">
                      BART Genie
                    </span>
                    <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-1"></span>
                    <span className="text-[12px] font-passenger font-light text-gray-600 dark:text-black/70">
                      {new Date(message.timestamp).toLocaleString()}
                    </span>
                  </div>

                  {/* Message Content */}
                  <div className="flex mt-2">
                    {(message.button_display || message.text.includes("verification code")) && (
                      <div className="w-1 h-auto mr-2 bg-purple-600 dark:bg-purple-500 rounded-sm"></div>
                    )}
                    <div className="flex-1">
                      {message.isFromHistory ? (
                        <div
                          className="text-sm text-gray-800 dark:text-black font-passenger"
                          dangerouslySetInnerHTML={createMarkup(
                            message.text,
                            type === 'pdf' ? 'vertical' : (inline ? 'inline' : 'vertical')
                          )}
                        />
                      ) : (
                        <TypingEffect text={message.text} speed={1} />
                      )}

                      {/* Interactive Components */}
                      {message.text.includes("verification code") && (
                        <OtpInputCard
                          onSubmitOTP={handleOtpSubmit}
                          otp={otp}
                          setOtp={setOtp}
                        />
                      )}
                      {message.button_display && !message.text.includes("verification code") && (
                        <ChatButtonCard
                          buttons={message.button_text}
                          onButtonClick={handleButtonClick}
                          clickedButton={clickedButton}
                        />
                      )}
                      {message.ticket && message.ticket_options && (
                        <TicketCard {...message.ticket_options} />
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {!message.isUserMessage && (
                    <div className="relative pt-3">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        {/* Like/Dislike buttons */}
                        <ActionButton
                          icon={ThumbsUp}
                          onClick={() => onLike(message.history_id || "")}
                          isActive={message.like}
                        />
                        <ActionButton
                          icon={ThumbsDown}
                          onClick={() => onDislike(message.history_id || "")}
                          isActive={message.un_like}
                        />
                        {/* Voice and Copy buttons */}
                        {type === 'chat' && (
                          <ActionButton
                            icon={SpeakerHigh}
                            onClick={() => handleSpeak()}
                          />
                        )}
                        <ActionButton
                          icon={Copy}
                          onClick={handleCopy}
                        />
                      </div>
                      <VoiceOptions
                        showVoiceOptions={showVoiceOptions}
                        handleVoiceIconClick={handleVoiceIconClick}
                        setShowVoiceOptions={setShowVoiceOptions}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {showAuthVideoCard && <AuthVideoModal onClose={() => setShowAuthVideoCard(false)} onComplete={handleVerificationComplete} />}
        {isLoading && <LoadingModal />}
        {!isLoading && videoUrl && <VideoModal url={videoUrl} onClose={() => setVideoUrl(null)} />}
      </>
    );
  }
);

export default MessageComponent;
