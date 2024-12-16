interface TicketData {
  subject: string;
  ticketNo: string;
  dateTime: string;
  priority: string;
  assignee: string;
  status: string;
}
interface TicketHistoryData {
  id: string;
  name: string;
  description: string;
  ticket_id: string;
  user_id: string;
  status: string | null;
  priority: string;
  created_at: string;
  link: string;
}

interface TicketHistory {
  ticketHistory: TicketHistoryData[];
}
export type { TicketData, TicketHistoryData, TicketHistory };
