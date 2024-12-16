import React from "react";

interface TimelineProps {
  isOpen: boolean;
  onClose: () => void; // Callback to handle closing
}

const Timeline: React.FC<TimelineProps> = ({ isOpen, onClose }) => {
  const styles = {
    container: {
      flex: 0.25, // Adjust the width to be part of the chat layout
      display: isOpen ? "flex" : "none", // Show/Hide based on isOpen
      flexDirection: "column" as const,
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
      zIndex: 1000,
      transition: "flex 0.3s ease",
      borderRadius: "8px",
      overflow: "hidden",
    },
    // header: {
    //   padding: "16px",
    //   // backgroundColor: "#ff7043",
    //   color: "#ffffff",
    //   fontWeight: "600",
    //   display: "flex",
    //   justifyContent: "space-between",
    //   alignItems: "center",
    // },

    header: {

    },
    
    closeButton: {
      background: "none",
      border: "none",
      color: "#ffffff",
      fontSize: "18px",
      cursor: "pointer",
    },
    title: {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "4px",
    },
    subtitle: {
      color: "#6c757d",
      fontSize: "14px",
      marginBottom: "16px",
    },
    content: {
      padding: "16px",
      overflowY: "auto" as const,
      flex: 1,
    },
    update: {
      display: "flex",
      flexDirection: "column" as const,
      borderLeft: "2px solid #ff7043",
      paddingLeft: "16px",
      marginBottom: "16px",
      position: "relative" as const,
    },
    dot: {
      width: "10px",
      height: "10px",
      backgroundColor: "#ff7043",
      borderRadius: "50%",
      position: "absolute" as const,
      left: "-6px",
      top: "4px",
    },
    updateTitle: {
      fontWeight: "bold",
      marginBottom: "4px",
    },
    updateText: {
      color: "#495057",
      fontSize: "14px",
      marginBottom: "4px",
    },
    timestamp: {
      color: "#6c757d",
      fontSize: "12px",
    },
    seeAllButton: {
      marginTop: "16px",
      padding: "8px 16px",
      backgroundColor: "#ff7043",
      color: "#ffffff",
      border: "none",
      borderRadius: "20px",
      fontWeight: "bold",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        {/* <span>Timeline</span> */}
        <button style={styles.closeButton} onClick={onClose}>
          ✕
        </button>
      </div>

      {/* Timeline Content */}
      <div style={styles.content}>
        <div style={styles.title}>Timeline and Updates</div>
        <div style={styles.subtitle}>
          Check your chat history and stay updated on your ticket progress!
        </div>

        {/* Updates */}
        <div style={styles.update}>
          <div style={styles.dot}></div>
          <div style={styles.updateTitle}>Task "Password Reset" Created</div>
          <div style={styles.timestamp}>Nov 7, 2024 at 09:35 AM</div>
        </div>

        <div style={styles.update}>
          <div style={styles.dot}></div>
          <div style={styles.updateTitle}>See all updates</div>
          <div style={styles.timestamp}>20 updates</div>
        </div>

        <div style={styles.update}>
          <div style={styles.dot}></div>
          <div style={styles.updateText}>
            <strong>Darlene Robertson</strong> started working on your ticket.
          </div>
          <div style={styles.timestamp}>Nov 8, 2024 at 08:39 AM</div>
        </div>

        <div style={styles.update}>
          <div style={styles.dot}></div>
          <div style={styles.updateText}>
            <strong>Darlene</strong> has updated your password. Please check
            your email and reset your password for security reasons.
          </div>
          <div style={styles.timestamp}>Nov 8, 2024 at 11:39 AM</div>
        </div>

        <div style={styles.update}>
          <div style={styles.dot}></div>
          <div style={styles.updateText}>
            The issue has been resolved, and the chat is now closed.
          </div>
          <div style={styles.timestamp}>Nov 7, 2024 at 12:00 PM</div>
        </div>

        <button style={styles.seeAllButton}>See all updates</button>
      </div>
    </div>
  );
};

export default Timeline;
