import { useState, useEffect } from "react";
import genie from "../../assets/genie.svg";
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
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <table className="w-full text-sm text-left text-gray-600">
        {/* Table Head */}
        <thead>
          <tr className="bg-gray-100 font-medium">
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Ticket no</th>
            <th className="px-6 py-3">Date and time</th>
            <th className="px-6 py-3">Assigned to</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Updates</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {ticketData.map((item, idx) => (
            <tr
              key={idx}
              className="border-b hover:bg-gray-50 transition-all"
            >
              <td className="px-6 py-4 font-medium text-gray-900">
                Password Recovery
              </td>
              <td className="px-6 py-4">
              <a
                href="#"
                className="text-sm text-purple-600 hover:underline"
              >
                #{Math.floor(100000 + Math.random() * 900000)} {/* Generates random 6-digit number */}
              </a>
            </td>
              <td className="px-6 py-4 text-gray-600">
              {new Date(item.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}{" "}
                |{" "}
                {new Date(item.created_at).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </td>
              <td className="px-6 py-4 flex items-center">
                <img
                  src={genie}
                  alt="Agent Avatar"
                  className="h-6 w-6 rounded-full mr-2"
                />
                <span className="text-sm font-medium text-gray-600">
                  {item.assigned_to || "Darlene Robertson"}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-gray-500 font-medium">Urgent</span>
              </td>
              <td className="px-6 py-4">
                {idx % 2 === 0 ? (
                  <a
                    href="#"
                    className="text-orange-500 text-sm font-medium hover:underline"
                  >
                    See update
                  </a>
                ) : (
                  <span className="text-green-500 font-medium">Resolved</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
