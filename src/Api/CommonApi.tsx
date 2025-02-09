import {
  Message,
  AskRequest,
  AskResponse,
  APIError,
  VerifyOTPRequest,
  VerifyOTPResponse,
  chatHistory,
  ImageUploadResponse,
} from "../Interface/Interface";

import { NODE_API_URL } from "../config";
type HistoryInterface = Message[][];

export const askBart = async (data: AskRequest): Promise<AskResponse> => {
  try {
    const requestBody = {
      question: data.question,
      user_id: data.user_id,
      ...(data.chat_id && { chat_id: data.chat_id }),
    };

    const response = await fetch(
      `https://bart-api-bd05237bdea5.herokuapp.com/ask`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw {
        message: responseData.message || "Ask request failed",
        status: response.status,
      } as APIError;
    }

    return responseData as AskResponse;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Invalid response format from server");
    }

    if ((error as APIError).status) {
      const apiError = error as APIError;
      throw new Error(
        `Ask request failed (${apiError.status}): ${apiError.message}`
      );
    }

    throw new Error(
      "An unexpected error occurred while processing your question"
    );
  }
};

export const verifyOTP = async (
  data: VerifyOTPRequest
): Promise<AskResponse> => {
  try {
    const response = await fetch(
      `https://bart-api-bd05237bdea5.herokuapp.com/verification/verify_otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw {
        message: responseData.message || "Verification failed",
        status: response.status,
      } as APIError;
    }

    return responseData as VerifyOTPResponse;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Invalid response format from server");
    }

    if ((error as APIError).status) {
      const apiError = error as APIError;
      throw new Error(
        `OTP verification failed (${apiError.status}): ${apiError.message}`
      );
    }

    throw new Error("An unexpected error occurred during OTP verification");
  }
};

export const getHistory = async (chatId: string): Promise<HistoryInterface> => {
  try {
    const response = await fetch(
      `https://bart-api-bd05237bdea5.herokuapp.com/chat_histories/${chatId}`,
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
    return data as HistoryInterface;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while fetching chat history");
  }
};

export const getUserChats = async (): Promise<chatHistory[]> => {
  try {
    const response = await fetch(
      `https://bart-api-bd05237bdea5.herokuapp.com/chats/${localStorage.getItem(
        "user_id"
      )}`,
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
    return data;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred during signup");
  }
};
export const logout = async () => {
  try {
    const response = await fetch(`${NODE_API_URL}/logout`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to logout");
    }
    return response.json();
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred during logout");
  }
};

export const uploadImage = async (
  userId: string | null,
  file: File
): Promise<ImageUploadResponse> => {
  try {
    // Validate userId
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append("image", file);

    // Make API Request
    const response = await fetch(
      `${NODE_API_URL}/upload-user-image?userId=${encodeURIComponent(userId)}`,
      {
        method: "POST",
        body: formData,
      }
    );

    // Check for HTTP errors and parse JSON
    if (!response.ok) {
      const errorBody = await response.text(); // Handle non-JSON errors
      throw new Error(
        errorBody || `Image upload failed with status ${response.status}`
      );
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    // Handle Specific Errors
    if (error instanceof SyntaxError) {
      throw new Error("Invalid JSON response format");
    } else if (error instanceof TypeError) {
      throw new Error("Network error or server is unreachable");
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Unexpected error during image upload");
    }
  }
};

export const deleteChat = async (chatId: string): Promise<chatHistory[]> => {
  try {
    const response = await fetch(
      `https://bart-api-bd05237bdea5.herokuapp.com/delete_chat/${localStorage.getItem(
        "user_id"
      )}/${chatId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete chat history");
    }

    return await response.json();
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while deleting chat history");
  }
};

export const renameChat = async (
  chatId: string,
  newName: string
): Promise<chatHistory[]> => {
  try {
    const response = await fetch(
      `https://bart-api-bd05237bdea5.herokuapp.com/rename_chat/${chatId}/${newName}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to rename chat");
    }

    return await response.json();
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while renaming chat");
  }
};

export const likeChat = async (chatId: string): Promise<HistoryInterface> => {
  try {
    const response = await fetch(
      `https://bart-api-bd05237bdea5.herokuapp.com/like_chat/${chatId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to like chat");
    }

    return await response.json();
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while liking chat");
  }
};

export const unlikeChat = async (chatId: string): Promise<HistoryInterface> => {
  try {
    const response = await fetch(
      `https://bart-api-bd05237bdea5.herokuapp.com/un_like_chat/${chatId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to unlike chat");
    }

    return await response.json();
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while unliking chat");
  }
};

export const searchChatHistory = async (
  userId: string,
  name?: string
): Promise<chatHistory[]> => {
  try {
    const url = new URL(
      `https://bart-api-bd05237bdea5.herokuapp.com/chat_search/${userId}`
    );
    if (name) {
      url.searchParams.append("name", name);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to search chat history");
    }

    return await response.json();
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while searching chat history");
  }
};
