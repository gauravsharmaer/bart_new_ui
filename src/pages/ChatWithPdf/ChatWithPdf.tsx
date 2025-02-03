// import React, { useState, useRef, useEffect } from "react";
// import {
//   PdfViewerComponent,
//   Toolbar,
//   Magnification,
//   Navigation,
//   LinkAnnotation,
//   BookmarkView,
//   ThumbnailView,
//   Print,
//   TextSelection,
//   TextSearch,
//   Annotation,
//   FormFields,
//   Inject,
// } from "@syncfusion/ej2-react-pdfviewer";
// import HistorySideBar from "../../components/HistorySideBar";
// import { getHistory } from "../../Api/CommonApi"; // Ensure this import is present
// // import { createTimestamp } from '../../utils/chatUtils';
// import ChatLogo from "../../assets/Genie.svg";
// import BackGround from "../../assets/bg_frame.svg";
// import SiteHeader from "../../components/Navbar"; // Import the SiteHeader component
// import NewChatInputBar from "../../components/NewChatInputBar";
// // import FileUploadBar from "../../components/FileUploadBar";
// // import PdfFileDisplay from "../../components/PdfFileDisplay";
// // import pdfDisplayIcon from "../../assets/Pdf Display.svg"; // Import the PDF display icon
// // import { X } from 'lucide-react';
// import PdfFileList from "../../pages/ChatWithPdf/PdfFileList"; // Ensure this is imported
// import pdfIcon from "../../assets/document.svg"; // Make sure you have this icon
// // import { formatTimestamp } from '../../utils/dateUtils';
// import { chatWithDocs } from "../../Api/CommonApi";
// import { getPdfChatHistory, deleteChat, renameChat } from "../../Api/CommonApi";
// import { ChatHistory } from "../../Interface/Interface";
// // Import Syncfusion styles
// import "@syncfusion/ej2-base/styles/material.css";
// import "@syncfusion/ej2-buttons/styles/material.css";
// import "@syncfusion/ej2-inputs/styles/material.css";
// import "@syncfusion/ej2-popups/styles/material.css";
// import "@syncfusion/ej2-lists/styles/material.css";
// import "@syncfusion/ej2-navigations/styles/material.css";
// import "@syncfusion/ej2-dropdowns/styles/material.css";
// import "@syncfusion/ej2-react-pdfviewer/styles/material.css";

// // TypeScript interfaces
// interface ApiResponse {
//   response: string;
//   sources?: string[];
// }

// interface Message {
//   text: string;
//   isUserMessage: boolean;
//   timestamp: string;
//   button_display: boolean;
//   number_of_buttons: number;
//   button_text: string[];
//   pdfFile?: File;
// }

// interface ChatResponse {
//   response: string;
// }

// export interface ChatInputBarProps {
//   onSubmit: (message: string) => void;
//   loading?: boolean;
//   onFileUpload?: (file: File) => void;
// }

// const PDFChat = () => {
//   const [pdfFiles, setPdfFiles] = useState<File[]>([]);
//   const [pdfUrls, setPdfUrls] = useState<string[]>([]);
//   const [question, setQuestion] = useState<string>("");
//   const [response, setResponse] = useState<string>("");
//   const [sources, setSources] = useState<string[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const [success, setSuccess] = useState<string>("");
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const pdfViewerRef = useRef<PdfViewerComponent>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [showPdfPreview, setShowPdfPreview] = useState(false);
//   const [pdfId, setPdfId] = useState<string | null>(null);
//   const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
//   const [isHistoryLoading, setIsHistoryLoading] = useState(true);

//   // Add these styles from ChatUi
//   const chatScreenStyle: React.CSSProperties = {
//     backgroundImage: `url(${BackGround})`,
//     backgroundRepeat: "no-repeat",
//     backgroundPosition: "center center",
//     backgroundSize: "cover",
//     borderRadius: "16px",
//     overflow: "hidden",
//     height: "calc(100% - 15px)",
//     width: "100%",
//     marginTop: "16px",
//   };

//   const containerStyle: React.CSSProperties = {
//     backgroundColor: "#f3f5f9",
//     height: "100%",
//     display: "flex",
//     padding: "2px",
//     boxSizing: "border-box",
//   };

//   const generatePdfId = (fileName: string) => {
//     return `pdf_${fileName.replace(/\s+/g, "_")}_${Date.now()}`;
//   };

//   const savePDFLocally = async (file: File) => {
//     try {
//       // Request permission to access local file system
//       const dirHandle = await window.showDirectoryPicker({
//         mode: "readwrite",
//       });

//       // Create or get the 'uploads' directory
//       let uploadsDirHandle;
//       try {
//         uploadsDirHandle = await dirHandle.getDirectoryHandle("uploads", {
//           create: true,
//         });
//       } catch (err) {
//         console.error("Error creating or accessing uploads directory:", err);
//         setError(
//           "Failed to access uploads directory: " + (err as Error).message
//         );
//         return;
//       }

//       // Create a new file in the 'uploads' directory
//       const fileHandle = await uploadsDirHandle.getFileHandle(file.name, {
//         create: true,
//       });

