import  { useState, useEffect, useRef } from "react";
import HistorySideBar from "../../components/HistorySideBar";
import BackGround from "../../assets/bg_frame.svg";
import SiteHeader from "../../components/Navbar";
import InputBar from "../../components/Inputbar";
import {
  getHistory,
  deleteChat,
  renameChat,
  getGeneralChatHistory,
  generalChat,
  unlikeChat,
  likeChat,
} from "../../Api/CommonApi";
import { ChatHistory, Message } from "../../Interface/Interface";
import DotLoader from "../../utils/DotLoader";
import Genie from "../../assets/Genie.svg";
import ChatMessage from "../../components/ChatMessage";
import { createUserMessagechatUi,createBotMessagechatUi, createErrorMessage } from "../../utils/chatFields";

const GeneralChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const resetChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    localStorage.removeItem("chat_id");
    isInitializedRef.current = false;
    setLoading(false);
  };

  const fetchChatHistory = async () => {
    try {
      const data = await getGeneralChatHistory();

      // Helper function to group chats by time period
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const groupChatsByTimePeriod = (chat: any) => {
        // Ensure timestamp is properly parsed
        const chatDate = chat.timestamp ? new Date(chat.timestamp) : new Date();
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Check if the date is valid
        if (isNaN(chatDate.getTime())) {
          return { ...chat, timeGroup: "Today" }; // Default to Today if date is invalid
        }

        const diffTime = Math.abs(today.getTime() - chatDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Format date for month and year display
        const monthYear = chatDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        const year = chatDate.getFullYear();

        if (chatDate.toDateString() === today.toDateString()) {
          return { ...chat, timeGroup: "Today" };
        } else if (chatDate.toDateString() === yesterday.toDateString()) {
          return { ...chat, timeGroup: "Yesterday" };
        } else if (diffDays <= 7) {
          return { ...chat, timeGroup: "Previous 7 days" };
        } else if (diffDays <= 30) {
          return { ...chat, timeGroup: "Previous 30 days" };
        } else if (chatDate.getFullYear() === today.getFullYear()) {
          return { ...chat, timeGroup: monthYear };
        } else {
          return { ...chat, timeGroup: year.toString() };
        }
      };

      const formattedData = data.map((chat) => groupChatsByTimePeriod(chat));
      setChatHistory(formattedData);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const handleSubmit = async (message: string) => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("user_id") || "";
      const userMessage = createUserMessagechatUi(message);
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      // If this is the first message in a new chat, don't send chat_id
      const response = await generalChat({
        question: message,
        user_id: userId,
        chat_id: isInitializedRef.current ? (localStorage.getItem("chat_id") || "")
        : ""
      });

      if (response) {
        if (response.chat_id) {
          setCurrentChatId(response.chat_id);
          localStorage.setItem("chat_id", response.chat_id);
          
          // Only fetch history if this was an initial message
          if (!isInitializedRef.current) {
            fetchChatHistory();
            isInitializedRef.current = true;
          }
        }

        const botMessage = createBotMessagechatUi(response);
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }
    } catch (error) {
      console.error("Error:", error);
      const errorBotMessage = createErrorMessage(error);
      setMessages((prevMessages) => [...prevMessages, errorBotMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (history_id: string) => {
    if (!history_id) {
      console.error("History ID is required");
      return;
    }
    try {
      const result = await likeChat(history_id);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.history_id === history_id
            ? { ...msg, like: true, un_like: false }
            : msg
        )
      );
      console.log(result);
    } catch (error) {
      console.error("Error liking chat:", error);
    }
  };

  const handleDislike = async (history_id: string) => {
    if (!history_id) {
      console.error("History ID is required");
      return;
    }
    try {
      const result = await unlikeChat(history_id);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.history_id === history_id
            ? { ...msg, like: false, un_like: true }
            : msg
        )
      );
      console.log(result);
    } catch (error) {
      console.error("Error disliking chat:", error);
    }
  };

  const handleNewMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleGetChat = async (chatId: string) => {
    try {
      resetChat(); // Reset chat before loading a new one
      const data = await getHistory(chatId);
      const flattenedMessages = data.flat().map((message) => ({
        ...message,
        isFromHistory: true,
      }));
      setMessages(flattenedMessages);
      setCurrentChatId(chatId);
      localStorage.setItem("chat_id", chatId);
      isInitializedRef.current = true; // Mark as initialized since we're loading an existing chat
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    await deleteChat(chatId);
  };

  const handleRenameChat = async (chatId: string, newName: string) => {
    await renameChat(chatId, newName);
  };

  return (
    <>
      <SiteHeader />
      <div className="absolute inset-x-0 bottom-0 top-14">
        <div className="h-full flex p-[0px] box-border bg-[#f3f5f9]">
          <div className="flex-shrink-0 ">
            <HistorySideBar
              chatHistory={chatHistory}
              isLoading={isHistoryLoading}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              onChatSelect={handleGetChat}
              onDeleteChat={handleDeleteChat}
              onRenameChat={handleRenameChat}
              setChatHistory={setChatHistory}
              isGeneralChat={true}
              maxWidth="250px"
            />
          </div>

          <div className="flex-grow pt-0 w-[1200px] pb-4 px-4 pr-3 pl-3">
            <div
              className="w-full h-[calc(100%-2px)] mt-2 rounded-[16px] overflow-hidden bg-cover bg-center"
              style={{ backgroundImage: `url(${BackGround})` }}
            >
              <div className="flex flex-col h-full">
                <div className="flex-grow overflow-hidden relative">
                  <div className="absolute inset-0 overflow-y-auto px-4 py-3">
                    {messages.map((message, index) => (
                      <ChatMessage
                        key={index}
                        message={message}
                        chatId={currentChatId || ""}
                        onNewMessage={handleNewMessage}
                        setMessages={setMessages}
                        onLike={handleLike}
                        onDislike={handleDislike}
                        inline={false}
                        isPdfContext={false}
                      />
                    ))}
                    {loading && (
                      <div className="flex items-start w-full mt-2">
                        <img
                          src={Genie}
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

                <div className="flex-shrink-0 px-8 py-0">
                  <div className="max-w-full mx-auto h-16 w-full">
                    <InputBar
                      onSubmit={handleSubmit}
                      loading={loading}
                      enableVoiceInput={true}
                      enableFileUpload={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneralChat;

