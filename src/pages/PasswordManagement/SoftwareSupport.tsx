import React from "react";
import Card from "./Card";

const SoftwareSupport: React.FC = () => {
  const containerStyle: React.CSSProperties = {
    width: "976px",
    height: "642px",
    top: "85px",
    left: "288px",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    padding: "50px",
  };

  const headingStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: 600,
    color: "#262626",
    marginBottom: "8px",
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#6c6f76",
    marginBottom: "24px",
  };

  const cardsContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "25px", // Increased the gap between the cards
    padding: "0",
  };

  const cardsData = [
    {
      title: "Install/Uninstall Software",
      description: "Seamlessly install or remove software applications as needed.",
    },
    {
      title: "Software Updates",
      description: "Keep your software up-to-date with automatic update requests.",
    },
    {
      title: "License Management",
      description: "Manage and track software licenses for all your tools.",
    },
    {
      title: "Access Rights and Permission",
      description: "Adjust user access and permissions with ease for secure operations.",
    },
  ];

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>SOFTWARE AND APPLICATION SUPPORT</h2>
      <p style={subtitleStyle}>
      Install, update, or troubleshoot software with ease.
      </p>
      <div style={cardsContainerStyle}>
        {cardsData.map((card, index) => (
          <Card key={index} title={card.title} description={card.description} />
        ))}
      </div>
    </div>
  );
};
export default SoftwareSupport;
