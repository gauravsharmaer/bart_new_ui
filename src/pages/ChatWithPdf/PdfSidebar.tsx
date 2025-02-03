import React from 'react';
import { X } from 'lucide-react';

interface PdfSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
}

const PdfSidebar: React.FC<PdfSidebarProps> = ({ isOpen, onClose, pdfUrl }) => {
  return (
    <div
      className={`fixed inset-y-0 right-0 top-[56px] bottom-[-12px] w-[570px] bg-transparent transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col p-4">
        {/* PDF Viewer with circular container */}
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute top-4 right-6 z-10">
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 bg-white rounded-full transition-colors shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="h-full flex flex-col items-center">
            <div className="bg-white shadow-lg rounded-[30px] w-[98%] h-[98%] overflow-hidden">
              {pdfUrl && (
                <iframe
                  src={pdfUrl}
                  className="w-full h-full border-0"
                  title="PDF Preview"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfSidebar; 