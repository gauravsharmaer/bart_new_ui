import React from "react";
import { CardProps } from "../../props/Props";
import { Link } from "react-router-dom";

const TicketCard: React.FC<CardProps> = ({
  name,
  description,
  ticket_id,
  assignee_name,
  ticket_link,
}) => {
  console.log("TicketCard props:", {
    name,
    description,
    ticket_id,
    assignee_name,
    ticket_link,
  });

  return (
    <div className="bg-white dark:bg-[#2c2d32] shadow-md dark:shadow-[#1a1b1e] rounded-lg p-4 mt-4 
    border border-gray-200 dark:border-[#3a3b40] max-w-sm transition-all duration-200 
    hover:shadow-lg dark:hover:shadow-[#1a1b1e]/50">
      <Link to={ticket_link || "#"} target="_blank" className="block">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Ticket Status:{" "}
          <span className="text-red-500 dark:text-red-400 font-semibold">
            Open
          </span>
        </div>
        <div className="font-semibold text-gray-800 dark:text-gray-200 text-lg mb-2 transition-colors duration-200">
          {name || "Untitled Ticket"}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors duration-200">
          {description || "No description provided"}
        </div>
        <div className="bg-gray-100 dark:bg-[#1a1b1e] rounded-lg p-3 transition-colors duration-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Ticket No</span>
            <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">
              {ticket_id || "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Assigned to</span>
            <span className="text-sm text-gray-800 dark:text-gray-200">
              {assignee_name || "Unassigned"}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TicketCard;
