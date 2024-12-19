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
