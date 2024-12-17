import React from "react";

const SidebarItem: React.FC<{
  title: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ title, isSelected, onClick }) => {
  return (
    <li
      onClick={onClick}
      className={`flex items-center cursor-pointer w-full px-5 py-6 
      ${isSelected ? "font-bold text-black" : "font-normal text-[#6b6b6b]"}
      ${
        isSelected
          ? "border-l-[3px] border-l-[#ff6a00]"
          : "border-l-[3px] border-transparent"
      }
      ${isSelected ? "bg-[#f9f9f9]" : "bg-transparent"}
      transition-all duration-300 ease-in-out`}
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
    <div className="w-[300px] max-w-full h-full bg-white p-5 shadow-md flex flex-col">
      {/* Back Button */}
      <div className="flex items-center mb-4">
        <button
          onClick={() => console.log("Back button clicked")}
          className="inline-flex items-center justify-center bg-none border-none cursor-pointer text-[30px] mr-[1px] text-black p-0"
        >
          ←
        </button>

        <h2 className="font-[Graphik] font-medium text-[25px] leading-[28px] m-0 text-black">
          Categories
        </h2>
      </div>
      <ul className="list-none p-0 m-0 flex flex-col gap-1">
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
