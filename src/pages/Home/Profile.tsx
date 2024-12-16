import React from "react";
import { useNavigate } from "react-router-dom";

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const styles = {
    overlay: {
      display: isOpen ? "block" : "none",
      position: "fixed" as const,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 999,
    },
    container: {
      display: isOpen ? "block" : "none",
      width: "280px",
      height: "734px",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
      zIndex: 1000,
      borderRadius: "8px",
      overflow: "hidden",
      position: "absolute" as const,
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
    toggleSection: {
      display: "flex",
      justifyContent: "space-around",
      padding: "6px 10px",
      borderBottom: "1px solid #f1f1f1",
    },
    toggleButton: {
      padding: "5px",
      borderRadius: "5%",
      cursor: "pointer",
      backgroundColor: "#f9f9f9",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    menu: {
      listStyleType: "none" as const,
      padding: 0,
      margin: "16px 0",
    },
    menuItem: {
      padding: "12px 16px",
      cursor: "pointer",
      color: "#333",
      fontSize: "14px",
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
    },
    menuItemIcon: {
      marginRight: "8px",
    },
    logOut: {
      position: "absolute" as const,
      bottom: "16px",
      left: "16px",
      padding: "12px 16px",
      color: "#FF6F61",
      cursor: "pointer",
      textAlign: "center" as const,
      width: "calc(100% - 32px)",
    },
  };

  return (
    <>
      <div style={styles.overlay} onClick={onClose}></div>
      <div style={styles.container}>
        <div style={styles.profileHeader}>
          <div style={styles.avatar}>JD</div>
          <div style={styles.userInfo}>
            <strong>John Doe</strong>
            <span style={styles.email}>john.doe@brightcone.com</span>
          </div>
        </div>

        {/* Toggle Section */}
        <div style={styles.toggleSection}>
          <div style={styles.toggleButton}>🖥</div>
          <div style={styles.toggleButton}>🌞</div>
          <div style={styles.toggleButton}>🌙</div>
        </div>

        {/* Menu Items */}
        <ul style={styles.menu}>
          <li style={styles.menuItem}>
            <span style={styles.menuItemIcon}>🖥</span> New chat
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
            <span style={styles.menuItemIcon}>⚙</span> Setting
          </li>
        </ul>

        {/* Log Out Section */}
        <div style={styles.logOut} onClick={handleLogout}>
          <span>🔓 Log out</span>
        </div>
      </div>
    </>
  );
};

export default Profile;