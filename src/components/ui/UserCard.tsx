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
      <div style={styles.content}>
        <img src={genie} alt={`${name}'s logo`} style={styles.logo} />
        <div style={styles.textContainer}>
          <div style={styles.header}>
            <span style={styles.name}>{name}</span>
            <span style={styles.time}>{currentTime}</span>
          </div>
          <div style={styles.text}>{text}</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: "flex",
    alignItems: "flex-start",
    margin: "0px 15px",
  },
  content: {
    display: "flex",
    alignItems: "flex-start",
    background: "#f5f5f5",
    borderRadius: "12px",
    padding: "7px",
    maxWidth: "100%",
    flexDirection: "row", // Aligns logo and text side by side
  },
  logo: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginRight: "10px", // Space between logo and content
  },
  textContainer: {
    display: "flex",
    flexDirection: "column", // Ensures the name, time, and text are stacked vertically
    maxWidth: "100%",
  },
  header: {
    display: "flex",
    alignItems: "center", // Ensures name and time are aligned
    fontSize: "16px",
    marginBottom: "2px",
  },
  name: {
    fontWeight: "bold",
    color: "black",
    marginRight: "5px", // Adds space between name and time
  },
  time: {
    color: "#888",
    fontSize: "12px",
  },
  text: {
    fontSize: "16px",
    color: "black",
  },
};

export default UserCard;
