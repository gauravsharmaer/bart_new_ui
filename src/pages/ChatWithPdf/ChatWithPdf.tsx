import React, { useState, useRef, useEffect } from "react";
import HistorySideBar from "../../components/HistorySideBar";
import BackGround from "../../assets/bg_frame.svg";
import SiteHeader from "../../components/Navbar"; // Import the SiteHeader component
import NewChatInputBar from "../../components/NewChatInputBar";
import PdfFileDisplay from '../../pages/ChatWithPdf/PdfFileDisplay';
import PdfFileList from "../../pages/ChatWithPdf/PdfFileList"; // Ensure this is imported
import { getPdfChatHistory, deleteChat, renameChat, chatWithDocs, getHistory } from "../../Api/CommonApi";
import { ChatHistory } from "../../Interface/Interface";
import PdfMessage from './PdfMessage';
import PdfSidebar from './PdfSidebar';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPdfSidebarOpen, setIsPdfSidebarOpen] = useState(false); // State for PdfSidebar
  const [pdfId, setPdfId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

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
    setPdfFiles([file]);
    setCurrentChatId(null); // Reset chat context
    setMessages([]); // Clear messages
  };

  const handleRemoveFile = (fileName: string) => {
    setPdfFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  const handleSubmit = async (message: string) => {
    if (!pdfFiles[0] && !currentChatId) {
      setError('Please upload a PDF first');
      return;
    }

    try {
      setLoading(true);

      // Create new message
      const userMessage: Message = {
        text: message,
        isUserMessage: true,
        timestamp: new Date().toLocaleTimeString(),
        button_display: false,
        number_of_buttons: 0,
        button_text: [],
        pdfFile: !currentChatId ? pdfFiles[0] : undefined, // Only include PDF for first message
        history_id: Date.now().toString()
      };

      setMessages(prevMessages => [...prevMessages, userMessage]);

      // Only create PDF URL if it's the first message
      if (!currentChatId && pdfFiles[0]) {
        const pdfUrl = URL.createObjectURL(pdfFiles[0]);
        setPdfUrls([pdfUrl]);
      }

      // Make API call with chatId if it exists
      const response = await chatWithDocs(
        pdfFiles[0],
        "674eaffe7cbb08e51f7adada",
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
          timestamp: new Date().toLocaleTimeString(),
          button_display: false,
          number_of_buttons: 0,
          button_text: [],
          history_id: Date.now().toString()
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      }

    } catch (error) {
      console.error('Error:', error);
      setError('Failed to send message');
    } finally {
      setLoading(false);
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
      const flattenedMessages = data.flat().map((message) => ({
        ...message,
        isFromHistory: true,
      }));
      setMessages(flattenedMessages);
      setPdfFiles([]); // Optionally reset the PDF files if needed
      setPdfUrls([]); // Optionally reset the PDF URLs if needed
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  const fetchPdfChatHistory = async () => {
    try {
      const userId = localStorage.getItem("user_id") || "";
      const data = await getPdfChatHistory(userId);
      const formattedData = data.map((chat, index) => {
        let status;
        if (index === 0) {
          status = "Reviewed";
        } else if (chat.name.startsWith("Doc") || chat.name.includes("D")) {
          status = "Analyzed";
        } else if ([1, 2, 5, 6].includes(index)) {
          status = "Processing";
        }

        const timestamp = `${index + 1} day${index === 0 ? "" : "s"} ago`;

        return {
          ...chat,
          isActive: chat.id === pdfId,
          ...(status ? { status } : { timestamp }),
        };
      });

      setChatHistory(formattedData);
    } catch (error) {
      console.error("Error fetching PDF chat history:", error);
    } finally {
      setIsHistoryLoading(false);
    }
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
        {messages.map((message, index) => (
          <div key={index} className="mb-2">
            {/* Show messages with PDF file display for user messages */}
            {message.isUserMessage && message.pdfFile && (
              <div className="flex flex-col items-end space-y-[-25px]">
                <PdfFileDisplay
                  fileName={message.pdfFile.name}
                  onClick={() => {
                    const pdfUrl = URL.createObjectURL(message.pdfFile);
                    setPdfUrls([pdfUrl]);
                    setIsPdfSidebarOpen(true); // Open the PdfSidebar when PDF is clicked
                  }}
                />
                <PdfMessage
                  message={message}
                  onNewMessage={(newMessage) => {
                    setMessages(prev => [...prev, newMessage]);
                  }}
                  onLike={handleLike}
                  onDislike={handleDislike}
                />
              </div>
            )}
            
            {/* Show regular messages without PDF */}
            {(!message.isUserMessage || !message.pdfFile) && (
              <PdfMessage
                message={message}
                onNewMessage={(newMessage) => {
                  setMessages(prev => [...prev, newMessage]);
                }}
                onLike={handleLike}
                onDislike={handleDislike}
              />
            )}
          </div>
        ))}
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
            />
          </div>

          {/* Main Chat Section */}
          <div className={`flex-grow pt-0 w-[1200px] pb-4 px-4 transition-all duration-300 ${isPdfSidebarOpen ? 'mr-[550px]' : ''}`}>
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
