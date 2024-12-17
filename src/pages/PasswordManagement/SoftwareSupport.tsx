import Card from "./Card";

const SoftwareSupport = () => {
  const cardsData = [
    {
      title: "Install/Uninstall Software",
      description:
        "Seamlessly install or remove software applications as needed.",
    },
    {
      title: "Software Updates",
      description:
        "Keep your software up-to-date with automatic update requests.",
    },
    {
      title: "License Management",
      description: "Manage and track software licenses for all your tools.",
    },
    {
      title: "Access Rights and Permission",
      description:
        "Adjust user access and permissions with ease for secure operations.",
    },
  ];

  return (
    <div className="w-[976px] h-[642px] top-[85px] left-[288px] rounded-xl bg-white p-[50px]">
      <h2 className="text-xl font-semibold text-[#262626] mb-2">
        SOFTWARE AND APPLICATION SUPPORT
      </h2>
      <p className="text-sm text-[#6c6f76] mb-6">
        Install, update, or troubleshoot software with ease.
      </p>
      <div className="flex gap-[25px] p-0">
        {cardsData.map((card, index) => (
          <Card key={index} title={card.title} description={card.description} />
        ))}
      </div>
    </div>
  );
};

export default SoftwareSupport;
