import { Message, ChatHistory } from "../Interface/Interface";
export interface TimelineProps {
  isOpen: boolean;
  onClose: () => void; // Callback to handle closing
}
export interface VerifyAuthProps {
  onVerificationComplete?: () => void;
  onBackClick?: () => void;
}

export interface AuthVideoCardProps {
  onVerificationComplete?: () => void;
  mode: "capture" | "verify";
}

export type FacialConfirmationPopupProps = {
  showConfirmationPopup: boolean;
  setShowConfirmationPopup: (value: boolean) => void;
  setShowPopup: (value: boolean) => void;
};

export interface NotificationProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ChatButtonCardProps {
  buttons: string[];
  onButtonClick: (button: string) => void;
  clickedButton: string | null;
}

export interface FaceVerificationProps {
  progress?: number;
  instruction?: string | JSX.Element;
  error?: string;
  webcamComponent?: React.ReactNode;
  onBackClick?: () => void;
  showCamera?: boolean;
  isModelLoaded?: boolean;
  isWebcamReady?: boolean;
  isAnalyzing?: boolean;
  showGif?: boolean;
  hasFaceDescriptors?: boolean;
}

export type ImageUploadPopupProps = {
  setShowImageUploadPopup: (value: boolean) => void;
};
export interface OtpInputCardProps {
  onSubmitOTP: (otp: string) => void;
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface CardProps {
  name: string | undefined;
  description: string | undefined;
  ticket_id: string | undefined;
  assignee_name: string | undefined;
  ticket_link: string | undefined;
}
export interface UserCardProps {
  name: string;
  text: string;
}
export interface CardBackgroundProps {
  children?: React.ReactNode;
}

export interface ChatInputBarProps {
  onSubmit: (message: string) => void;
  loading?: boolean;
  onPdfUpload?: (file: File) => Promise<void>;
}
export interface ChatMessageProps {
  message: Message;
  chatId: string;
  onNewMessage: (message: Message) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onLike: (history_id: string) => Promise<void>;
  onDislike: (history_id: string) => Promise<void>;
}
export interface PasswordResetUiProps {
  initialMessage: string;
}
export interface DeleteAllChatsModalProps {
  onCancel: () => void;
  onDelete: () => void;
}

export interface DeleteChatModalProps {
  chatName: string;
  chatId: string;
  onCancel: () => void;
  onDelete: (chatId: string) => void;
}

export interface GradientBackgroundProps {
  children?: React.ReactNode;
}

export interface HistorySideBarProps {
  onChatSelect: (chatId: string) => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  chatHistory: (ChatHistory & { status?: string; timestamp?: string })[];
  isLoading: boolean;
  setChatHistory: React.Dispatch<
    React.SetStateAction<
      (ChatHistory & { status?: string; timestamp?: string })[]
    >
  >;
}

export interface ImageUploadProps {
  onUploadSuccess?: (imageId: string) => void;
}

export interface ChatUiProps {
  initialMessage?: string;
}
