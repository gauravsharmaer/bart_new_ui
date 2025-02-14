import { useState, useRef, useEffect } from "react";
import HistorySideBar from "../../components/HistorySideBar";
import BackGround from "../../assets/bg_frame.svg";
import SiteHeader from "../../components/Navbar"; // Import the SiteHeader component
import NewChatInputBar from "../../components/Inputbar";
import PdfFileDisplay from "../../pages/ChatWithPdf/PdfFileDisplay";
import PdfFileList from "../../pages/ChatWithPdf/PdfFileList"; // Ensure this is imported
import {
  getPdfChatHistory,
  deleteChat,
  renameChat,
  chatWithDocs,
  getHistory,
  unlikeChat,
  likeChat,
} from "../../Api/CommonApi";
import { ChatHistory } from "../../Interface/Interface";
import ChatMessage from "../../components/ChatMessage";
import PdfSidebar from "../ChatWithPdf/pdfSidebar";
import DotLoader from "../../utils/DotLoader"; // Add this import at the top
import Genie from "../../assets/Genie.svg";
// import { createTimestamp } from "../../utils/chatUtils";
import { Message } from "../../Interface/Interface";
import DarkBackground from "../../assets/DarkChat.svg";
import { useSelector, useDispatch } from "react-redux"; // Import useSelector and useDispatch
import { RootState } from "../../redux/store"; // Import RootState
import { createBotMessagechatUi, createErrorMessage, createUserMessagechatUiPdf } from "../../utils/chatFields";
import { resetNewChatFlag } from "../../redux/chatSlice";
const PDFChat = () => {
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [pdfUrls, setPdfUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPdfSidebarOpen, setIsPdfSidebarOpen] = useState(false); // State for PdfSidebar
  // const [pdfId, setPdfId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isResponseLoading, setIsResponseLoading] = useState(false); // Add this state
  const [isHistoryMode, setIsHistoryMode] = useState<boolean>(false); // New state for history mode
  const isInitializedRef = useRef(false);
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  const { isNewChat } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

  const handleFileUpload = (file: File) => {
    if (file.type === "application/pdf") {
      setPdfFiles([file]);
      setCurrentChatId(null); // Reset chat context
      setMessages([]); // Clear messages
      localStorage.removeItem("chat_id"); // Clear stored chat ID
      isInitializedRef.current = false; // Reset initialization state
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
      return;
    }

    try {
      setLoading(true);
      setIsResponseLoading(true);

      const userId = localStorage.getItem("user_id") || "";
      const userMessage = createUserMessagechatUiPdf(message, pdfFiles[0], currentChatId);
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      // Only create PDF URL if it's the first message
      if (!currentChatId && pdfFiles[0]) {
        const pdfUrl = URL.createObjectURL(pdfFiles[0]);
        setPdfUrls([pdfUrl]);
      }

      // Make API call with the PDF file and chat_id based on initialization state
      const response = await chatWithDocs(
        pdfFiles[0],
        userId,
        message,
        isInitializedRef.current ? (localStorage.getItem("chat_id") || undefined) : undefined
      );

      if (response) {
        if (response.chat_id) {
          setCurrentChatId(response.chat_id);
          localStorage.setItem("chat_id", response.chat_id);
          
          // Only fetch history if this was an initial message
          if (!isInitializedRef.current) {
            fetchPdfChatHistory();
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
      setIsResponseLoading(false);
    }
  };

  // Handle like/dislike functions
  // const handleLike = async (messageId: string) => {
  //   const updatedMessages = messages.map((msg) => {
  //     if (msg.history_id === messageId) {
  //       return { ...msg, like: true, un_like: false };
  //     }
  //     return msg;
  //   });
  //   setMessages(updatedMessages);
  // };

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

  // const handleDislike = async (messageId: string) => {
  //   const updatedMessages = messages.map((msg) => {
  //     if (msg.history_id === messageId) {
  //       return { ...msg, like: false, un_like: true };
  //     }
  //     return msg;
  //   });
  //   setMessages(updatedMessages);
  // };


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

  const handleGetChat = async (chatId: string) => {
    try {
      const data = await getHistory(chatId);
      console.log("Full chat history response:", data);

      // Find the chat details from chatHistory array
      const chatDetails = chatHistory.find((chat) => chat.id === chatId);
      if (chatDetails) {
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
      localStorage.setItem("chat_id", chatId); // Store chat ID in localStorage
      isInitializedRef.current = true; // Mark as initialized since we're loading an existing chat
      setPdfFiles([]); // Reset PDF files array
      setIsHistoryMode(true);
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  const fetchPdfChatHistory = async () => {
    try {
      const userId = localStorage.getItem("user_id") || "";
      const data = await getPdfChatHistory(userId);
      const formattedData = data.map((chat) => {
        // Remove "Document Chat - " from the name
        const nameWithoutPrefix = chat.name.replace(/^Document Chat - /, "");

        return {
          ...chat,
          name: nameWithoutPrefix, // Update the name without the prefix
          //isActive: chat.id === chatId,
        };
      })

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


  const handleDeleteChat = async (chatId: string) => {
    await deleteChat(chatId);
  };

  const handleRenameChat = async (chatId: string, newName: string) => {
    await renameChat(chatId, newName);
  };

  useEffect(() => {
    fetchPdfChatHistory();
  }, []);

  // Reset chat when a new chat is initiated
  useEffect(() => {
    if (isNewChat) {
      resetChat(); // Reset chat state
      setMessages([]); // Clear messages
      setCurrentChatId(null); // Clear current chat ID
      localStorage.removeItem("chat_id"); // Clear stored chat ID
      // Reset the isNewChat flag after handling the new chat initialization
      dispatch(resetNewChatFlag());
    }
  }, [isNewChat, dispatch]);

  const resetChat = () => {
    setPdfFiles([]);
    setPdfUrls([]);
    setIsHistoryMode(false);
    isInitializedRef.current = false;
  };

  const renderMessages = () => {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {/* Display PDF URL for both history and new chats */}
        {(pdfUrls[0] || messages[0]?.pdfFile) && (
          <div className="flex justify-end mb-[-25px]">
            <PdfFileDisplay
              fileName={
                currentChatId
                  ? chatHistory.find((chat) => chat.id === currentChatId)
                      ?.original_file_name || "PDF Document"
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
                <span className="text-sm font-semibold mr-2">BART Genie</span>
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
      <div className="h-full flex p-[0px] box-border bg-[#f3f5f9]">

          {/* Sidebar */}
          <div className="flex-shrink-0">
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
          <div className={`flex-grow pt-0 w-[1200px] pb-4 px-4 pl-3 pr-3 dark:bg-[#000000] transition-all duration-300 ${isPdfSidebarOpen ? 'mr-[460px]' : ''}`}>
          <div className="w-full h-[calc(100%-2px)] mt-2 rounded-[16px] overflow-hidden bg-cover bg-center"
                     style={{ backgroundImage: `url(${isDarkMode ? DarkBackground : BackGround})` }}>
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
            pdfUrl={pdfUrls[0] || ""}
          />
        </div>
      </div>
    </>
  );
};

export default PDFChat;
