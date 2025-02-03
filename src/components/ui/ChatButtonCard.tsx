// interface ChatButtonCardProps {
//   buttons: string[];
//   onButtonClick: (button: string) => void;
//   clickedButton: string | null;
// }

import { ChatButtonCardProps } from "../../props/Props";

const ChatButtonCard: React.FC<ChatButtonCardProps> = ({
  buttons,
  onButtonClick,
  clickedButton,
}) => {
  return (
    <div className="flex gap-2.5">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={() => onButtonClick(button)}
          className={`
            px-5 py-2.5 
            border border-gray-200 dark:border-[#2c2d32]
            rounded-lg
            text-sm font-medium
            transition-all duration-200
            hover:bg-gray-50 dark:hover:bg-[#3a3b40]
            ${
              clickedButton === button
                ? "bg-orange-500 dark:bg-[#ff8851] text-white dark:text-gray-100 border-transparent"
                : "bg-white dark:bg-[#2c2d32] text-gray-700 dark:text-gray-200"
            }
          `}
        >
          {button}
        </button>
      ))}
    </div>
  );
};

export default ChatButtonCard;
