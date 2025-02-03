// Table.tsx
import { useState, useEffect } from "react";
import genie from "../../assets/Genie.svg";
import { TicketHistoryData } from "../../Interface/Interface";
import TicketApiService from "./api";
import { Link } from "react-router-dom";

export const Table = () => {
  const [ticketData, setTicketData] = useState<TicketHistoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getTicketHistory = async () => {
      try {
        const data = await TicketApiService.getTicketHistory(
          localStorage.getItem("user_id") || ""
        );
        setTicketData(data.ticketHistory);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    getTicketHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200  border-t-purple-600 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full border border-gray-200 dark:border-[#2c2d32] rounded-lg overflow-hidden">
      <div className="max-h-[500px] overflow-y-auto">
        <table className="min-w-full table-fixed">
          <thead className="sticky top-0 bg-gray-50 dark:bg-[#2c2d32]">
            <tr className="text-sm text-gray-600 dark:text-gray-400">
              <th className="whitespace-nowrap px-6 py-3 text-left font-medium w-[20%]">Name</th>
              <th className="whitespace-nowrap px-6 py-3 text-left font-medium w-[15%]">Ticket no</th>
              <th className="whitespace-nowrap px-6 py-3 text-left font-medium w-[20%]">Date and time</th>
              <th className="whitespace-nowrap px-6 py-3 text-left font-medium w-[20%]">Assigned to</th>
              <th className="whitespace-nowrap px-6 py-3 text-left font-medium w-[12.5%]">Status</th>
              <th className="whitespace-nowrap px-6 py-3 text-left font-medium w-[12.5%]">Updates</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-[#2c2d32] bg-white dark:bg-[#1a1b1e]">
            {ticketData.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-[#2c2d32] cursor-pointer transition-colors duration-200">
                <td className="px-6 py-4 w-[15%]">
                  <Link to={item.link} target="_blank" className="block w-full">
                    <span className="text-sm dark:text-gray-200 truncate block w-[100px]">{item.name}</span>
                  </Link>
                </td>
                <td className="px-6 py-4 w-[15%]">
                  <Link to={item.link} target="_blank" className="block w-full">
                    <span className="text-purple-600 dark:text-purple-400 text-sm truncate block">
                      {item.ticket_id}
                    </span>
                  </Link>
                </td>
                <td className="px-6 py-4 w-[20%]">
                  <Link to={item.link} target="_blank" className="block w-full">
                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate block">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </Link>
                </td>
                <td className="px-6 py-4 w-[20%]">
                  <Link to={item.link} target="_blank" className="block w-full">
                    <div className="flex items-center gap-2">
                      <img
                        src={genie}
                        alt="Genie logo"
                        className="h-6 w-6 rounded-full dark:opacity-90 flex-shrink-0"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate">No one</span>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 w-[12.5%]">
                  <Link to={item.link} target="_blank" className="block w-full">
                    <span
                      className={`text-sm font-medium truncate block ${
                        item.status?.toLowerCase() === "resolved"
                          ? "text-green-500 dark:text-green-400"
                          : "text-red-500 dark:text-red-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </Link>
                </td>
                <td className="px-6 py-4 w-[12.5%]">
                  <Link to={item.link} target="_blank" className="block w-full">
                    {idx % 2 === 0 ? (
                      <span className="text-orange-500 dark:text-[#ff8851] text-sm hover:text-orange-600 dark:hover:text-[#ff7a3d] transition-colors duration-200 truncate block">
                        See update
                      </span>
                    ) : (
                      <span className="text-green-600 dark:text-green-400 text-sm hover:text-green-700 dark:hover:text-green-300 transition-colors duration-200 truncate block">
                        Resolved
                      </span>
                    )}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
