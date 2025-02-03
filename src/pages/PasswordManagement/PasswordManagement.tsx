import { useState } from "react";
import { SiteHeader } from "../../components/Navbar";
import Sidebar from "./Sidebar";
import PasswordPage from "./PasswordPage";
import EquipmentPage from "./EquipmentRequests";
import SoftwarePage from "./SoftwareSupport";

const PasswordManagement = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    "Password Management"
  );

  const renderPage = () => {
    console.log("Selected Template:", selectedTemplate);
    switch (selectedTemplate) {
      case "Password Management":
        return <PasswordPage />; // Background applied within PasswordPage
      case "Equipment Requests":
        return <EquipmentPage />;
      case "Software & Application Support":
        return <SoftwarePage />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-[#1a1b1e] transition-colors duration-200">
      {/* Header Section */}
      <SiteHeader />

      {/* Main Layout with Sidebar and Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[280px] h-full bg-white dark:bg-[#2c2d32] border-r border-[#ddd] dark:border-[#3a3b40] flex-shrink-0 transition-colors duration-200">
          <Sidebar
            selectedTemplate={selectedTemplate}
            onTemplateSelect={setSelectedTemplate}
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col p-4">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default PasswordManagement;