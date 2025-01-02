import React from "react";
import { CardProps } from "../../props/Props";

const TicketCard: React.FC<CardProps> = ({
  name,
  description,
  ticket_id,
  assignee_name,
}) => {
  console.log("TicketCard props:", {
    name,
    description,
    ticket_id,
    assignee_name,
  });

  return (
    <div className="bg-white shadow-md rounded-md p-4 mt-4 border border-gray-200 max-w-sm">
      <div className="text-sm text-gray-500 mb-2">
        Ticket Status: <span className="text-red-500 font-semibold">Open</span>
      </div>
      <div className="font-semibold text-gray-800 text-lg mb-2">
        {name || "Untitled Ticket"}
      </div>
      <div className="text-sm text-gray-600 mb-3">
        {description || "No description provided"}
      </div>
      <div className="bg-gray-100 rounded-md p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Ticket No</span>
          <span className="text-sm text-gray-800 font-medium">
            {ticket_id || "N/A"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Assigned to</span>
          <span className="text-sm text-gray-800">
            {assignee_name || "Unassigned"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
