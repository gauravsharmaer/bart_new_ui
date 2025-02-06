import React from 'react';
import CloseIcon from '../../assets/ViewPDF.svg';

interface PdfSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
}

const PdfSidebar: React.FC<PdfSidebarProps> = ({ isOpen, onClose, pdfUrl }) => {

  const getViewerUrl = (url: string) => {
    // Use Google Docs viewer for S3 hosted PDFs
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  };

  return (
    <div
    className={`fixed inset-y-0 right-2 transform transition-all duration-300 ease-in-out z-50 
      ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}
    style={{
        backgroundColor: '#f3f5f9',
        height: 'calc(100% - 88px)',
        marginTop: '72px',
        borderRadius: '16px',
        width: '450px',
      }}
    >
      <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden">
        {/* Header with Close Icon */}
        <div className="relative p-2 rounded-t-lg">
          <img
            src={CloseIcon}
            alt="Close"
            className="absolute top-0 left-0 w-8px h-6 cursor-pointer"
            onClick={onClose}
          />
          <div className="ml-8">
            <span className="text-white text-sm block">View PDF</span>
            {/* <span className="text-black text-sm font-medium block ml-[-25px] mt-[8px]">PDF Viewer</span> */}
          </div>
        </div>

        {/* PDF Container */}
        <div className="flex-1 overflow-hidden p-3 mt-[-10px]">
          <div className="bg-white rounded-lg h-full shadow-inner">
            {pdfUrl && (
              <iframe
                src={getViewerUrl(pdfUrl)}
                className="w-full h-full border-0"
                title="PDF Preview"
                style={{
                  backgroundColor: 'white',
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfSidebar;