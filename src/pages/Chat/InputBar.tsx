import React from "react";
import plusIcon from "../../assets/plus.png";
import arrowIcon from "../../assets/arrow-up-right.png";

const InputBar: React.FC = () => {
  const styles = {
    inputBar: {
      display: "flex",
      alignItems: "center",
      padding: "5px 6px",
      backgroundColor: "#f5f5f5",
      borderRadius: "20px",
      margin: "12px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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
        <div style={styles.plusIcon}></div>
      </div>
      <input style={styles.input} type="text" placeholder="Type a message" />
      <div style={styles.iconContainer}>
        <div style={styles.arrowIcon}></div>
      </div>
    </div>
  );
};

export default InputBar;
