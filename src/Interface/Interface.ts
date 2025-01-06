export interface CallbackInterface {
  _id: string;
  one_login_id: string;
  email: string;
  name: string;
  faceDescriptor: [];
  is_facial_verified: boolean;
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
  timestamp: string; // Make this optional
  ticket?: boolean;
  like?: boolean;
  history_id?: string;
  un_like?: boolean;
  ticket_options?: {
    name: string | undefined;
    description: string | undefined;
    ticket_id: string | undefined;
    assignee_name: string | undefined;
    link: string | undefined;
  };
}
