
import React from "react";
import pdfDisplayIcon from "../../assets/PdfDisplay.svg";
import CrossIcon from "../../assets/Cross.svg";
import { PdfFileListProps } from "../../props/Props"


const PdfFileList: React.FC<PdfFileListProps> = ({ pdfFiles, onRemove }) => {
  return (
    <div className="flex flex-wrap gap-3 p-3 bg-[#F7F5E] dark:bg-[#313131] rounded-2xl ml-4 mr-3 mb-[-17px] border border-dotted border-gray-400 dark:border-[#5d5d5d]">
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
            <span className="text-xs font-semibold text-gray-700 truncate dark:text-[#ffffff]">
              {file.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PdfFileList;