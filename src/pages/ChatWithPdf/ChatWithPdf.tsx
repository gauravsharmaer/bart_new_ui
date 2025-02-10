import React, { useState, useRef, useEffect } from "react";
import HistorySideBar from "../../components/HistorySideBar";
import BackGround from "../../assets/bg_frame.svg";
import SiteHeader from "../../components/Navbar"; // Import the SiteHeader component
import NewChatInputBar from "../../components/Inputbar";
import PdfFileDisplay from '../../pages/ChatWithPdf/PdfFileDisplay';
import PdfFileList from "../../pages/ChatWithPdf/PdfFileList"; // Ensure this is imported
import { getPdfChatHistory, deleteChat, renameChat, chatWithDocs, getHistory } from "../../Api/CommonApi";
import { ChatHistory } from "../../Interface/Interface";
import PdfMessage from '../ChatWithPdf/pdfMessage';
import ChatMessage from "../../components/ChatMessage";
import PdfSidebar from '../ChatWithPdf/pdfSidebar';
import DotLoader from "../../utils/DotLoader"; // Add this import at the top
import Genie from "../../assets/Genie.svg";
import { createTimestamp } from "../../utils/chatUtils";
// TypeScript interfaces
interface ApiResponse {
  response: string;
  sources?: string[];
}

interface Message {
  text: string;
  isUserMessage: boolean;
  timestamp: string;
  button_display: boolean;
  number_of_buttons: number;
  button_text: string[];
  pdfFile?: File;
  history_id: string;
  like?: boolean;
  un_like?: boolean;
}

interface ChatResponse {
  response: string;
}

export interface ChatInputBarProps {
  onSubmit: (message: string) => void;
  loading?: boolean;
  onFileUpload?: (file: File) => void;
}

