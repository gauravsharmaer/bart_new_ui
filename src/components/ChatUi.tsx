import React, { useEffect, useState, useRef } from "react";
import { askBart, getHistory } from "../Api/CommonApi";
import ChatMessage from "./ChatMessage";
import DotLoader from "../utils/DotLoader";
import HistorySideBar from "./HistorySideBar";
import ChatLogo from "../assets/Genie.svg";
import ChatInputBar from "./ChatInputBar";
import BackGround from "../assets/bg_frame.svg";
import { Message } from "../Interface/Interface";
import { PasswordResetUiProps } from "../props/Props";
// interface Message {
//   text: string;
//   isUserMessage: boolean;
//   button_display: boolean;
//   number_of_buttons: number;
//   button_text: string[];
//   id?: string;
//   vertical_bar?: boolean;
//   timestamp: string;
//   ticket?: boolean;
//   ticket_options?: {
//     name: string | undefined;
//     description: string | undefined;
//     ticket_id: string | undefined;
//     assignee_name: string | undefined;
//   };
// }

// interface PasswordResetUiProps {
//   initialMessage: string;
// }

const PasswordResetUi = ({ initialMessage }: PasswordResetUiProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Add effect for auto-scrolling
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    setLoading(true);

    askBart({
      question: initialMessage,
      user_id: localStorage.getItem("user_id") || "",
    })
      .then((result) => {
        const userMessage: Message = {
          text: initialMessage,
          isUserMessage: true,
          timestamp: new Date().toISOString().replace("Z", "000"),
          button_display: false,
          number_of_buttons: 0,
          button_text: [],
        };

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
            result.display_settings?.options?.ticket_options || undefined,
          history_id: result.display_settings?.message_history[0]?.history_id,
        };

        setMessages([userMessage, botMessage]);

        if (result.chat_id) {
          localStorage.setItem("chat_id", result.chat_id);
          setChatId(result.chat_id);
        }
      })
      .catch((error) => {
        const errorBotMessage: Message = {
          text: error instanceof Error ? error.message : "An error occurred",
          isUserMessage: false,
          timestamp: new Date().toISOString().replace("Z", "000"),
          button_display: false,
          number_of_buttons: 0,
          button_text: [],
        };

        setMessages((prev) => [...prev, errorBotMessage]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [initialMessage]);

  const handleGetChat = async (chatId: string) => {
    try {
      const data = await getHistory(chatId);
      const flattenedMessages = data.flat().map((message) => ({
        ...message,
      }));
      setMessages(flattenedMessages);
      setChatId(chatId);
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  const handleNewMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  // Updated styles for the chat screen background
  const chatScreenStyle: React.CSSProperties = {
    backgroundImage: `url(${BackGround})`, // SVG as background
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover", // Ensures the background fills the entire container
    borderRadius: "16px", // Same border radius as container for consistency
    overflow: "hidden",
    height: "calc(100% - 15px)",
    width: "100%",
    marginTop: "16px",
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: "#f3f5f9", // Change surrounding color here
    height: "100%", // Ensure it covers the full height
    display: "flex",
    padding: "2px", // Adds equal space on all sides of the container
    boxSizing: "border-box", // Ensures padding doesn't affect the width/height
  };

  return (
    <div className="absolute inset-x-0 bottom-0 top-10">
      {/* Main container */}
      <div style={containerStyle}>
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 border-r border-white">
          <HistorySideBar onChatSelect={handleGetChat} />
        </div>

        {/* Main Chat Section */}
        <div className="flex-grow p-4">
          <div style={chatScreenStyle}>
            <div className="flex flex-col h-full">
              {/* Chat Messages */}
              <div className="flex-grow overflow-hidden relative">
                <div className="absolute inset-0 overflow-y-auto px-4 py-3">
                  {messages.map((message, index) => (
                    <ChatMessage
                      key={index}
                      message={message}
                      chatId={chatId || ""}
                      onNewMessage={handleNewMessage}
                      setMessages={setMessages}
                    />
                  ))}
                  {loading && (
                    <div className="flex items-start w-full mt-2">
                      <img
                        src={ChatLogo}
                        alt="BART Genie"
                        className="w-8 h-8 rounded-full object-cover mr-2"
                      />
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="text-sm font-semibold mr-2">
                            BART Genie
                          </span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full mx-1"></span>
                          <span className="text-xs text-gray-400">
                            {new Date().toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="mt-2">
                          <DotLoader />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              {/* Input Bar */}
              <div className="flex-shrink-0 px-8 py-0">
                <div className="max-w-full mx-auto h-16 w-full">
                  <ChatInputBar
                    onSubmit={async (message) => {
                      const userMessage = {
                        text: message,
                        isUserMessage: true,
                        timestamp: new Date().toISOString().replace("Z", "000"),
                        button_display: false,
                        number_of_buttons: 0,
                        button_text: [],
                      };

                      setMessages((prev) => [...prev, userMessage]);
                      setLoading(true);

                      try {
                        const result = await askBart({
                          question: message,
                          user_id: localStorage.getItem("user_id") || "",
                          chat_id: localStorage.getItem("chat_id") || "",
                        });

                        localStorage.setItem("chat_id", result.chat_id);
                        const botMessage = {
                          text: result.answer || "No response received",
                          isUserMessage: false,
                          timestamp: new Date()
                            .toISOString()
                            .replace("Z", "000"),
                          button_display:
                            result.display_settings?.button_display || false,
                          number_of_buttons:
                            result.display_settings?.options?.buttons?.length ||
                            0,
                          button_text:
                            result.display_settings?.options?.buttons || [],
                          ticket: result.display_settings?.ticket || false,
                          ticket_options:
                            result.display_settings?.options?.ticket_options ||
                            undefined,
                          history_id:
                            result.display_settings?.message_history[0]
                              ?.history_id,
                        };

                        setMessages((prev) => [...prev, botMessage]);
                      } catch (error) {
                        const errorBotMessage = {
                          text:
                            error instanceof Error
                              ? error.message
                              : "An error occurred",
                          isUserMessage: false,
                          timestamp: new Date()
                            .toISOString()
                            .replace("Z", "000"),
                          button_display: false,
                          number_of_buttons: 0,
                          button_text: [],
                        };

                        setMessages((prev) => [...prev, errorBotMessage]);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    loading={loading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetUi;
