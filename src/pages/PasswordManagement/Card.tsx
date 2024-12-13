import React from "react";
import genie from "../../assets/genie.svg";

interface CardProps {
  title: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ title, description }) => {
  const cardStyle: React.CSSProperties = {
    flex: "1 1 0", // Allows cards to grow but not shrink
    minWidth: "288px", // Ensures each card has a minimum width
    height: "176px",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    textAlign: "left",
    borderTop: "9px solid #7b5cff",
    position: "relative",
    marginBottom: "16px", // Spacing between cards
  };

  const genieStyle: React.CSSProperties = {
    position: "absolute",
    top: "12px",
    left: "12px",
    width: "29px",
    height: "29px",
  };

  const titleStyle: React.CSSProperties = {
    margin: "30px 0 8px",
    fontSize: "15px",
    fontWeight: 600,
    color: "#262626",
  };

  const descriptionStyle: React.CSSProperties = {
    margin: "0",
    fontSize: "15px",
    color: "#6c6f76",
    lineHeight: "20px",
  };

  const arrowContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-start", // Aligns the arrow to the left
    alignItems: "center",
    marginTop: "auto", // Pushes the arrow to the bottom
  };

  const arrowStyle: React.CSSProperties = {
    color: "#7b5cff",
    fontSize: "25px",
    cursor: "pointer",
  };

  return (
    <div style={cardStyle}>
      <img src={genie} alt="Genie Icon" style={genieStyle} />
      <div>
        <h3 style={titleStyle}>{title}</h3>
        <p style={descriptionStyle}>{description}</p>
      </div>
      <div style={arrowContainerStyle}>
        <span style={arrowStyle}>&rarr;</span>
      </div>
    </div>
  );
};

export default Card;
