import React, { useState, useRef } from 'react';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, 
         LinkAnnotation, BookmarkView, ThumbnailView, Print, 
         TextSelection, TextSearch, Annotation, FormFields, 
         Inject } from '@syncfusion/ej2-react-pdfviewer';
import HistorySideBar from '../../components/HistorySideBar';
import { getHistory } from '../../Api/CommonApi'; // Ensure this import is present
import ChatLogo from "../../assets/Genie.svg";
import BackGround from "../../assets/bg_frame.svg";
import SiteHeader from './Navbar'; // Import the SiteHeader component
import NewChatInputBar from "../../components/NewChatInputBar";
// import FileUploadBar from "../../components/FileUploadBar";
import PdfFileList from "../../components/PdfFileList"; // Ensure this is imported
import pdfIcon from "../../assets/Pdf.svg"; // Make sure you have this icon
import PdfFileDisplay from '../../components/PdfFileDisplay'; // Add this import
// import { formatTimestamp } from '../../utils/dateUtils';

// Import Syncfusion styles
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-buttons/styles/material.css';
import '@syncfusion/ej2-inputs/styles/material.css';
import '@syncfusion/ej2-popups/styles/material.css';
import '@syncfusion/ej2-lists/styles/material.css';
import '@syncfusion/ej2-navigations/styles/material.css';
import '@syncfusion/ej2-dropdowns/styles/material.css';
import '@syncfusion/ej2-react-pdfviewer/styles/material.css';

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
  const [question, setQuestion] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfViewerRef = useRef<PdfViewerComponent>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [userId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`);
  const [pdfId, setPdfId] = useState<string | null>(null);
  const [submittedPdf, setSubmittedPdf] = useState<File | null>(null);
  const [showFileList, setShowFileList] = useState(true);

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

  const generatePdfId = (fileName: string) => {
    return `pdf_${fileName.replace(/\s+/g, '_')}_${Date.now()}`;
  };

  const savePDFLocally = async (file: File) => {
    try {
      // Request permission to access local file system
      const dirHandle = await window.showDirectoryPicker({
        mode: 'readwrite'
      });

      // Create or get the 'uploads' directory
      let uploadsDirHandle;
      try {
        uploadsDirHandle = await dirHandle.getDirectoryHandle('uploads', { create: true });
      } catch (err) {
        console.error('Error creating or accessing uploads directory:', err);
        setError('Failed to access uploads directory: ' + (err as Error).message);
        return;
      }

      // Create a new file in the 'uploads' directory
      const fileHandle = await uploadsDirHandle.getFileHandle(file.name, { create: true });
      
      // Get a writable stream
      const writable = await fileHandle.createWritable();
      
      // Write the file content
      await writable.write(file);
      await writable.close();
      
      // Log the path where the file is saved
      console.log(`PDF "${file.name}" saved locally in the "uploads" directory!`);
      
      // Set success message
      setSuccess(`PDF "${file.name}" saved locally in the "uploads" directory!`);
    } catch (err) {
      console.error('Error saving file locally:', err);
      setError('Failed to save file locally: ' + (err as Error).message);
    }
  };

  const handleFileUpload = (file: File) => {
    setPdfFiles((prevFiles) => [...prevFiles, file]);
    setShowFileList(true); // Show file list when new file is uploaded
  };

  const handleRemoveFile = (fileName: string) => {
    setPdfFiles((prevFiles) => prevFiles.filter(file => file.name !== fileName));
  };

  const handlePdfPreview = () => {
    setShowPdfViewer(true);
  };

  const handleCloseViewer = () => {
    setShowPdfViewer(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    console.log('File dropped');
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleSubmit = (message: string) => {
    // Only submit if both message and PDF are present
    if (message.trim() && pdfFiles.length > 0) {
      const newMessage: Message = {
        text: message,
        isUserMessage: true,
        timestamp: new Date().toLocaleTimeString(),
        button_display: false,
        number_of_buttons: 0,
        button_text: [],
      };

      setMessages(prev => [...prev, newMessage]);
      // Set the submitted PDF to display in preview
      setSubmittedPdf(pdfFiles[0]);
      
      // Create URL for PDF viewer
      const fileUrl = URL.createObjectURL(pdfFiles[0]);
      setPdfUrls([fileUrl]);
      
      // Hide the file list after submission
      setShowFileList(false);
    } else {
      setError('Please provide both a message and a PDF file');
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
      setPdfFiles([]); // Optionally reset the PDF files if needed
      setPdfUrls([]); // Optionally reset the PDF URLs if needed
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  const renderChatContent = () => {
    return (
      <div className="flex h-full gap-4">
        {/* Left Side - PDF Viewer */}
        <div className="w-1/2">
          {showPdfViewer && submittedPdf && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden relative h-full">
              <button 
                onClick={handleCloseViewer}
                className="absolute top-2 right-2 z-10 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <PdfViewerComponent
                ref={pdfViewerRef}
                id="container"
                documentPath={pdfUrls[0]}
                serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/pdfviewer"
                style={{ height: '100%' }}
              >
                <Inject services={[
                  Toolbar, Magnification, Navigation, LinkAnnotation,
                  BookmarkView, ThumbnailView, Print, TextSelection,
                  TextSearch, Annotation, FormFields
                ]} />
              </PdfViewerComponent>
            </div>
          )}
        </div>

        {/* Right Side - Messages and PDF Preview */}
        <div className="w-1/2 flex flex-col">
          {/* PDF Preview Section - Only visible after submission */}
          {submittedPdf && (
            <div className="mb-4 px-4">
              <PdfFileDisplay 
                fileName={submittedPdf.name}
                onClick={handlePdfPreview}
              />
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUserMessage ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isUserMessage && (
                  <img
                    src={ChatLogo}
                    alt="BART Genie"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isUserMessage
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
        </div>
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
              onChatSelect={handleGetChat}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
          </div>

          {/* Main Chat Section */}
          <div className="flex-grow p-4">
            <div style={chatScreenStyle}>
              <div className="flex flex-col h-full">
                {/* Messages Area */}
                <div className="flex-grow overflow-y-auto px-4 py-3">
                  {renderChatContent()}
                </div>

                {/* Bottom Section */}
                <div className="flex-shrink-0 mt-auto">
                  {/* PDF Files List - Only show before submission */}
                  {showFileList && pdfFiles.length > 0 && (
                    <div className="px-4">
                      <PdfFileList 
                        pdfFiles={pdfFiles} 
                        onRemove={handleRemoveFile} 
                      />
                    </div>
                  )}

                  {/* Chat Input */}
                  <div className="px-4 py-3">
                    <NewChatInputBar
                      onSubmit={handleSubmit}
                      onFileUpload={handleFileUpload}
                      loading={loading}
                      hasPdfFile={pdfFiles.length > 0}
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

export default PDFChat;
