import icon from "../../assets/Genie.svg";
import { History } from "lucide-react";
import { useState, useEffect } from "react";
import TicketApiService from "./api";
import { TicketHistoryData } from "../../Interface/Interface";
import { Link } from "react-router-dom";

const SupportTicket = () => {
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
    <div className="flex flex-wrap justify-around gap-3 h-[500px] overflow-y-auto">
      {ticketData.map((ticket) => (
        <Link
          to={ticket.link}
          target="_blank"
          key={ticket.id}
          className="w-full max-w-md transition-transform hover:scale-[1.02] hover:shadow-lg"
        >
          <div className="bg-white rounded-3xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-sm text-gray-600">
                Jul 19, 06:30PM
                <span className="mx-0.5 text-gray-400">•</span>
                <span className="text-red-500 font-medium">
                  {ticket.priority}
                </span>
              </div>
              <div className="w-8 h-8 bg-green-400 rounded-lg flex items-center justify-center">
                <History className="w-5 h-5 text-white" />
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-6">
              Floyd Miles | {ticket.name}
            </h2>

            <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ticket No</span>
                <span className="text-sm font-medium">{ticket.ticket_id}</span>
              </div>

              <div className="h-px bg-gray-100 -mx-4"></div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Assigned to</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <img
                      src={icon}
                      alt="Avatar"
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium">Darlene Robertson</span>
                </div>
              </div>

              <div className="h-px bg-gray-100 -mx-4"></div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Est. Solution Time
                </span>
                <span className="text-sm font-medium">{"< 3Days"}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SupportTicket;
