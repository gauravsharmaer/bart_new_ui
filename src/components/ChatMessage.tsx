import React, { useState, useCallback } from "react";
import ChatLogo from "../assets/Genie.svg";
import VerifyAuth from "../pages/Home/verifyAuth";
import { askBart, verifyOTP } from "../Api/CommonApi";
import OtpInputCard from "./ui/OtpInputCard";
import createMarkup from "../utils/chatUtils";
import ChatButtonCard from "./ui/ChatButtonCard";
import UserCard from "./ui/UserCard";
import TicketCard from "./ui/ticketcard";
import { ChatMessageProps } from "../props/Props";
import { Message } from "../Interface/Interface";
// interface Message {
//   text: string;
//   isUserMessage: boolean;
//   button_display: boolean;
//   number_of_buttons: number;
//   button_text: string[];
//   id?: string;
//   vertical_bar?: boolean;
//   timestamp: string; // Make this optional
//   ticket?: boolean;
//   ticket_options?: {
//     name: string | undefined;
//     description: string | undefined;
//     ticket_id: string | undefined;
//     assignee_name: string | undefined;
//   };
// }

// interface ChatMessageProps {
//   message: Message;
//   chatId: string;
//   onNewMessage: (message: Message) => void;
// }

const ChatMessage: React.FC<ChatMessageProps> = React.memo(
  ({ message, onNewMessage }) => {
    // const profilePhoto = "https://avatar.vercel.sh/jill";
    const [showAuthVideoCard, setShowAuthVideoCard] = useState(false);
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [clickedButton, setClickedButton] = useState<string | null>(null);
    console.log(message);
    const handleVerificationComplete = useCallback(async () => {
      setShowAuthVideoCard(false);

      try {
        const userMessage: Message = {
          text: "Facial Recognition Verified",
          isUserMessage: true,
          timestamp: new Date().toISOString().replace("Z", "000"),
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
          timestamp: new Date().toISOString().replace("Z", "000"),
          button_display: result.display_settings?.button_display || false,
          number_of_buttons:
            result.display_settings?.options?.buttons?.length || 0,
          button_text: result.display_settings?.options?.buttons || [],
          ticket: result.display_settings?.ticket || false,
          ticket_options:
            result.display_settings?.options?.ticket_options || {},
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
          timestamp: new Date().toISOString().replace("Z", "000"),
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
            timestamp: new Date().toISOString().replace("Z", "000"),
            button_display: result.display_settings?.button_display || false,
            number_of_buttons:
              result.display_settings?.options?.buttons?.length || 0,
            button_text: result.display_settings?.options?.buttons || [],
            ticket: result.display_settings?.ticket || false,
            ticket_options:
              result.display_settings?.options?.ticket_options || {},
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
          timestamp: new Date().toISOString().replace("Z", "000"),
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
          timestamp: new Date().toISOString().replace("Z", "000"),
          button_display: result.display_settings?.button_display || false,
          number_of_buttons:
            result.display_settings?.options?.buttons?.length || 0,
          button_text: result.display_settings?.options?.buttons || [],
          ticket: result.display_settings?.ticket || false,
          ticket_options:
            result.display_settings?.options?.ticket_options || {},
        };

        onNewMessage(botMessage);
      } catch (error) {
        const errorMessage: Message = {
          text:
            error instanceof Error ? error.message : "OTP verification failed",
          isUserMessage: false,
          timestamp: new Date().toISOString().replace("Z", "000"),
          button_display: false,
          number_of_buttons: 0,
          button_text: [],
          ticket: false,
        };
        onNewMessage(errorMessage);
      }
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
              alt="BART Buddy"
              className="w-8 h-8 rounded-full object-cover mx-2"
            />
            <div className="flex-1">
              <div className="flex items-center justify-start">
                <span className="text-sm font-semibold mr-2 text-black">
                  BART Buddy
                </span>
                <span className="w-1 h-1 bg-white rounded-full mx-1"></span>
                <span className="text-xs text-gray-400">
                  {new Date(
                    message.timestamp.replace("000", "Z")
                  ).toLocaleString()}
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
                  <div
                    className="text-sm text-black mb-2 [&_a]:text-blue-400 [&_a]:underline [&_a:hover]:text-blue-300"
                    dangerouslySetInnerHTML={createMarkup(message.text)}
                  />
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
      </div>
    );
  }
);

export default ChatMessage;
