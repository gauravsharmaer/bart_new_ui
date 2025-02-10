import React, { useState, useEffect, useRef } from "react";
import HistorySideBar from "../../components/HistorySideBar";
import BackGround from "../../assets/bg_frame.svg";
import SiteHeader from "../../components/Navbar";
import InputBar from "../../components/Inputbar";
import { getHistory, deleteChat, renameChat , getGeneralChatHistory,generalChat, unlikeChat, likeChat} from "../../Api/CommonApi";
import { ChatHistory, Message } from "../../Interface/Interface";
import DotLoader from "../../utils/DotLoader";
import Genie from "../../assets/Genie.svg";
import ChatMessage from "./GeneralChatMessage";


const GeneralChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
console.log(chatHistory)
  // Styles matching ChatWithPdf
  const chatScreenStyle: React.CSSProperties = {
    backgroundImage: `url(${BackGround})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
    borderRadius: "16px",
    overflow: "hidden",
    height: "calc(100% - 15px)",
    width: "100%",
    marginTop: "16px",
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: "#f3f5f9",
    height: "100%",
    display: "flex",
    padding: "2px",
    boxSizing: "border-box",
  };



  // const fetchChatHistory = async () => {
  //   try {
  //     const data = await getGeneralChatHistory();
  //     const formattedData = data.map((chat, index) => {
  //       // Status logic
  //       if (index === 0) {

  //         return {
  //           ...chat,
  //           status: "",
  //         };
  //       } else if (chat.name.startsWith("Hey") || chat.name.includes("h")) {
  //         return {
  //           ...chat,
  //           status: "Resolved",
  //         };
  //       } else if ([1, 2, 5, 6].includes(index)) {
  //         return { ...chat, status: "Ticket raised" };
  //       } else {
  //         return {
  //           ...chat,
  //           timestamp: `${index + 1} day${index === 0 ? "" : "s"} ago`,
  //         };
  //       }
  //     });

  //     setChatHistory(formattedData);
  //   } catch (error) {
  //     console.error("Error fetching chat history:", error);
  //   } finally {
  //     setIsHistoryLoading(false);
  //   }
  // };



  const fetchChatHistory = async () => {
    try {
      const data = await getGeneralChatHistory();
      
      // Helper function to group chats by time period
      const groupChatsByTimePeriod = (chat: any) => {
        // Ensure timestamp is properly parsed
        const chatDate = chat.timestamp ? new Date(chat.timestamp) : new Date();
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Check if the date is valid
        if (isNaN(chatDate.getTime())) {
          return { ...chat, timeGroup: 'Today' }; // Default to Today if date is invalid
        }
        
        const diffTime = Math.abs(today.getTime() - chatDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Format date for month and year display
        const monthYear = chatDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        const year = chatDate.getFullYear();

        if (chatDate.toDateString() === today.toDateString()) {
          return { ...chat, timeGroup: 'Today' };
        } else if (chatDate.toDateString() === yesterday.toDateString()) {
          return { ...chat, timeGroup: 'Yesterday' };
        } else if (diffDays <= 7) {
          return { ...chat, timeGroup: 'Previous 7 days' };
        } else if (diffDays <= 30) {
          return { ...chat, timeGroup: 'Previous 30 days' };
        } else if (chatDate.getFullYear() === today.getFullYear()) {
          return { ...chat, timeGroup: monthYear };
        } else {
          return { ...chat, timeGroup: year.toString() };
        }
      };

      const formattedData = data.map(chat => groupChatsByTimePeriod(chat));
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



  useEffect(() => {
    if (chatHistory.length > 0) {
      const updatedHistory = chatHistory.map((chat) => ({
        ...chat,
        isActive: chat.id === chatId,
      }));
      setChatHistory(updatedHistory);
    }
  }, [chatId]);



  const handleSubmit = async (message: string) => {
    try {
      setLoading(true);
      setIsResponseLoading(true);

      // Get user ID from localStorage
      const userId = localStorage.getItem("user_id") || "";

      // Create new message
      const userMessage: Message = {
        text: message,
        isUserMessage: true,
        timestamp: new Date().toLocaleTimeString(),
        button_display: false,
        number_of_buttons: 0,
        button_text: [],
        history_id: Date.now().toString()
      };

      setMessages(prevMessages => [...prevMessages, userMessage]);

      const response = await generalChat({
        question: message,  
        user_id: userId,
      });

      if (response) {
        // Store the chatId for subsequent messages
        if (response.chat_id) {
          setCurrentChatId(response.chat_id);
        }

        const botMessage: Message = {
          text: response.answer,
          isUserMessage: false,
          timestamp: new Date().toLocaleTimeString(),
          button_display: response.display_settings?.button_display || false,
          number_of_buttons: response.display_settings?.options?.buttons?.length || 0,
          button_text: response.display_settings?.options?.buttons || [],
          ticket: response.display_settings?.ticket || false,
          ticket_options: response.display_settings?.options?.ticket_options || undefined,
          history_id: response.display_settings?.message_history[
            response.display_settings.message_history.length - 1
          ]?.history_id,
          like: response.display_settings?.message_history[
            response.display_settings.message_history.length - 1
          ]?.like,
          un_like: response.display_settings?.message_history[
            response.display_settings.message_history.length - 1
          ]?.un_like,
        };
        
        setMessages(prevMessages => [...prevMessages, botMessage]);
      }

    } catch (error) {
      console.error('Error:', error);
      // Add error message to chat
      const errorMessage: Message = {
        text: error instanceof Error ? error.message : "An error occurred",
        isUserMessage: false,
        timestamp: new Date().toLocaleTimeString(),
        button_display: false,
        number_of_buttons: 0,
        button_text: [],
        history_id: Date.now().toString()
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
      setIsResponseLoading(false);
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


  // const handleSubmit = async (message: string) => {
  //   try {
  //     setLoading(true);
  //     setIsResponseLoading(true);

  //     const userMessage: Message = {
  //       text: message,
  //       isUserMessage: true,
  //       timestamp: new Date().toLocaleTimeString(),
  //       history_id: Date.now().toString()
  //     };

  //     setMessages(prevMessages => [...prevMessages, userMessage]);

  //     // TODO: Implement your general chat API call here
  //     // const response = await generalChatApi(message, currentChatId);

  //     // Placeholder bot response
  //     setTimeout(() => {
  //       const botMessage: Message = {
  //         text: "This is a placeholder response. Implement your API call here.",
  //         isUserMessage: false,
  //         timestamp: new Date().toLocaleTimeString(),
  //         history_id: Date.now().toString()
  //       };
  //       setMessages(prevMessages => [...prevMessages, botMessage]);
  //       setLoading(false);
  //       setIsResponseLoading(false);
  //     }, 1000);

  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

  const handleGetChat = async (chatId: string) => {
    try {
      const data = await getHistory(chatId);
      const flattenedMessages = data.flat().map((message) => ({
        ...message,
        isFromHistory: true,
      }));
      setMessages(flattenedMessages);
      setCurrentChatId(chatId);
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

  // Add file upload handler


  // Render messages with loading state

  return (
    <>
      <SiteHeader />
      <div className="absolute inset-x-0 bottom-0 top-14">
        <div style={containerStyle}>
          <div className="flex-shrink-0 border-r border-gray-200">
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

          <div className="flex-grow pt-0 w-[1200px] pb-4 px-4">

            <div style={chatScreenStyle}>
              <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto px-4 py-3">

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

                <div className="flex-shrink-0 mt-auto">
                <div className="p-3">
                    <InputBar
                      onSubmit={handleSubmit}
                      loading={loading}
                      enableVoiceInput={true}
                      enableFileUpload={true}
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