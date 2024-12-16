import React from "react";

const SidebarItem: React.FC<{
  title: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ title, isSelected, onClick }) => {
  return (
    <li
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        width: "100%",
        padding: "6px 5px", // Consistent padding for alignment
        fontWeight: isSelected ? "bold" : "normal",
        color: isSelected ? "#000000" : "#6b6b6b",
        borderLeft: isSelected ? "3px solid #ff6a00" : "3px solid transparent",
        backgroundColor: isSelected ? "#f9f9f9" : "transparent",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {title}
    </li>
  );
};

const Sidebar: React.FC<{
  selectedTemplate: string;
  onTemplateSelect: (template: string) => void;
}> = ({ selectedTemplate, onTemplateSelect }) => {
  const templates = [
    "Password Management",
    "Equipment Requests",
    "Software & Application Support",
    "Network & Connectivity",
    "Printer & Peripheral Setup",
    "System & Device Troubleshooting",
    "Help Desk & Ticketing",
    "Account & Access Management",
    "IT Security",
    "Mobile Device Management",
    "Maintenance & Updates",
    "IT Policy & Guidelines",
  ];

  return (
    <div
      style={{
        width: "300px",
        maxWidth: "100%", // Ensures responsiveness
        height: "100%",
        backgroundColor: "#ffffff",
        padding: "20px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Back Button */}
      <div
  style={{
    display: "flex",
    alignItems: "center", // Vertically center the content
    marginBottom: "16px", // Add spacing below the header
  }}
>
  <button
    onClick={() => console.log("Back button clicked")}
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "30px", // Larger arrow size
      marginRight: "1px", // Spacing between arrow and "Categories"
      color: "#000000",
      padding: "0px", // Optional for better click area
    }}
  >
    ←
  </button>

        <h2
          style={{
            fontFamily: "Graphik, sans-serif",
            fontWeight: 500,
            fontSize: "25px",
            lineHeight: "28px",
            margin: 0,
            color: "#000000",
          }}
        >
          Categories
        </h2>
      </div>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {templates.map((template) => (
          <SidebarItem
            key={template}
            title={template}
            isSelected={template === selectedTemplate}
            onClick={() => onTemplateSelect(template)}
          />
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
