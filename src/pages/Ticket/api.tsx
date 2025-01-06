import { TicketHistory } from "../../Interface/Interface";

const TicketApiService = {
  getTicketHistory: async (userId: string): Promise<TicketHistory> => {
    try {
      const response = await fetch(
        `https://bart-api-bd05237bdea5.herokuapp.com/tickets/${userId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch chat history");
      }

      const data = await response.json();
      return {
        ticketHistory: data,
      };
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("An unexpected error occurred while fetching chat history");
    }
  },

  getResolvedTickets: async (userId: string): Promise<TicketHistory> => {
    try {
      const response = await fetch(
        `https://bart-api-bd05237bdea5.herokuapp.com/resolved_tickets/${userId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch resolved tickets");
      }

      const data = await response.json();
      return {
        ticketHistory: data,
      };
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error(
            "An unexpected error occurred while fetching resolved tickets"
          );
    }
  },

  getUnResolvedTickets: async (userId: string): Promise<TicketHistory> => {
    try {
      const response = await fetch(
        `https://bart-api-bd05237bdea5.herokuapp.com/not_resolved_tickets/${userId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch unresolved tickets");
      }

      const data = await response.json();
      return {
        ticketHistory: data,
      };
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error(
            "An unexpected error occurred while fetching unresolved tickets"
          );
    }
  },
};

export default TicketApiService;
