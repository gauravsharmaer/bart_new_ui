import bgHome from "../../assets/bg_templates.svg";
import Card from "./Card";
import caretLeftIcon from "../../assets/CaretLeft.svg";

// Import icons
import accessRightsIcon from "../../assets/AccessRig.svg";
import softwareUpdateIcon from "../../assets/softwareupdate.svg";
import installUninstallIcon from "../../assets/installunistall.svg";
import licenseManagementIcon from "../../assets/LicenseMag.svg";

const SoftwareSupport = () => {
  const cardsData = [
    {
      title: "Install/Uninstall Software",
      description:
        "Seamlessly install or remove software applications as needed.",
      icon: installUninstallIcon,
    },
    {
      title: "Software Updates",
      description:
        "Keep your software up-to-date with automatic update requests.",
      icon: softwareUpdateIcon,
    },
    {
      title: "License Management",
      description: "Manage and track software licenses for all your tools.",
      icon: licenseManagementIcon,
    },
    {
      title: "Access Rights and Permission",
      description:
        "Adjust user access and permissions with ease for secure operations.",
      icon: accessRightsIcon,
    },
  ];

  const firstRow = cardsData.slice(0, 3);
  const secondRow = cardsData.slice(3);

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <div
        className="relative w-[1113px] h-[690px] bg-white rounded-2xl p-6 shadow-lg overflow-hidden"
        style={{
          backgroundImage: `url(${bgHome})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute top-8 left-6 flex items-center text-sm">
          <a href="/" className="hover:underline flex items-center text-[#3c3c3c]">
            Home
          </a>
          <img src={caretLeftIcon} alt="Separator" className="w-4 h-4 mx-2" />
          <a href="/templates" className="hover:underline text-[#3c3c3c]">
            All templates
          </a>
          <img src={caretLeftIcon} alt="Separator" className="w-4 h-4 mx-2" />
          <span className="text-[#5f4eff]">Software & Application Support</span>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-[#262626] mb-2">
            SOFTWARE AND APPLICATION SUPPORT
          </h2>
          <p className="text-sm text-[#6c6f76] mb-6">
            Install, update, or troubleshoot software with ease.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-[25px]">
            {firstRow.map((card, index) => (
              <Card
                key={index}
                title={card.title}
                description={card.description}
                icon={card.icon}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-[25px]">
            <div className="col-start-1">
              {secondRow.map((card, index) => (
                <Card
                  key={index + 3}
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoftwareSupport;