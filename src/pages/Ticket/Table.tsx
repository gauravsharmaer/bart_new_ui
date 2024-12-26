// Table.tsx
import { useState, useEffect } from "react";
import genie from "../../assets/Genie.svg";
import { TicketHistoryData } from "./Interface/Interface";
import TicketApiService from "./api";

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
    </div>
  );
};
