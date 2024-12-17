import Card from "./Card";

const PasswordPage = () => {
  const cardsData = [
    {
      title: "Password Reset",
      description:
        "Keep your software up-to-date with automatic update requests.",
    },
    {
      title: "Unlock Account",
      description:
        "Regain access to locked accounts quickly with automated unlocks.",
    },
    {
      title: "Multi-Factor Authentication",
      description:
        "Easily set up, modify, or troubleshoot multi-factor authentication.",
    },
  ];

  return (
    <div className="w-[976px] h-[642px] top-[85px] left-[288px] rounded-xl bg-white p-[50px]">
      <h2 className="text-xl font-semibold text-[#262626] mb-2">
        PASSWORD MANAGEMENT
      </h2>
      <p className="text-sm text-[#6c6f76] mb-6">
        Start with our most-used templates for work and life.
      </p>
      <div className="flex gap-[25px] p-0">
        {cardsData.map((card, index) => (
          <Card key={index} title={card.title} description={card.description} />
        ))}
      </div>
    </div>
  );
};

export default PasswordPage;