//       // Get a writable stream
//       const writable = await fileHandle.createWritable();

//       // Write the file content
//       await writable.write(file);
//       await writable.close();

//       // Log the path where the file is saved
//       console.log(
//         `PDF "${file.name}" saved locally in the "uploads" directory!`
//       );

//       // Set success message
//       setSuccess(
//         `PDF "${file.name}" saved locally in the "uploads" directory!`
//       );
//     } catch (err) {
//       console.error("Error saving file locally:", err);
//       setError("Failed to save file locally: " + (err as Error).message);
//     }
//   };

//   const handleFileUpload = (file: File) => {
//     setPdfFiles((prevFiles) => [...prevFiles, file]);
//   };

//   const handleRemoveFile = (fileName: string) => {
//     setPdfFiles((prevFiles) =>
//       prevFiles.filter((file) => file.name !== fileName)
//     );
//   };

//   const handlePdfPreview = () => {
//     setShowPdfPreview(true);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     console.log("File dropped");
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     if (file) {
//       handleFileUpload(file);
//     }
//   };

//   const handleSubmit = async (message: string) => {
//     const response = await chatWithDocs(
//       pdfFiles[0],
//       "674eaffe7cbb08e51f7adada",
//       message
//     );
//     console.log(response);
//     setPdfFiles([]);
//   };

//   const handleGetChat = async (chatId: string) => {
//     try {
//       const data = await getHistory(chatId);
//       const flattenedMessages = data.flat().map((message) => ({
//         ...message,
//         isFromHistory: true,
//       }));
//       setMessages(flattenedMessages);
//       setPdfFiles([]); // Optionally reset the PDF files if needed
//       setPdfUrls([]); // Optionally reset the PDF URLs if needed
//     } catch (error) {
//       console.error("Error fetching chat:", error);
//     }
//   };

//   const fetchPdfChatHistory = async () => {
//     try {
//       const userId = localStorage.getItem("user_id") || "";
//       const data = await getPdfChatHistory(userId);
//       const formattedData = data.map((chat, index) => {
//         // Status logic with new names
//         let status;
//         if (index === 0) {
//           status = "Reviewed";
//         } else if (chat.name.startsWith("Doc") || chat.name.includes("D")) {
//           status = "Analyzed";
//         } else if ([1, 2, 5, 6].includes(index)) {
//           status = "Processing";
//         }

//         // Generate a timestamp
//         const timestamp = `${index + 1} day${index === 0 ? "" : "s"} ago`;

//         // Return either status or timestamp
//         return {
//           ...chat,
//           isActive: chat.id === pdfId,
//           ...(status ? { status } : { timestamp }),
//         };
//       });

//       setChatHistory(formattedData);
//     } catch (error) {
//       console.error("Error fetching PDF chat history:", error);
//     } finally {
//       setIsHistoryLoading(false);
//     }
//   };

//   // Update chat history when pdfId changes
//   useEffect(() => {
//     if (chatHistory.length > 0) {
//       const updatedHistory = chatHistory.map((chat) => ({
//         ...chat,
//         isActive: chat.id === pdfId,
//       }));
//       setChatHistory(updatedHistory);
//     }
//   }, [pdfId]);

//   const handleDeleteChat = async (chatId: string) => {
//     await deleteChat(chatId);
//   };

//   const handleRenameChat = async (chatId: string, newName: string) => {
//     await renameChat(chatId, newName);
//   };

//   useEffect(() => {
//     fetchPdfChatHistory();
//   }, []);

//   const renderChatContent = () => {
//     if (!showPdfPreview && pdfFiles.length) {
//       // Show PDF display when file is uploaded but preview is not shown
//       return (
//         <div className="flex flex-col space-y-4">
//           <PdfDisplay
//             fileName={pdfFiles[0].name}
//             fileType="PDF"
//             onClick={handlePdfPreview}
//           />
//           {messages.map((message, index) => (
//             <div
//               key={index}
//               className={`flex ${
//                 message.isUserMessage ? "justify-end" : "justify-start"
//               }`}
//             >
//               {!message.isUserMessage && (
//                 <img
//                   src={ChatLogo}
//                   alt="BART Genie"
//                   className="w-8 h-8 rounded-full mr-2"
//                 />
//               )}
//               <div
//                 className={`max-w-[80%] rounded-lg p-3 ${
//                   message.isUserMessage
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-100"
//                 }`}
//               >
//                 {message.text}
//               </div>
//             </div>
//           ))}
//         </div>
//       );
//     }

//     if (showPdfPreview) {
//       return (
//         <div className="grid grid-cols-2 gap-6 h-full">
//           <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//             <PdfViewerComponent
//               ref={pdfViewerRef}
//               id="container"
//               documentPath={pdfUrls[0]}
//               serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/pdfviewer"
//               style={{ height: "100%" }}
//             >
//               <Inject
//                 services={[
//                   Toolbar,
//                   Magnification,
//                   Navigation,
//                   LinkAnnotation,
//                   BookmarkView,
//                   ThumbnailView,
//                   Print,
//                   TextSelection,
//                   TextSearch,
//                   Annotation,
//                   FormFields,
//                 ]}
//               />
//             </PdfViewerComponent>
//           </div>
//           <div className="flex flex-col space-y-4 overflow-y-auto">
//             {messages.map((message, index) => (
//               <div
//                 key={index}
//                 className={`flex ${
//                   message.isUserMessage ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 {!message.isUserMessage && (
//                   <img
//                     src={ChatLogo}
//                     alt="BART Genie"
//                     className="w-8 h-8 rounded-full mr-2"
//                   />
//                 )}
//                 <div
//                   className={`max-w-[80%] rounded-lg p-3 ${
//                     message.isUserMessage
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-100"
//                   }`}
//                 >
//                   {message.text}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       );
//     }

//     // Show just messages if no PDF
//     return (
//       <div className="flex flex-col space-y-4">
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               message.isUserMessage ? "justify-end" : "justify-start"
//             }`}
//           >
//             {!message.isUserMessage && (
//               <img
//                 src={ChatLogo}
//                 alt="BART Genie"
//                 className="w-8 h-8 rounded-full mr-2"
//               />
//             )}
//             <div
//               className={`max-w-[80%] rounded-lg p-3 ${
//                 message.isUserMessage ? "bg-blue-600 text-white" : "bg-gray-100"
//               }`}
//             >
//               {message.text}
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <>
//       <SiteHeader />

//       {/* Existing Content */}
//       <div className="absolute inset-x-0 bottom-0 top-14">
//         <div style={containerStyle}>
//           {/* Sidebar */}
//           <div className="flex-shrink-0 border-r border-gray-200">
//             <HistorySideBar
//               chatHistory={chatHistory}
//               isLoading={isHistoryLoading}
//               isSidebarOpen={isSidebarOpen}
//               onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
//               onChatSelect={handleGetChat}
//               onDeleteChat={handleDeleteChat}
//               onRenameChat={handleRenameChat}
//               setChatHistory={setChatHistory}
//             />
//           </div>

//           {/* Main Chat Section */}
//           <div className="flex-grow p-4">
//             <div style={chatScreenStyle}>
//               <div className="flex flex-col h-full">
//                 {/* Messages Area */}
//                 <div className="flex-grow overflow-y-auto px-4 py-3">
//                   {messages.map((message, index) => (
//                     <div
//                       key={index}
//                       className={`flex ${
//                         message.isUserMessage ? "justify-end" : "justify-start"
//                       }`}
//                     >
//                       {!message.isUserMessage && (
//                         <img
//                           src={ChatLogo}
//                           alt="BART Genie"
//                           className="w-8 h-8 rounded-full mr-2"
//                         />
//                       )}
//                       <div
//                         className={`max-w-[80%] rounded-lg p-3 ${
//                           message.isUserMessage
//                             ? "bg-blue-600 text-white"
//                             : "bg-gray-100"
//                         }`}
//                       >
//                         {message.isUserMessage ? (
//                           <div className="flex flex-col items-end">
//                             {/* User Info */}
//                             <div className="flex items-center gap-2 mb-2">
//                               <span className="text-sm text-gray-600">
//                                 John Doe
//                               </span>
//                               <span className="text-xs text-gray-400">
//                                 {message.timestamp}
//                               </span>
//                             </div>

//                             {/* PDF File Display (if exists) */}
//                             {message.pdfFile && (
//                               <div className="flex items-center gap-2 bg-white rounded-lg p-3 mb-2 shadow-sm">
//                                 <img
//                                   src={pdfIcon}
//                                   alt="PDF"
//                                   className="w-8 h-8"
//                                 />
//                                 <div>
//                                   <p className="text-sm font-medium">
//                                     {message.pdfFile.name}
//                                   </p>
//                                   <p className="text-xs text-gray-500">
//                                     Click to open file
//                                   </p>
//                                 </div>
//                               </div>
//                             )}

//                             {/* Message Text */}
//                             <div className="bg-blue-600 text-white rounded-lg p-3 max-w-[80%]">
//                               {message.text}
//                             </div>
//                           </div>
//                         ) : (
//                           // Bot message rendering
//                           <div className="flex items-start gap-2">
//                             <img
//                               src={ChatLogo}
//                               alt="BART Genie"
//                               className="w-8 h-8 rounded-full"
//                             />
//                             <div className="bg-white shadow-sm rounded-lg p-3 max-w-[80%]">
//                               {message.text}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Bottom Section */}
//                 <div className="flex-shrink-0 mt-auto">
//                   {/* PDF Files Display */}
//                   {pdfFiles.length > 0 && (
//                     <div className="px-4">
//                       <PdfFileList
//                         pdfFiles={pdfFiles}
//                         onRemove={handleRemoveFile}
//                       />
//                     </div>
//                   )}

//                   {/* Chat Input */}
//                   <div className="px-4 py-3">
//                     <NewChatInputBar
//                       onSubmit={handleSubmit}
//                       onFileUpload={handleFileUpload}
//                       loading={loading}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PDFChat;





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
