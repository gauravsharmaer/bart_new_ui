// import React from "react";
// import pdfDisplayIcon from "../assets/document.svg";
// import CrossIcon from "../assets/Genie.svg";

// interface PdfFileListProps {
//   pdfFiles: File[];
//   onRemove: (fileName: string) => void;
// }

// const PdfFileList: React.FC<PdfFileListProps> = ({ pdfFiles, onRemove }) => {
//   return (
//     <div className="flex flex-wrap gap-3 p-5 bg-[#F7F5E8] rounded-lg ml-4 mr-3 mb-[-17px] border border-dotted border-gray-400">
//       {pdfFiles.map((file, index) => (
//         <div key={index} className="relative flex flex-col items-center">
//           <button 
//             onClick={() => onRemove(file.name)} 
//             className="absolute -top-2 -left-2 w-5 h-5 flex items-center justify-center"
//           >
//             <img src={CrossIcon} alt="Remove" className="w-4 h-4" />
//           </button>
//           <img src={pdfDisplayIcon} alt="PDF" className="w-24 h-24 mb-1" />
//           <span className="text-xs text-gray-700 text-center max-w-[96px] truncate">
//             {file.name}
//           </span>
//           <span className="text-xs text-blue-600">PDF</span>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default PdfFileList;





import React from "react";
import pdfDisplayIcon from "../../assets/PdfDisplay.svg";
import CrossIcon from "../../assets/Cross.svg";

interface PdfFileListProps {
  pdfFiles: File[];
  onRemove: (fileName: string) => void;
}

const PdfFileList: React.FC<PdfFileListProps> = ({ pdfFiles, onRemove }) => {
  return (
    <div className="flex flex-wrap gap-3 p-3 bg-[#F7F5E8] rounded-lg ml-4 mr-3 mb-[-17px] border border-dotted border-gray-400">
      {pdfFiles.map((file, index) => (
        <div key={index} className="relative flex flex-col items-center">
          <button 
            onClick={() => onRemove(file.name)} 
            className="absolute -top-2 -left-2 w-5 h-5 flex items-center justify-center"
          >
            <img src={CrossIcon} alt="Remove" className="w-5 h-5 mr-[-62px] mt-[18px]" />
          </button>
          <img src={pdfDisplayIcon} alt="PDF" className="w-24 h-24 mb-1" />
          <div className="text-center" style={{ width: '160px' }}>
            <span className="text-xs font-semibold text-gray-700 truncate">
              {file.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PdfFileList;