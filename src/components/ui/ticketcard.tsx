import React from "react";
import genie from "../../assets/genie.svg";

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
<div className="bg-white shadow-md rounded-xl p-4 mb-4 border border-gray-200" style={{ width: '450px' }}>
<div className="text-base text-gray-500 mb-2">
    {dateTime}. <span className="text-red-500 font-bold">{urgency}</span>
  </div>
  <div className="font-bold text-gray-800 text-xl mb-2">{title}</div>
  <div className="bg-gray-100 rounded-xl p-3 w-full">
    <div className="grid grid-cols-2 gap-y-2">
      {/* First Row: Ticket Number */}
      <div className="flex justify-start items-center">
        <span className="text-base text-gray-600">Ticket No</span>
      </div>
      <div className="flex justify-end items-center">
        <span className="text-base text-black font-semibold">{ticketNo}</span>
      </div>

      {/* Divider */}
      <div className="col-span-2">
        <hr className="my-2 border-gray-300" />
      </div>

      {/* Second Row: Assigned To */}
      <div className="flex justify-start items-center">
        <span className="text-base text-gray-600">Assigned to</span>
      </div>
      <div className="flex justify-end items-center">
        <img
          src={genie}
          alt={assigneeName}
          className="w-6 h-6 rounded-full mr-2"
        />
        <span className="text-lg">{assigneeName}</span>
      </div>
    </div>
  </div>
</div>

  );
};

export default ticketcard;
