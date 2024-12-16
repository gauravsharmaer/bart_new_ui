import React, { useState, KeyboardEvent } from "react";
import plusIcon from "../../assets/plus.png";
import arrowIcon from "../../assets/arrow-up-right.png";

interface InputBarProps {
  onSendMessage: (message: string) => void;
}

const InputBar: React.FC<InputBarProps> = ({ onSendMessage }) => {
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputText.trim()) {
      handleSend();
    }
  };

  const styles = {
    inputBar: {
      display: "flex",
      alignItems: "center",
      padding: "5px 6px",
      backgroundColor: "#f5f5f5",
      borderRadius: "20px",
      margin: "12px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      '@media (max-width: 576px)': {
        margin: '8px',
        padding: '4px 5px',
      }
    },
    input: {
      flex: 1,
      height: "40px",
      padding: "0 8px",
      fontSize: "16px",
      border: "none",
      borderRadius: "20px",
      backgroundColor: "#f5f5f5",
      outline: "none",
      '@media (max-width: 576px)': {
        height: '36px',
        fontSize: '14px',
        padding: '0 6px',
      }
    },
    iconContainer: {
      width: "36px",
      height: "36px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "50%",
      cursor: "pointer",
      margin: "0 0",
      '@media (max-width: 576px)': {
        width: '32px',
        height: '32px',
      }
    },
  
    plusIcon: {
      width: "18px",
      height: "18px",
      backgroundImage: `url(${plusIcon})`,
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    },
    arrowIcon: {
      width: "18px",
      height: "18px",
      backgroundImage: `url(${arrowIcon})`,
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    },
  };

  return (
    <div style={styles.inputBar}>
      <div style={styles.iconContainer}>
        <div style={styles.plusIcon} />
      </div>
      <input
        type="text"
        placeholder="Type your message..."
        style={styles.input}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <div 
        style={styles.iconContainer} 
        onClick={handleSend}
      >
        <div style={styles.arrowIcon} />
      </div>
    </div>
  );
};

export default InputBar;