import React from "react";

const VerifyMailCard: React.FC = () => {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
        borderRadius: "16px",
        padding: "20px",
        width: "100%",  // Ensure it takes up 100% of the available width
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>
        Verify your mail for security
      </h3>
      <p style={{ marginTop: "10px", fontSize: "14px", lineHeight: "1.5" }}>
        This ensures our platform can authenticate your identity and keep your
        account safe.
      </p>
      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          background: "#fff",
          color: "#6a11cb",
          fontSize: "14px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
      >
        Verify now
      </button>
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          opacity: 0.5,
          width: "100px",
          height: "100px",
          background: "radial-gradient(circle, rgba(255,255,255,0.3), rgba(255,255,255,0))",
        }}
      />
    </div>
  );
};

export default VerifyMailCard;
