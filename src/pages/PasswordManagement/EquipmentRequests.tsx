import Card from "./Card";

const EquipmentRequests = () => {
  const cardsData = [
    {
      title: "Request New Hardware",
      description:
        "Easily request new devices like laptops, monitors, or accessories.",
    },
    {
      title: "Request Software Licenses",
      description: "Quickly obtain licenses for essential software tools.",
    },
    {
      title: "Request Equipment Upgrades",
      description:
        "Upgrade your hardware for better performance with a simple request.",
    },
  ];

  return (
    <div className="w-[976px] h-[642px] top-[85px] left-[288px] rounded-xl bg-white p-[50px]">
      <h2 className="text-xl font-semibold text-[#262626] mb-2">
        EQUIPMENT REQUEST
      </h2>
      <p className="text-sm text-[#6c6f76] mb-6">
        Start with our most-used templated for work and life.
      </p>
      <div className="flex gap-[25px] p-0">
        {cardsData.map((card, index) => (
          <Card key={index} title={card.title} description={card.description} />
        ))}
      </div>
    </div>
  );
};

export default EquipmentRequests;
