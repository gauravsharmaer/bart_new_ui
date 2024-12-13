import React, { useState } from "react";
import { SiteHeader } from "../Home/Navbar";
import Sidebar from "./Sidebar";
import PasswordPage from "./PasswordPage"; 
import EquipmentPage from "./EquipmentRequests"; 
import SoftwarePage from "./SoftwareSupport";

const PasswordManagement: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("Password Management");

  const containerStyle: React.CSSProperties = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  };

  const layoutStyle: React.CSSProperties = {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  };

  const sidebarStyle: React.CSSProperties = {
    background: "#ffffff",
    borderRight: "1px solid #ddd",
    flexShrink: 0,
    width: "280px",
    height: "100%",
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "20px",
  };

  const renderPage = () => {
    console.log("Selected Template:", selectedTemplate);
    switch (selectedTemplate) {
      case "Password Management":
        return <PasswordPage />;
      case "Equipment Requests":
        return <EquipmentPage />;
      case "Software Support":
        return <SoftwarePage />;
      default:
        return null;
    }
  };
  
  return (
    <div style={containerStyle}>
      {/* Header Section */}
      <SiteHeader />

      {/* Main Layout with Sidebar and Content */}
      <div style={layoutStyle}>
        {/* Sidebar */}
        <div style={sidebarStyle}>
          <Sidebar
            selectedTemplate={selectedTemplate}
            onTemplateSelect={setSelectedTemplate}
          />
        </div>
        {/* Content Section */}
        <div style={contentStyle}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default PasswordManagement;
