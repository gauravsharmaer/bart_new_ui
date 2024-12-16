import React from "react";
import genie from "../../assets/genie.svg";

interface UserCardProps {
  logo: string;
  name: string;
  time: string;
  text: string;
}

const UserCard: React.FC<UserCardProps> = ({ logo, name, time, text }) => {
  return (
    <div style={styles.card}>
      <div style={styles.content}>
        <img 
          src={genie} 
          alt="User logo" 
          style={styles.logo} 
        />
        <div style={styles.textContainer}>
          <div style={styles.header}>
            <span style={styles.name}>{name}</span>
            <span style={styles.time}>{time}</span>
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
    '@media (max-width: 576px)': {
      margin: '0px 8px',
    }
  },
  content: {
    display: "flex",
    alignItems: "flex-start",
    background: "#f5f5f5",
    borderRadius: "12px",
    padding: "7px",
    maxWidth: "100%",
    flexDirection: "row",
    '@media (max-width: 576px)': {
      padding: '5px',
      borderRadius: '10px',
    }
  },
  logo: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginRight: "10px",
    '@media (max-width: 576px)': {
      width: '32px',
      height: '32px',
      marginRight: '8px',
    }
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "100%",
  },
  header: {
    display: "flex",
    alignItems: "center",
    fontSize: "16px",
    marginBottom: "2px",
    '@media (max-width: 576px)': {
      fontSize: '14px',
      marginBottom: '1px',
    }
  },
  name: {
    fontWeight: "bold",
    color: "black",
    marginRight: "5px",
  },
  time: {
    color: "#888",
    fontSize: "12px",
    '@media (max-width: 576px)': {
      fontSize: '10px',
    }
  },
  text: {
    fontSize: "16px",
    color: "black",
    '@media (max-width: 576px)': {
      fontSize: '14px',
    }
  },
};

export default UserCard;