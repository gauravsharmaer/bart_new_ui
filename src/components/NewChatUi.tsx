import  { useEffect, useState, useRef } from "react";
// import {
//   askBart,
//   getHistory,
// } from "../Api/CommonApi";
import ChatMessage from "./ChatMessage";
import DotLoader from "../utils/DotLoader";
import HistorySideBar from "./HistorySideBar";
import ChatLogo from "../assets/Genie.svg";
// import ChatInputBar from "./ChatInputBar";
import BackGround from "../assets/bg_frame.svg";
import { Message, ChatHistory } from "../Interface/Interface";
import {  ExtendedChatUiProps } from "../props/Props";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { resetNewChatFlag, startNewChat } from "../redux/chatSlice";
import { createUserMessagechatUi, createBotMessagechatUi, createErrorMessage } from "../utils/chatFields";
// import { createTimestamp } from "../utils/chatUtils";
import Inputbar from "./Inputbar";

const ChatUi = ({ initialMessage, apiHandlers }: ExtendedChatUiProps) => {
  const dispatch = useDispatch();


  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  const navigate = useNavigate();
  const { isNewChat, selectedChatId } = useSelector(
    (state: RootState) => state.chat
  );
  console.log(chatId);



  const handleLike = async (history_id: string) => {
    if (!history_id) {
      console.error("History ID is required");
      return;
    }
    try {
      const result = await apiHandlers.likeChat(history_id);
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
      const result = await apiHandlers.unlikeChat(history_id);
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

 
  const fetchChatHistory = async () => {
    try {
      const data = await apiHandlers.getUserChats();
      const formattedData = data.map((chat, index) => {
        // Status logic
        if (index === 0) {
          return {
            ...chat,
            status: "",
          };
        } else if (chat.name.startsWith("Hey") || chat.name.includes("h")) {
          return {
            ...chat,
            status: "Resolved",
          };
        } else if ([1, 2, 5, 6].includes(index)) {
          return { ...chat, status: "Ticket raised" };
        } else {
          return {
            ...chat,
            timestamp: `${index + 1} day${index === 0 ? "" : "s"} ago`,
          };
        }
      });

      setChatHistory(formattedData);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setIsHistoryLoading(false);
    }
  };
  const handleDeleteChat = async (chatId: string) => {
    await apiHandlers.deleteChat(chatId);
  };

  const handleRenameChat = async (chatId: string, newName: string) => {
    await apiHandlers.renameChat(chatId, newName);
  };


  // Add effect for auto-scrolling
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const resetChat = () => {
    setMessages([]);
    setChatId(null);
    localStorage.removeItem("chat_id");
    isInitializedRef.current = false;
    setLoading(false);
  };

  // Handle new chat initialization from Redux state
  useEffect(() => {
    if (isNewChat) {
      resetChat();
      localStorage.removeItem("chat_id");
      setMessages([]);
      setChatId(null);
      isInitializedRef.current = false;
      // Reset the isNewChat flag after handling the new chat initialization
      dispatch(resetNewChatFlag());
    }
  }, [isNewChat, dispatch]);

  useEffect(() => {
    if (!initialMessage || isInitializedRef.current) return;
    isInitializedRef.current = true;
    setLoading(true);

    apiHandlers.askBart({
      question: initialMessage,
      user_id: localStorage.getItem("user_id") || "",
    })
      .then((result) => {
        const userMessage = createUserMessagechatUi(initialMessage);
        const botMessage = createBotMessagechatUi(result);
        setMessages([userMessage, botMessage]);

        if (result.chat_id) {
          localStorage.setItem("chat_id", result.chat_id);
          setChatId(result.chat_id);
        }
      })
      .catch((error) => {
        const errorBotMessage = createErrorMessage(error);
        setMessages((prev) => [...prev, errorBotMessage]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [initialMessage, dispatch, apiHandlers]);

  const handleGetChat = async (chatId: string) => {
    try {
      const data = await apiHandlers.getHistory(chatId);
      const flattenedMessages = data.flat().map((message) => ({
        ...message,
        isFromHistory: true,
      }));
      setMessages(flattenedMessages);
      setChatId(chatId);
      localStorage.setItem("chat_id", chatId);
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  const handleNewMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };



  // Add effect to handle selectedChatId changes
  useEffect(() => {
    if (selectedChatId) {
      handleGetChat(selectedChatId);
    }
  }, [selectedChatId]);

  // Add new useEffect for fetching chat history
  useEffect(() => {
    fetchChatHistory();
  }, []);

  // Update chat history when chatId changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      const updatedHistory = chatHistory.map((chat) => ({
        ...chat,
        isActive: chat.id === chatId,
      }));
      setChatHistory(updatedHistory);
    }
  }, [chatId]);

  return (
    <div className="absolute inset-x-0 bottom-0 top-10">
      {/* New Chat Button */}
    

      {/* Main container */}
      <div className="h-full flex p-2 box-border bg-[#f3f5f9]">
      <button 
        className="fixed top-32 right-20 z-50 bg-gray-300 text-white px-4 py-2 rounded-lg shadow-lg"
        onClick={() => {
          navigate("/");
          dispatch(startNewChat());
        }}
      >
        New Chat
      </button>
        {/* Sidebar */}
        <div className="flex-shrink-0 border-r border-white">
          <HistorySideBar
            chatHistory={chatHistory}
            isLoading={isHistoryLoading}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onChatSelect={handleGetChat}
            onDeleteChat={handleDeleteChat}
            onRenameChat={handleRenameChat}
            setChatHistory={setChatHistory}
          />
        </div>

        {/* Main Chat Section */}
        <div className="flex-grow p-4">
          <div className="h-[calc(100%-15px)] w-full mt-4 rounded-2xl overflow-hidden bg-center bg-no-repeat bg-cover" 
               style={{ backgroundImage: `url(${BackGround})` }}>
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
                      onLike={handleLike}
                      onDislike={handleDislike}
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
                  <Inputbar
                    onSubmit={async (message) => {
                      const userMessage = createUserMessagechatUi(message);
                      setMessages((prev) => [...prev, userMessage]);
                      setLoading(true);

                      try {
                        const result = await apiHandlers.askBart({
                          question: message,
                          user_id: localStorage.getItem("user_id") || "",
                          chat_id: localStorage.getItem("chat_id") || "",


                        });

                        if (!localStorage.getItem("chat_id")) {
                          fetchChatHistory();
                        }

                        localStorage.setItem("chat_id", result.chat_id);
                        const botMessage = createBotMessagechatUi(result);
                        setMessages((prev) => [...prev, botMessage]);
                      } catch (error) {
                        const errorBotMessage = createErrorMessage(error);
                        setMessages((prev) => [...prev, errorBotMessage]);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    loading={loading}
                    enableVoiceInput={true}
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

export default ChatUi;
