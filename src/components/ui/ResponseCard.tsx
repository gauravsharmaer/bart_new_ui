import React from "react";
import genie from "../../assets/genie.svg";

interface ResponseCardProps {
  botName: string;
  content: string;
}

const ResponseCard: React.FC<ResponseCardProps> = ({ botName, content }) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={styles.card}>
      <img src={genie} alt={`${botName}'s logo`} style={styles.logo} />
      <div style={styles.content}>
        <div style={styles.header}>
          <span style={styles.botName}>{botName}</span>
          <span style={styles.time}>{currentTime}</span>
        </div>
        <div style={styles.text}>{content}</div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: "flex",
    alignItems: "flex-start",
    margin: "8px 0",
  },
  logo: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginRight: "12px",
  },
  content: {
    
    padding: "12px",
    maxWidth: "70%",
  },
  header: {
    display: "flex",
    alignItems: "center", // Ensures the name and time are aligned
    fontSize: "14px",
    marginBottom: "8px",
  },
  botName: {
    fontWeight: "bold",
    color: "#007bff",
    marginRight: "8px", // Adds a small space between the bot name and time
  },
  time: {
    color: "#888",
    fontSize: "12px",
  },
  text: {
    fontSize: "14px",
    color: "#555",
  },
};

export default ResponseCard;
