import React from "react";

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ isOpen, onClose }) => {
  const styles = {
    container: {
      display: isOpen ? "block" : "none",
      width: "280px",
      height: "734px",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
      zIndex: 1000,
      borderRadius: "8px",
      overflow: "hidden",
      position: "absolute",
      top: "16px",
      left: "16px",
    },
    profileHeader: {
      display: "flex",
      alignItems: "center",
      padding: "16px",
      borderBottom: "1px solid #f1f1f1",
    },
    avatar: {
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      backgroundColor: "#FF6F61",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "20px",
      color: "#fff",
      marginRight: "12px",
    },
    userInfo: {
      display: "flex",
      flexDirection: "column" as const,
    },
    email: {
      fontSize: "14px",
      color: "#888",
    },
    menu: {
      listStyleType: "none" as const,
      padding: "15px 16px 0px 0px",        },
    menuItem: {
      padding: "12px 16px",
      cursor: "pointer",
      color: "#333",
      fontSize: "14px",
      textDecoration: "none",
    },
    logOut: {
      marginTop: "270px",
      padding: "0px 160px 15px 0px",
      color: "#FF6F61",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    toggleSection: {
      display: "flex",
      justifyContent: "space-around",
      padding: "12px 0",
      borderTop: "1px solid #f1f1f1",
    },
    toggleButton: {
      padding: "15px",
      borderRadius: "50%",
      cursor: "pointer",
      backgroundColor: "#f9f9f9",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    menuItemIcon: {
      marginRight: "8px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.profileHeader}>
        <div style={styles.avatar}>JD</div>
        <div style={styles.userInfo}>
          <strong>John Doe</strong>
          <span style={styles.email}>john.doe@brightcone.com</span>
        </div>
      </div>

      <div style={styles.toggleSection}>
      <div style={styles.toggleButton}>🖥️</div>
        <div style={styles.toggleButton}>🌞</div>
        <div style={styles.toggleButton}>🌙</div>
      </div>
      <ul style={styles.menu}>
        <li style={styles.menuItem}>
          <span style={styles.menuItemIcon}>🖥️</span> New chat
        </li>
        <li style={styles.menuItem}>
          <span style={styles.menuItemIcon}>📋</span> Templates
        </li>
        <li style={styles.menuItem}>
          <span style={styles.menuItemIcon}>⏳</span> History
        </li>
        <li style={styles.menuItem}>
          <span style={styles.menuItemIcon}>🎫</span> Tickets
        </li>
        <li style={styles.menuItem}>
          <span style={styles.menuItemIcon}>⚙️</span> Setting
        </li>
      </ul>
      
      <div style={styles.logOut} onClick={onClose}>
        <span>🔓 Log out</span>
      </div>
    </div>
  );
};

export default Profile;
