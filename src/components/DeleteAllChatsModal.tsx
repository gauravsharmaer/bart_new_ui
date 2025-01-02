import React from "react";
import DeleteIcon from "../assets/Delete.gif";
import { DeleteAllChatsModalProps } from "../props/Props";
// interface DeleteAllChatsModalProps {
//   onCancel: () => void;
//   onDelete: () => void;
// }

const DeleteAllChatsModal: React.FC<DeleteAllChatsModalProps> = ({
  onCancel,
  onDelete,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
      <div className="bg-white rounded-2xl w-[390px] h-[226px] p-6 shadow-lg">
        <div className="flex flex-col items-center mt-2">
          {/* Delete Icon */}
          <div className="mb-1">
            <img
              src={DeleteIcon}
              alt="Delete Icon"
              className="w-8 h-8 text-[#FF5600]"
            />
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold text-[#202B3B] mb-2">
            Delete All Chats?
          </h2>

          {/* Message */}
          <p className="text-lg text-[#808080] text-center mb-6">
            Are you sure you want to delete all chats?
            <br />
          </p>

          {/* Buttons Container */}
          <div className="flex w-[calc(100%+3rem)] -mx-6 border-t border-[#D7D7D7]">
            <button
              onClick={onCancel}
              className="w-full py-5 text-[#808080] text-lg font-regular hover:bg-gray-50 border-r border-[#D7D7D7]"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="w-full py-5 text-[#ED2B31] text-lg font-regular hover:bg-gray-50"
            >
              Delete All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAllChatsModal;
