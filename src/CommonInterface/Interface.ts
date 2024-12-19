export interface ApiError {
  message: string;
}
export type Instructions = {
  right: string;
  left: string;
  blink: JSX.Element;
};

export interface VerifyAuthProps {
  onVerificationComplete?: () => void;
  onBackClick?: () => void;
}

export interface AuthVideoCardProps {
  onVerificationComplete?: () => void;
  mode: "capture" | "verify";
}
