import React from "react";
import genie from "../../assets/genie.svg";

interface UserCardProps {
  name: string;
  text: string;
}

const UserCard: React.FC<UserCardProps> = ({ name, text }) => {

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


  return (
    <div style={styles.card}>
      <img src={genie} alt={`${name}'s logo`} style={styles.logo} />
      <div style={styles.content}>
        <div style={styles.header}>
          <span style={styles.name}>{name}</span>
          <span style={styles.time}>{currentTime}</span>
        </div>
        <div style={styles.text}>{text}</div>
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
    background: "#f5f5f5",
    borderRadius: "12px",
    padding: "12px",
    maxWidth: "70%",
  },
  header: {
    display: "flex",
    alignItems: "center", // Ensures the name and time are aligned
    fontSize: "14px",
    marginBottom: "8px",
  },
  name: {
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

export default UserCard;
