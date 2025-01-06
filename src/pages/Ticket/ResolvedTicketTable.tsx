// Table.tsx
import { useState, useEffect } from "react";
import genie from "../../assets/Genie.svg";
import { TicketHistoryData } from "../../Interface/Interface";
import TicketApiService from "./api";
import { Link } from "react-router-dom";

export const ResolvedTicketTable = () => {
  const [ticketData, setTicketData] = useState<TicketHistoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getResolvedTickets = async () => {
      try {
        const data = await TicketApiService.getResolvedTickets(
          localStorage.getItem("user_id") || ""
        );
        setTicketData(data.ticketHistory);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    getResolvedTickets();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-purple-600 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <div className="max-h-[500px] overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-50">
            <tr className="text-sm text-gray-600">
              <th className="px-6 py-3 text-left font-medium">Name</th>
              <th className="px-6 py-3 text-left font-medium">Ticket no</th>
              <th className="px-6 py-3 text-left font-medium">Date and time</th>
              <th className="px-6 py-3 text-left font-medium">Assigned to</th>
              <th className="px-6 py-3 text-left font-medium">Status</th>
              <th className="px-6 py-3 text-left font-medium">Updates</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {ticketData.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4">
                  <Link to={item.link} target="_blank" className="block w-full">
                    <span className="text-sm">{item.name}</span>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <Link to={item.link} target="_blank" className="block w-full">
                    <span className="text-purple-600 text-sm">
                      {item.ticket_id}
                    </span>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <Link to={item.link} target="_blank" className="block w-full">
                    <span className="text-sm text-gray-600">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <Link to={item.link} target="_blank" className="block w-full">
                    <div className="flex items-center gap-2">
                      <img
                        src={genie}
                        alt="Genie logo"
                        className="h-6 w-6 rounded-full"
                      />
                      <span className="text-sm text-gray-600">No one</span>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <Link to={item.link} target="_blank" className="block w-full">
                    <span
                      className={`text-sm font-medium ${
                        item.status?.toLowerCase() === "resolved"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <Link to={item.link} target="_blank" className="block w-full">
                    {idx % 2 === 0 ? (
                      <span className="text-orange-500 text-sm">
                        See update
                      </span>
                    ) : (
                      <span className="text-green-600 text-sm">Resolved</span>
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
