import { NODE_API_URL } from "../../config";
import { realTimeMessage } from "../../Interface/Interface";

// interface realTimeMessage {
//   sender: string;
//   content: string;
//   timestamp: Date;
//   read: boolean;
// }

interface Chat {
  _id: string;
  participants: string[];
  messages: realTimeMessage[];
  lastMessage: realTimeMessage;
}

interface ChatResponse {
  status: string;
  data: Chat;
}

interface MessageResponse {
  status: string;
  data: realTimeMessage;
}

export const saveMessage = async (
  senderId: string,
  receiverId: string,
  content: string
): Promise<MessageResponse> => {
  try {
    const response = await fetch(`${NODE_API_URL}/save-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        senderId,
        receiverId,
        content,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save message");
    }

    return await response.json();
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while saving message");
  }
};

export const getChatHistory = async (
  userId1: string,
  userId2: string
): Promise<ChatResponse> => {
  try {
    const response = await fetch(
      `${NODE_API_URL}/get-chat-history/${userId1}/${userId2}`,
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

    return await response.json();
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while fetching chat history");
  }
};

export const markMessagesAsRead = async (
  chatId: string,
  userId: string
): Promise<void> => {
  try {
    const response = await fetch(`${NODE_API_URL}/chat/mark-read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        chatId,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to mark messages as read");
    }
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while marking messages as read");
  }
};

export const getRecentChats = async (userId: string): Promise<Chat[]> => {
  try {
    const response = await fetch(`${NODE_API_URL}/get-recent-chats/${userId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recent chats");
    }

    return await response.json();
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while fetching recent chats");
  }
};

export const deleteChat = async (
  userId1: string,
  userId2: string
): Promise<{ status: string; message: string }> => {
  try {
    const response = await fetch(
      `${NODE_API_URL}/delete-chat/${userId1}/${userId2}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete chat");
    }

    return await response.json();
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while deleting chat");
  }
};

export const deleteMessage = async (
  chatId: string,
  messageId: string
): Promise<{ status: string; message: string }> => {
  try {
    const response = await fetch(
      `${NODE_API_URL}/delete-message/${chatId}/${messageId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete message");
    }

    return await response.json();
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while deleting message");
  }
};

export const editMessage = async (
  chatId: string,
  messageId: string,
  content: string
): Promise<{ status: string; data: realTimeMessage; message: string }> => {
  try {
    const response = await fetch(
      `${NODE_API_URL}/edit-message/${chatId}/${messageId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ content }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to edit message");
    }

    return await response.json();
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while editing message");
  }
};
