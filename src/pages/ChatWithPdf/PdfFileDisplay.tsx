// import React from "react";
// import pdfIcon from "../assets/Pdf.svg"; // Make sure you have this icon

// interface PdfFileDisplayProps {
//   fileName: string;
//   timestamp?: string;
//   onClick?: () => void;
// }

// const PdfFileDisplay: React.FC<PdfFileDisplayProps> = ({
//   fileName,
//   timestamp,
//   onClick,
// }) => {
//   return (
//     <div className="flex items-start gap-2 mb-2">
//       <div 
//         className="flex items-center gap-2 bg-white rounded-lg p-2 cursor-pointer hover:bg-gray-50"
//         onClick={onClick}
//       >
//         <div className="flex-shrink-0">
//           <img src={pdfIcon} alt="PDF" className="w-6 h-6" />
//         </div>
//         <div className="flex flex-col">
//           <p className="text-sm text-gray-900 font-medium">{fileName}</p>
//           <p className="text-xs text-gray-500">Click to open file</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PdfFileDisplay;













import React from "react";
import pdfIcon from "../../assets/pdf_icon.svg"; // Ensure this is the correct path to your PDF icon

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
    <div className="inline-flex items-center gap-2 bg-[#f8f8f8] rounded-[14px] px-1 py-3 cursor-pointer hover:bg-gray-50 border border-dotted border-[#d1cfc5] shadow-sm"
      style={{ marginRight: '32px' }}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0">
          <img src={pdfIcon} alt="PDF" className="w-12 h-12" />
        </div>
        <div className="flex flex-col">
          <p className="text-sm text-gray-900 font-medium">{fileName}</p>
          <p className="text-xs text-[#000000] opacity-60">Click to open file</p>
        </div>
      </div>
    </div>
  );
};

export default PdfFileDisplay; 