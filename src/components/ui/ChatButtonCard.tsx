interface ChatButtonCardProps {
  buttons: string[];
  onButtonClick: (button: string) => void;
  clickedButton: string | null;
}

const ChatButtonCard: React.FC<ChatButtonCardProps> = ({
  buttons,
  onButtonClick,
  clickedButton,
}) => {
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={() => onButtonClick(button)}
          style={{
            padding: "10px 20px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: clickedButton === button ? "orange" : "white",
            cursor: "pointer",
          }}
        >
          {button}
        </button>
      ))}
    </div>
  );
};

export default ChatButtonCard;
