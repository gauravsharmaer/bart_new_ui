import { API_URL } from "../../config";
import { toast } from "react-toastify";
import { CallbackInterface } from "./Interface/Interface";
export const CallbackApiService = {
  postCallback: async (code: string): Promise<CallbackInterface> => {
    try {
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          code,
        }),
      });

      const jsonResponse = await response.json();

      if (!response.ok) {
        toast.error(jsonResponse.message || "Callback failed");
        throw new Error(jsonResponse.message || "Callback failed");
      }

      return jsonResponse;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("An unexpected error occurred during callback");
    }
  },
};
