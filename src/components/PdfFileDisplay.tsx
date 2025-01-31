import React from "react";
import pdfIcon from "../assets/pdf_icon.svg"; // Ensure this is the correct path to your PDF icon

interface PdfFileDisplayProps {
  fileName: string;
  timestamp?: string;
  onClick?: () => void;
}

const PdfFileDisplay: React.FC<PdfFileDisplayProps> = ({
  fileName,
  timestamp,
  onClick,
}) => {
  return (
    <div 
      className="inline-flex items-center gap-2 bg-white rounded-[14px] px-4 py-2 cursor-pointer hover:bg-gray-50 border border-gray-100 shadow-sm"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <img src={pdfIcon} alt="PDF" className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <p className="text-sm text-gray-900 font-medium">{fileName}</p>
          <p className="text-xs text-gray-500">Click to open file</p>
        </div>
      </div>
    </div>
  );
};

export default PdfFileDisplay; 