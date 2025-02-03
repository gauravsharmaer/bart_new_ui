import { askBart, getHistory, likeChat, unlikeChat, getUserChats, deleteChat, renameChat } from "../Api/CommonApi";

export interface CallbackInterface {
  _id: string;
  one_login_id: string;
  email: string;
  name: string;
  faceDescriptor: [];
  is_facial_verified: boolean;
  imagePath: string;
}

export interface ApiError {
  message: string;
}
export type Instructions = {
  right: string;
  left: string;
  blink: JSX.Element;
};
export interface LoginInterface {
  message: string;
  email: string;
  user_id: string;
  name: string;
  isFaceVerified: boolean;
  imagePath: string;
}

export interface TicketData {
  subject: string;
  ticketNo: string;
  dateTime: string;
  priority: string;
  assignee: string;
  status: string;
}
export interface TicketHistoryData {
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

export interface TicketHistory {
  ticketHistory: TicketHistoryData[];
}
export interface ChatHistory {
  id: string;
  name: string;
  isActive?: boolean;
  status?: string;
  timestamp?: string;
}
export interface Message {
  text: string;
  isUserMessage: boolean;
  button_display: boolean;
  number_of_buttons: number;
  button_text: string[];
  id?: string;
  vertical_bar?: boolean;
  timestamp: string;
  like?: boolean;
  un_like?: boolean;
  history_id?: string;
  ticket?: boolean;
  ticket_options?: {
    name?: string;
    description?: string;
    ticket_id?: string;
    assignee_name?: string;
    link?: string;
  };
  isFromHistory?: boolean;
}

export interface AskRequest {
  question: string;
  user_id: string;
  chat_id?: string;
}

export interface APIError {
  message: string;
  status?: number;
}

export interface AskResponse {
  question: string;
  answer: string;
  chat_id: string;
  display_settings: {
    vertical_bar: boolean;
    button_display: boolean;
    ticket: boolean;
    options: {
      buttons: string[];
      ticket_options: {
        name: string | undefined;
        description: string | undefined;
        ticket_id: string | undefined;
        assignee_name: string | undefined;
        link: string | undefined;
      };
    };
    message_history: {
      question: string;
      answer: string;
      history_id: string;
      like: boolean;
      un_like: boolean;
    }[];
  };
}

export interface VerifyOTPRequest {
  otp: number;
  email: string;
  chat_id: string;
}

export interface VerifyOTPResponse {
  question: string;
  answer: string;
  chat_id: string;
  display_settings: {
    vertical_bar: boolean;
    button_display: boolean;
    ticket: boolean;
    options: {
      buttons: string[];
      ticket_options: {
        name: string | undefined;
        description: string | undefined;
        ticket_id: string | undefined;
        assignee_name: string | undefined;
        link: string | undefined;
      };
    };
    message_history: {
      question: string;
      answer: string;
      history_id: string;
      like: boolean;
      un_like: boolean;
    }[];
  };
}

export interface chatHistory {
  id: string;
  name: string;
  user_id: string;
}

export interface docChatHistory {
  id: string;
  name: string;
  user_id: string;
  file_path: string;

}

export interface ImageUploadResponse {
  message: string;
  userId: string;
  imagePath: string;
}


export interface ChatWithDocsResponse {
  status: string;
  message: string;
  file_path: string;
  file_name: string;
  chat_id: string;
  question: string;
  answer: string;
  display_settings: {
    vertical_bar: boolean;
    button_display: boolean;
    ticket: boolean;
    options: {
      ticket_options: {
        name: string | undefined;
        description: string | undefined;
        ticket_id: string | undefined;
        assignee_name: string | undefined;
        link: string | undefined;
      };
    };
    message_history: {
      question: string;
      answer: string;
      sources: string[];
      history_id: string;
      like: boolean;
      un_like: boolean;
      file_name: string;
      file_path: string;
    }[];
  };
}


export interface GeneralChatRequest {
  question: string;
  question_type: string;
  user_id: string;
  chat_id?: string;
}


export interface ApiHandlers {
  askBart: typeof askBart;
  getHistory: typeof getHistory;
  likeChat: typeof likeChat;
  unlikeChat: typeof unlikeChat;
  getUserChats: typeof getUserChats;
  deleteChat: typeof deleteChat;
  renameChat: typeof renameChat;

}