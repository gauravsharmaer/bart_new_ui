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
      className={`flex items-center cursor-pointer w-full px-2 py-[6px] relative`}
    >
      {/* Rounded border on the left */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-[3px] ${
          isSelected ? "bg-[#ff5600] rounded-full" : "bg-transparent"
        }`}
      ></div>
       <span
        className={`flex-1 whitespace-nowrap  ${
          isSelected
            ? "font-bold text-[#000000] "
            : "font-normal text-[rgba(60,60,60,0.7)]"

        } text-[14px]`}
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
    <div className="w-[300px] max-w-[300px] h-full bg-white p-5 flex flex-col">
      {/* Back Button */}
      <div className="flex items-center mb-4">
        <button
          onClick={() => console.log("Back button clicked")}
          className="inline-flex items-center justify-center bg-none border-none cursor-pointer text-[30px] mr-[10px] text-black p-0"
        >
          <img src={Arrow} alt="Back Arrow" className="w-[25px] h-[25px]" />
          </button>

        <h2 className="font-medium text-[20px] leading-[28px] m-1 text-[rgba(0,0,0,0.8)] mr-1">
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