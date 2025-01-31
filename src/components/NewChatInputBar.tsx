import React, { useState, useRef } from "react";
import arrowIcon from "../assets/arrow-up-right.png";
import plusIcon from "../assets/Plus.svg";
import pdfIcon from "../assets/Pdf.svg";

interface NewChatInputBarProps {
  onSubmit: (message: string) => void;
  onFileUpload: (file: File) => void;
  loading?: boolean;
  hasPdfFile?: boolean;
}

const NewChatInputBar: React.FC<NewChatInputBarProps> = ({
  onSubmit,
  onFileUpload,
  loading = false,
  hasPdfFile = false,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSubmit(inputMessage);
      setInputMessage("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isAdditional: boolean) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      onFileUpload(file);
      e.target.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200">
        <div className="flex gap-2">
          <button
            type="button"
            className={`w-14 h-10 flex items-center justify-center ${!hasPdfFile ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => hasPdfFile && additionalFileInputRef.current?.click()}
            disabled={!hasPdfFile}
            title={!hasPdfFile ? "Upload first PDF using the PDF button" : "Add additional PDF"}
          >
            <img src={plusIcon} alt="Add" className="w-full h-full object-contain" />
          </button>
          <button
            type="button"
            className={`w-14 h-10 flex items-center justify-center bg-[#f9f9f9] shadow-[inset_0_0_1px_rgba(128,128,128,0.5)] rounded-[10px] 
              ${hasPdfFile ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            onClick={() => !hasPdfFile && fileInputRef.current?.click()}
            disabled={hasPdfFile}
            title={hasPdfFile ? "First PDF already uploaded" : "Upload first PDF"}
          >
            <img src={pdfIcon} alt="PDF" className="w-full h-full object-contain" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf"
            onChange={(e) => handleFileUpload(e, false)}
          />
          <input
            type="file"
            ref={additionalFileInputRef}
            className="hidden"
            accept=".pdf"
            onChange={(e) => handleFileUpload(e, true)}
          />
        </div>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 min-h-[40px] px-4 text-base border-none bg-transparent outline-none resize-none py-2 overflow-y-auto
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ lineHeight: "1.5" }}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-12 h-10 flex items-center justify-center bg-[#f9f9f9] shadow-[inset_0_0_1px_rgba(128,128,128,0.5)] rounded-[10px] hover:bg-gray-100"
        >
          <img src={arrowIcon} alt="Send" className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
};

export default NewChatInputBar;