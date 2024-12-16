import React from "react";
import genie from "../../assets/genie.svg";

interface ResponseCardProps {
  logo: string;
  botName: string;
  time: string;
  content: string;
  children?: React.ReactNode;
}

const ResponseCard: React.FC<ResponseCardProps> = ({
  logo,
  botName,
  time,
  content,
  children,
}) => {
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column" as const,
      width: "100%",
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "8px",
    },
    logo: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      flexShrink: 0,
    },
    botName: {
      fontSize: "16px",
      fontWeight: "600",
      color: "black",
    },
    time: {
      fontSize: "12px",
      color: "#6c757d",
    },
    mainContent: {
      display: "flex",
      gap: "12px",
      flex: 1,
      paddingLeft: "52px", // Width of logo (40px) + gap (12px)
    },
    purpleBar: {
      width: "4px",
      backgroundColor: "#8A2BE2",
      borderRadius: "2px",
      display: children ? "block" : "none",
      marginRight: "12px",
    },
    contentSection: {
      flex: 1,
      display: "flex",
      flexDirection: "column" as const,
    },
    message: {
      fontSize: "16px",
      color: "black",
      padding: "0px",
    },
    childrenWrapper: {
      marginTop: "8px",
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img src={genie} alt={botName} style={styles.logo} />
        <span style={styles.botName}>{botName}</span>
        <span style={styles.time}>{time}</span>
      </div>
      <div style={styles.mainContent}>
        <div style={styles.purpleBar} />
        <div style={styles.contentSection}>
          <div style={styles.message}>{content}</div>
          {children && <div style={styles.childrenWrapper}>{children}</div>}
        </div>
      </div>
    </div>
  );
};

export default ResponseCard;