const PDFChat = () => {
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [pdfUrls, setPdfUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPdfSidebarOpen, setIsPdfSidebarOpen] = useState(false); // State for PdfSidebar
  const [pdfId, setPdfId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isResponseLoading, setIsResponseLoading] = useState(false); // Add this state
  const [isHistoryMode, setIsHistoryMode] = useState<boolean>(false); // New state for history mode
  const [chatId, setChatId] = useState<string | null>(null);
  // Add these styles from ChatUi
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

  const handleFileUpload = (file: File) => {
    if (file.type === "application/pdf") {
      setPdfFiles([file]);
      setCurrentChatId(null); // Reset chat context
      setMessages([]); // Clear messages
    } else {
      setError('Please upload a PDF file');
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setPdfFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
    // Reset the file input reference
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the input value
    }
  };

  const handleSubmit = async (message: string) => {
    if (!pdfFiles[0] && !currentChatId) {
      setError('Please upload a PDF first');
      return;
    }

    try {
      setLoading(true);
      setIsResponseLoading(true);

      // Get user ID from localStorage
      const userId = localStorage.getItem("user_id") || "";

      // Create new message
      const userMessage: Message = {
        text: message,
        isUserMessage: true,
        timestamp: createTimestamp(),
        button_display: false,
        number_of_buttons: 0,
        button_text: [],
        pdfFile: !currentChatId ? pdfFiles[0] : undefined,
        history_id: createTimestamp()

      };

      setMessages(prevMessages => [...prevMessages, userMessage]);

      // Only create PDF URL if it's the first message
      if (!currentChatId && pdfFiles[0]) {
        const pdfUrl = URL.createObjectURL(pdfFiles[0]);
        setPdfUrls([pdfUrl]);
      }

      // Make API call with the PDF file
      const response = await chatWithDocs(
        pdfFiles[0],
        userId,
        message,
        currentChatId || undefined
      );
      
      if (response) {
        // Store the chatId for subsequent messages
        if (response.chat_id) {
          setCurrentChatId(response.chat_id);
        }

        const botMessage: Message = {
          text: response.answer,
          isUserMessage: false,
          timestamp: createTimestamp(),
          button_display: false,
          number_of_buttons: 0,
          button_text: [],
          history_id: createTimestamp()

        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      }

    } catch (error) {
      console.error('Error:', error);
      setError('Failed to send message');
    } finally {
      setLoading(false);
      setIsResponseLoading(false); // Set response loading to false
    }
  };

  // Handle like/dislike functions
  const handleLike = async (messageId: string) => {
    const updatedMessages = messages.map(msg => {
      if (msg.history_id === messageId) {
        return { ...msg, like: true, un_like: false };
      }
      return msg;
    });
    setMessages(updatedMessages);
  };

  const handleDislike = async (messageId: string) => {
    const updatedMessages = messages.map(msg => {
      if (msg.history_id === messageId) {
        return { ...msg, like: false, un_like: true };
      }
      return msg;
    });
    setMessages(updatedMessages);
  };

  const handleGetChat = async (chatId: string) => {
    try {
      const data = await getHistory(chatId);
      console.log("Full chat history response:", data);

      // Find the chat details from chatHistory array
      const chatDetails = chatHistory.find(chat => chat.id === chatId);
      if (chatDetails) {
        // console.log("Chat details:", chatDetails);
        
        // Use the file_path directly from the chat details
        if (chatDetails.file_path) {
          setPdfUrls([chatDetails.file_path]);
          setIsPdfSidebarOpen(false);
        }
      }

      const flattenedMessages = data.flat().map((message) => ({
        ...message,
        isFromHistory: true,
      }));
      setMessages(flattenedMessages);
      setCurrentChatId(chatId);
      setPdfFiles([]); // Reset PDF files array
      setIsHistoryMode(true); // Set history mode when a chat is selected
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  const fetchPdfChatHistory = async () => {
    try {
      const userId = localStorage.getItem("user_id") || "";
      const data = await getPdfChatHistory(userId);
      const formattedData = data.map((chat, index) => {
        // Remove "Document Chat - " from the name
        const nameWithoutPrefix = chat.name.replace(/^Document Chat - /, '');

        return {
          ...chat,
          name: nameWithoutPrefix, // Update the name without the prefix
          isActive: chat.id === pdfId,
        };
      });

      setChatHistory(formattedData);
    } catch (error) {
      console.error("Error fetching PDF chat history:", error);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleNewMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  useEffect(() => {
    if (chatHistory.length > 0) {
      const updatedHistory = chatHistory.map((chat) => ({
        ...chat,
        isActive: chat.id === pdfId,
      }));
      setChatHistory(updatedHistory);
    }
  }, [pdfId]);

  const handleDeleteChat = async (chatId: string) => {
    await deleteChat(chatId);
  };

  const handleRenameChat = async (chatId: string, newName: string) => {
    await renameChat(chatId, newName);
  };

  useEffect(() => {
    fetchPdfChatHistory();
  }, []);

  const renderMessages = () => {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {/* Display PDF URL for both history and new chats */}
        {(pdfUrls[0] || (messages[0]?.pdfFile)) && (
          <div className="flex justify-end mb-[-25px]">
            <PdfFileDisplay
              fileName={
                currentChatId 
                  ? chatHistory.find(chat => chat.id === currentChatId)?.original_file_name || "PDF Document"
                  : messages[0]?.pdfFile?.name || "PDF Document"
              }
              onClick={() => {
                setIsPdfSidebarOpen(true);
              }}
            />
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className="mb-2">
            <ChatMessage
              message={message}
              chatId={currentChatId || ""}
              onNewMessage={handleNewMessage}
              setMessages={setMessages}
              onLike={handleLike}
              onDislike={handleDislike}
              inline={false}
              isPdfContext={true}
            />
          </div>

        ))}
        
        {/* Response Loading Indicator */}
        {isResponseLoading && (
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
      </div>
    );
  };

  return (
    <>
      <SiteHeader />

      {/* Existing Content */}
      <div className="absolute inset-x-0 bottom-0 top-14">
        <div style={containerStyle}>
          {/* Sidebar */}
          <div className="flex-shrink-0 border-r border-gray-200">
            <HistorySideBar
              chatHistory={chatHistory}
              isLoading={isHistoryLoading}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} // Toggle for HistorySideBar
              onChatSelect={handleGetChat}
              onDeleteChat={handleDeleteChat}
              onRenameChat={handleRenameChat}
              setChatHistory={setChatHistory}
              maxWidth="250px"
            />
          </div>

          {/* Main Chat Section */}
          <div className={`flex-grow pt-0 w-[1200px] pb-4 px-4 transition-all duration-300 ${isPdfSidebarOpen ? 'mr-[460px]' : ''}`}>
            <div style={chatScreenStyle}>
              <div className="flex flex-col h-full">
                {/* Messages Area */}
                {renderMessages()}
                {/* Bottom Section */}
                <div className="flex-shrink-0 mt-auto">
                  {/* PDF Files Display - Only show if no messages yet */}
                  {pdfFiles.length > 0 && messages.length === 0 && (
                    <div className="px-4">
                      <PdfFileList
                        pdfFiles={pdfFiles}
                        onRemove={handleRemoveFile}
                      />
                    </div>
                  )}

                  {/* Chat Input */}
                  <div className="p-3">
                    <NewChatInputBar
                      onSubmit={handleSubmit}
                      onFileUpload={handleFileUpload}
                      loading={loading}
                      enableFileUpload={!isHistoryMode} // Disable upload icons if in history mode
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PDF Viewer Sidebar */}
          <PdfSidebar 
            isOpen={isPdfSidebarOpen} // State for PdfSidebar
            onClose={() => setIsPdfSidebarOpen(false)} // Close PdfSidebar
            pdfUrl={pdfUrls[0] || ''}
          />
        </div>
      </div>
    </>
  );
};

export default PDFChat;