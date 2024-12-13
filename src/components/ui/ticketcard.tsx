import React from "react";

interface CardProps {
  dateTime: string;
  urgency: string;
  title: string;
  ticketNo: string;
  assigneeName: string;
  assigneeImage: string;
}

const ticketcard: React.FC<CardProps> = ({
  dateTime,
  urgency,
  title,
  ticketNo,
  assigneeName,
  assigneeImage,
}) => {
  return (
    <div className="bg-white shadow-md rounded-md p-4 mb-4 border border-gray-200 max-w-sm">
      <div className="text-sm text-gray-500 mb-2">
        {dateTime} <span className="text-red-500 font-semibold">{urgency}</span>
      </div>
      <div className="font-semibold text-gray-800 text-lg mb-2">{title}</div>
      <div className="bg-gray-100 rounded-md p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Ticket No</span>
          <span className="text-sm text-gray-800 font-medium">{ticketNo}</span>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-600">Assigned to</span>
          <div className="flex items-center ml-2">
            <img
              src={assigneeImage}
              alt={assigneeName}
              className="w-6 h-6 rounded-full mr-2"
            />
            <span className="text-sm text-gray-800">{assigneeName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ticketcard;
