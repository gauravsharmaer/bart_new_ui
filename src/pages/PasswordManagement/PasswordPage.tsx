import React from "react";
import Card from "./Card";

const PasswordPage: React.FC = () => {
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
      title: "Password Reset",
      description: "Keep your software up-to-date with automatic update requests.",
    },
    {
      title: "Unlock Account",
      description: "Regain access to locked accounts quickly with automated unlocks.",
    },
    {
      title: "Multi-Factor Authentication",
      description:
        "Easily set up, modify, or troubleshoot multi-factor authentication.",
    },
  ];

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>PASSWORD MANAGEMENT </h2>
      <p style={subtitleStyle}>
        Start with our most-used templates for work and life.
      </p>
      <div style={cardsContainerStyle}>
        {cardsData.map((card, index) => (
          <Card key={index} title={card.title} description={card.description} />
        ))}
      </div>
    </div>
  );
};

export default PasswordPage;
