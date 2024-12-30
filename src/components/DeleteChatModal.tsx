import React from "react";
import DeleteIcon from "../assets/Delete.gif";

interface DeleteChatModalProps {
  chatName: string;
  chatId: string;
  onCancel: () => void;
  onDelete: (chatId: string) => void;
}

const DeleteChatModal: React.FC<DeleteChatModalProps> = ({
  chatName,
  chatId,
  onCancel,
  onDelete,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
      <div className="bg-white rounded-2xl w-[380px] h-[280px]p-6 shadow-lg">
        <div className="flex flex-col items-center mt-6">
          {/* Delete Icon */}
          <div className="mb-4">
            <img
              src={DeleteIcon}
              alt="Delete Icon"
              className="w-8 h-8 text-[#FF5600]"
            />
          </div>
          
          {/* Title */}
          <h2 className="text-lg font-semibold text-[#202B3B] mb-2">
            Delete Chat?
          </h2>
          
          {/* Message */}
          <p className="text-lg text-[#808080] text-center mb-6">
            Are you sure you want to delete the chat<br />
            <span className="text-[#808080]">"{chatName}"</span>?
          </p>
          
          {/* Buttons Container */}
          <div className="flex w-full border-t border-[#D7D7D7]">
            <button
              onClick={onCancel}
              className="w-full py-5 text-[#808080] text-lg font-regular hover:bg-gray-50 border-r border-[#D7D7D7]"
              >
              Cancel
            </button>
            <button
              onClick={() => onDelete(chatId)}
            className="w-full py-5 text-[#ED2B31] text-lg font-regular hover:bg-gray-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteChatModal;