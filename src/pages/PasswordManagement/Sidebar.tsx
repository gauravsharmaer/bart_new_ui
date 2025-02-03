import React from "react";
import Arrow from "../../assets/ArrowLeft.svg"

const SidebarItem: React.FC<{
  title: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ title, isSelected, onClick }) => {
  return (
    <li
      onClick={onClick}
      className={`flex items-center cursor-pointer w-full px-2 py-[6px] relative hover:bg-gray-50 dark:hover:bg-[#3a3b40] transition-colors duration-200`}
    >
      {/* Rounded border on the left */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-[3px] ${
          isSelected ? "bg-[#ff5600] dark:bg-[#ff8851] rounded-full" : "bg-transparent"
        }`}
      ></div>
      <span
        className={`flex-1 whitespace-nowrap ${
          isSelected
            ? "font-bold text-[#000000] dark:text-white"
            : "font-normal text-[rgba(60,60,60,0.7)] dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        } text-[14px] transition-colors duration-200`}
      >
        {title}
      </span>
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
    <div className="w-[300px] max-w-[300px] h-full bg-white dark:bg-[#2c2d32] p-5 flex flex-col transition-colors duration-200">
      {/* Back Button */}
      <div className="flex items-center mb-4">
        <button
          onClick={() => console.log("Back button clicked")}
          className="inline-flex items-center justify-center bg-none border-none cursor-pointer text-[30px] mr-[10px] text-black dark:text-white p-0 hover:opacity-80 transition-opacity duration-200"
        >
          <img src={Arrow} alt="Back Arrow" className="w-[25px] h-[25px] dark:opacity-80" />
        </button>

        <h2 className="font-medium text-[20px] leading-[28px] m-1 text-[rgba(0,0,0,0.8)] dark:text-white mr-1 transition-colors duration-200">
          All Templates
        </h2>
      </div>
      <ul className="list-none p-0 m-0 flex flex-col gap-3">
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
