// Table.tsx
import { useState, useEffect } from "react";
import genie from "../../assets/Genie.svg";
import { TicketHistoryData } from "./Interface/Interface";
import TicketApiService from "./api";

export const Table = () => {
  const [ticketData, setTicketData] = useState<TicketHistoryData[]>([]);

  useEffect(() => {
    const getTicketHistory = async () => {
      try {
        const data = await TicketApiService.getTicketHistory(
          localStorage.getItem("user_id") || ""
        );
        setTicketData(data.ticketHistory);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getTicketHistory();
  }, []);

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 text-sm text-gray-600">
            <th className="px-6 py-3 text-left font-medium">Name</th>
            <th className="px-6 py-3 text-left font-medium">Ticket no</th>
            <th className="px-6 py-3 text-left font-medium">Date and time</th>
            <th className="px-6 py-3 text-left font-medium">Assigned to</th>
            <th className="px-6 py-3 text-left font-medium">Status</th>
            <th className="px-6 py-3 text-left font-medium">Updates</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {ticketData.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm">{item.name}</td>
              <td className="px-6 py-4">
                <span className="text-purple-600 text-sm">
                  {item.ticket_id}
                </span>
              </td>

              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(item.created_at).toLocaleString()}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <img
                    src={genie}
                    alt="Genie logo"
                    className="h-6 w-6 rounded-full"
                  />
                  <span className="text-sm text-gray-600">No one</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-red-500 font-medium">
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4">
                {idx % 2 === 0 ? (
                  <span className="text-orange-500 text-sm cursor-pointer">
                    See update
                  </span>
                ) : (
                  <span className="text-green-600 text-sm">Resolved</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
