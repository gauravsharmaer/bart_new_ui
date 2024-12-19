import { useEffect, useState, useRef } from "react";
import { askBart } from "../Api/CommonApi";
import ChatMessage from "./ChatMessage";
import DotLoader from "../utils/DotLoader";
import HistorySideBar from "./HistorySideBar";
import ChatLogo from "../assets/Genie.svg";
// import PlusIcon from "../assets/plus-circle.svg";
// import IconArrow from "../assets/arrow-circle-up.svg";
import ChatInputBar from "./ChatInputBar";
// import { Message } from "./Interface/Interface";
import { getHistory } from "../Api/CommonApi";
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

interface PasswordResetUiProps {
  initialMessage: string;
}

const PasswordResetUi = ({ initialMessage }: PasswordResetUiProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  // const [inputMessage, setInputMessage] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  console.log(messages);
  useEffect(() => {
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
        // timestamp: new Date().toLocaleTimeString(),
      }));
      setMessages(flattenedMessages);
      setChatId(chatId);
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  useEffect(() => {
    // Auto-scroll to the latest message
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!inputMessage.trim()) return;

  //   const userMessage: Message = {
  //     text: inputMessage,
  //     isUserMessage: true,
  //     timestamp: new Date().toISOString().replace("Z", "000"),
  //     button_display: false,
  //     number_of_buttons: 0,
  //     button_text: [],
  //   };

  //   setMessages((prev) => [...prev, userMessage]);
  //   setLoading(true);
  //   setInputMessage("");

  //   try {
  //     const result = await askBart({
  //       question: inputMessage,
  //       user_id: localStorage.getItem("user_id") || "",
  //       chat_id: localStorage.getItem("chat_id") || "",
  //     });

  //     localStorage.setItem("chat_id", result.chat_id);
  //     const botMessage: Message = {
  //       text: result.answer || "No response received",
  //       isUserMessage: false,
  //       timestamp: new Date().toISOString().replace("Z", "000"),
  //       button_display: result.display_settings?.button_display || false,
  //       number_of_buttons:
  //         result.display_settings?.options?.buttons?.length || 0,
  //       button_text: result.display_settings?.options?.buttons || [],
  //     };

  //     setMessages((prev) => [...prev, botMessage]);
  //   } catch (error) {
  //     const errorBotMessage: Message = {
  //       text: error instanceof Error ? error.message : "An error occurred",
  //       isUserMessage: false,
  //       timestamp: new Date().toISOString().replace("Z", "000"),
  //       button_display: false,
  //       number_of_buttons: 0,
  //       button_text: [],
  //     };

  //     setMessages((prev) => [...prev, errorBotMessage]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleNewMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  return (
    <div className="flex  h-screen w-full">
      <div className="flex flex-row w-full">
        <div className="w-[30%]">
          <HistorySideBar onChatSelect={handleGetChat} />
        </div>
        <div className="w-full">
          <div
            className="w-full h-full overflow-y-auto p-4"
            style={{
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message}
                chatId={chatId || ""}
                onNewMessage={handleNewMessage}
              />
            ))}

            {loading && (
              <div className="flex items-start w-full">
                <div className="flex items-start w-full">
                  <img
                    src={ChatLogo}
                    alt="BART Genie"
                    className="w-8 h-8 rounded-full object-cover mr-2"
                  />
                  <div className="flex-1 text-left">
                    <div className="flex items-center">
                      <span className="text-sm font-semibold mr-2">
                        BART Genie
                      </span>
                      <span className="w-1 h-1 bg-white rounded-full mx-1"></span>
                      <span className="text-xs text-gray-400">
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="mt-2">
                      <DotLoader />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <ChatInputBar
            onSubmit={async (message) => {
              const userMessage: Message = {
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
                const botMessage: Message = {
                  text: result.answer || "No response received",
                  isUserMessage: false,
                  timestamp: new Date().toISOString().replace("Z", "000"),
                  button_display:
                    result.display_settings?.button_display || false,
                  number_of_buttons:
                    result.display_settings?.options?.buttons?.length || 0,
                  button_text: result.display_settings?.options?.buttons || [],
                };

                setMessages((prev) => [...prev, botMessage]);
              } catch (error) {
                const errorBotMessage: Message = {
                  text:
                    error instanceof Error
                      ? error.message
                      : "An error occurred",
                  isUserMessage: false,
                  timestamp: new Date().toISOString().replace("Z", "000"),
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
  );
};

export default PasswordResetUi;
