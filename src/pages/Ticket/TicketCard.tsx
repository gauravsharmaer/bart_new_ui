import icon from "../../assets/Genie.svg";
import { History } from "lucide-react";
import { useState, useEffect } from "react";
import TicketApiService from "./api";
import { TicketHistoryData } from "../../Interface/Interface";
import { Link } from "react-router-dom";
import { TicketProps } from "../../props/Props";


const TicketCard = ({ type }: TicketProps) => {
  const [ticketData, setTicketData] = useState<TicketHistoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    const fetchTickets = async () => {
      try {
        const userId = localStorage.getItem("user_id") || "";
        let data;
        
        switch (type) {
          case 'resolved':
            data = await TicketApiService.getResolvedTickets(userId);
            break;
          case 'unresolved':
            data = await TicketApiService.getUnResolvedTickets(userId);
            break;
          default:
            data = await TicketApiService.getTicketHistory(userId);
        }
        
        setTicketData(data.ticketHistory);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [type]);

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
          className="w-full max-w-md transition-transform hover:scale-[1.02] dark:bg-[#1a1b1e] dark:rounded-xl hover:shadow-lg dark:hover:shadow-[#1a1b1e]"
        >
          <div className="bg-white dark:bg-[#1a1b1e] rounded-3xl border border-gray-200 dark:border-[#2c2d32] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                Jul 19, 06:30PM
                <span className="mx-0.5 text-gray-400 dark:text-gray-500">•</span>
                <span className="text-red-500 dark:text-red-400 font-medium">
                  {ticket.priority}
                </span>
              </div>
              <div className="w-8 h-8 bg-green-400 dark:bg-green-500 rounded-lg flex items-center justify-center transition-colors duration-200">
                <History className="w-5 h-5 text-white" />
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-200">
              Floyd Miles | {ticket.name}
            </h2>

            <div className="bg-gray-50 dark:bg-[#2c2d32] rounded-2xl p-4 space-y-4 transition-colors duration-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Ticket No</span>
                <span className="text-sm font-medium dark:text-gray-200">{ticket.ticket_id}</span>
              </div>

              <div className="h-px bg-gray-100 dark:bg-[#3a3b40] -mx-4"></div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Assigned to</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <img
                      src={icon}
                      alt="Avatar"
                      width={24}
                      height={24}
                      className="w-full h-full object-cover dark:opacity-90"
                    />
                  </div>
                  <span className="text-sm font-medium dark:text-gray-200">Darlene Robertson</span>
                </div>
              </div>

              <div className="h-px bg-gray-100 dark:bg-[#3a3b40] -mx-4"></div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Est. Solution Time
                </span>
                <span className="text-sm font-medium dark:text-gray-200">{"< 3Days"}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
  // ... rest of the card JSX remains the same as in your SupportTicket component ...
};

export default TicketCard;
