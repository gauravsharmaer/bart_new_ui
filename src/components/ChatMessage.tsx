import React, { useState, useCallback } from "react";
import ChatLogo from "../assets/Genie.svg";
import VerifyAuth from "../pages/Home/verifyAuth";
import { askBart, verifyOTP } from "../Api/CommonApi";
import createMarkup from "../utils/chatUtils";
// import {
//   Message,
//   ChatMessageProps,
//   InlineOTPCardProps,
// } from "./Interface/Interface";

interface Message {
  text: string;
  isUserMessage: boolean;
  button_display: boolean;
  number_of_buttons: number;
  button_text: string[];
  id?: string;
  vertical_bar?: boolean;
  timestamp: string; // Make this optional
}

interface ChatMessageProps {
  message: Message;
  chatId: string;
  onNewMessage: (message: Message) => void;
}

interface InlineOTPCardProps {
  onSubmitOTP: (otp: string) => void;
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
}

const InlineOTPCard: React.FC<InlineOTPCardProps> = ({
  onSubmitOTP,
  otp,
  setOtp,
}) => {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>(
    Array(6).fill(null)
  );

  React.useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleSubmit = useCallback(() => {
    if (otp.every((digit: string) => digit !== "")) {
      onSubmitOTP(otp.join(""));
    }
  }, [otp, onSubmitOTP]);

  const handleChange = useCallback(
    (index: number, value: string) => {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp, setOtp]
  );

  const handleKeyDown = useCallback(
    (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Backspace") {
        event.preventDefault();
        if (!otp[index] && index > 0) {
          inputRefs.current[index - 1]?.focus();
          const updatedOtp = [...otp];
          updatedOtp[index - 1] = "";
          setOtp(updatedOtp);
        } else {
          const updatedOtp = [...otp];
          updatedOtp[index] = "";
          setOtp(updatedOtp);
        }
      } else if (event.key === "Enter") {
        handleSubmit();
      }
    },
    [otp, setOtp, handleSubmit]
  );

  return (
    <div className="mt-4">
      <div className="bg-gray-800 p-4 rounded-lg">
        <p className="text-gray-200 mb-3">Please enter below</p>
        <div className="flex space-x-2 justify-start mb-4">
          {otp.map((value: string, index: number) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={(e) => e.target.select()}
              maxLength={1}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 text-center bg-gray-700 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-lg"
            />
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="w-32 py-2 bg-gray-700 text-white rounded-lg hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(90deg, #f7a8a8, #bf5fe1)" }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

const ChatMessage: React.FC<ChatMessageProps> = React.memo(
  ({ message, onNewMessage }) => {
    const profilePhoto = "https://avatar.vercel.sh/jill";
    const [showAuthVideoCard, setShowAuthVideoCard] = useState(false);
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
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
          };

          onNewMessage(botMessage);
        } catch (error) {
          console.error("API Error:", error);
        }
      }
    };

    const handleOtpSubmit = async (otpString: string) => {
      try {
        // Display "Done" as the user's message
        const userMessage: Message = {
          text: "Done", // Show "Done" instead of the OTP
          isUserMessage: true,
          timestamp: new Date().toISOString().replace("Z", "000"),
          button_display: false,
          number_of_buttons: 0,
          button_text: [],
        };
        onNewMessage(userMessage);

        // Send the actual OTP to the backend
        const result = await verifyOTP({
          otp: parseInt(otpString), // Send actual OTP to the backend
          email: localStorage.getItem("email") || "",
          chat_id: localStorage.getItem("chat_id") || "",
        });

        // Display the response from the backend
        const botMessage: Message = {
          text: result.answer || "No response received",
          isUserMessage: false,
          timestamp: new Date().toISOString().replace("Z", "000"),
          button_display: result.display_settings?.button_display || false,
          number_of_buttons:
            result.display_settings?.options?.buttons?.length || 0,
          button_text: result.display_settings?.options?.buttons || [],
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
        };
        onNewMessage(errorMessage);
      }
    };

    return (
      <div className="flex items-start mb-8 w-full text-left">
        <div className="flex items-start w-full">
          <img
            src={message.isUserMessage ? profilePhoto : ChatLogo}
            alt={message.isUserMessage ? "User" : "BART Genie"}
            className={`w-8 h-8 rounded-full object-cover ${
              message.isUserMessage ? "mx-2" : "mx-2"
            }`}
          />
          <div className="flex-1 flex">
            {(message.button_display ||
              message.text.includes("verification code")) && (
              <div
                className="w-1 h-auto mr-2"
                style={{
                  background: "linear-gradient(90deg, #f7a8a8, #bf5fe1)",
                  borderRadius: "4px",
                }}
              ></div>
            )}
            <div>
              <div className="flex items-center justify-start">
                <span className="text-sm font-semibold mr-2 text-black">
                  {message.isUserMessage
                    ? localStorage.getItem("name") || "User"
                    : "BART Genie"}
                </span>
                <span className="w-1 h-1 bg-white rounded-full mx-1"></span>
                <span className="text-xs text-gray-400">
                  {new Date(
                    message.timestamp.replace("000", "Z")
                  ).toLocaleString()}
                </span>
              </div>
              <div
                className="mt-2 text-sm text-black [&_a]:text-blue-400 [&_a]:underline [&_a:hover]:text-blue-300"
                dangerouslySetInnerHTML={createMarkup(message.text)}
              />
              {message.text.includes("verification code") && (
                <InlineOTPCard
                  onSubmitOTP={handleOtpSubmit}
                  otp={otp}
                  setOtp={setOtp}
                />
              )}
              {message.button_display &&
                !message.text.includes("verification code") && (
                  <div className="mt-2 text-sm flex flex-row gap-2">
                    {message.button_text.map((button, index) => (
                      <button
                        key={index}
                        className={`px-4 py-2 rounded-md cursor-pointer ${
                          clickedButton === button
                            ? "bg-gradient-to-r from-[#f7a8a8] to-[#bf5fe1] text-white"
                            : "bg-gray-700 text-white"
                        }`}
                        onClick={() => handleButtonClick(button)}
                      >
                        {button}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>

        {showAuthVideoCard && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="relative w-[500px] bg-[#2C2C2E] rounded-3xl p-4">
              {" "}
              {/* Added background and rounded corners */}
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
