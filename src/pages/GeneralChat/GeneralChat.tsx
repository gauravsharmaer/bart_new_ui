import React, { useState } from "react";
import HistorySideBar from "../../components/HistorySideBar";
import BackGround from "../../assets/bg_frame.svg";
import SiteHeader from "../../components/Navbar";
import NewChatInputBar from "../../components/Inputbar";
import { getHistory, deleteChat, renameChat } from "../../Api/CommonApi";
import { ChatHistory } from "../../Interface/Interface";
import DotLoader from "../../utils/DotLoader";
import Genie from "../../assets/Genie.svg";

interface Message {
  text: string;
  isUserMessage: boolean;
  timestamp: string;
  history_id: string;
  like?: boolean;
  un_like?: boolean;
}

const GeneralChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isResponseLoading, setIsResponseLoading] = useState(false);

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

  const handleSubmit = async (message: string) => {
    try {
      setLoading(true);
      setIsResponseLoading(true);

      const userMessage: Message = {
        text: message,
        isUserMessage: true,
        timestamp: new Date().toLocaleTimeString(),
        history_id: Date.now().toString()
      };

      setMessages(prevMessages => [...prevMessages, userMessage]);

      // TODO: Implement your general chat API call here
      // const response = await generalChatApi(message, currentChatId);

      // Placeholder bot response
      setTimeout(() => {
        const botMessage: Message = {
          text: "This is a placeholder response. Implement your API call here.",
          isUserMessage: false,
          timestamp: new Date().toLocaleTimeString(),
          history_id: Date.now().toString()
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
        setLoading(false);
        setIsResponseLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error:', error);
    }
  };

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
  const handleFileUpload = (file: File) => {
    if (file.type === "application/pdf") {
      // Handle PDF file upload for general chat
      console.log("PDF file uploaded:", file);
      // Add your PDF handling logic here
    } else {
      console.error('Please upload a PDF file');
    }
  };

  // Render messages with loading state
  const renderMessages = () => {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {messages.map((message, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-start">
              <img
                src={message.isUserMessage ? "user-avatar.png" : Genie}
                alt={message.isUserMessage ? "User" : "BART Genie"}
                className="w-8 h-8 rounded-full object-cover mr-2"
              />
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-sm font-semibold mr-2">
                    {message.isUserMessage ? "You" : "BART Genie"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {message.timestamp}
                  </span>
                </div>
                <div className="mt-1 text-sm">
                  {message.text}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isResponseLoading && (
          <div className="flex items-start w-full mt-2">
            <img
              src={Genie}
              alt="BART Genie"
              className="w-8 h-8 rounded-full object-cover mr-2"
            />
            <div className="flex-1">
              <div className="flex items-center">
                <span className="text-sm font-semibold mr-2">BART Genie</span>
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
      </div>
    );
  };

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
            />
          </div>

          <div className="flex-grow pt-0 w-[1200px] pb-4 px-4">
            <div style={chatScreenStyle}>
              <div className="flex flex-col h-full">
                {renderMessages()}
                <div className="flex-shrink-0 mt-auto p-3">
                  <NewChatInputBar
                    onSubmit={handleSubmit}
                    loading={loading}
                    enableVoiceInput={true}
                    enableFileUpload={true}
                    onFileUpload={handleFileUpload}
                  />
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