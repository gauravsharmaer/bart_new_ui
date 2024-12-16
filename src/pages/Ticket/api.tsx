import { TicketHistory } from "./Interface/Interface";

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
};

export default TicketApiService;
