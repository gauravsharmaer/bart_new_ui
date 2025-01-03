import bgHome from "../../assets/bg_templates.svg";
import Card from "./Card";
import multifacauthIcon from "../../assets/multifacauth.svg";
import passwordResetIcon from "../../assets/password reset.svg";
import unlockAccIcon from "../../assets/unlock acc.svg";
import caretLeftIcon from "../../assets/CaretLeft.svg";

const PasswordPage = () => {
  const cardsData = [
    {
      title: "Password Reset",
      description:
        "Keep your software up-to-date with automatic update requests.",
      icon: passwordResetIcon,
    },
    {
      title: "Unlock Account",
      description:
        "Regain access to locked accounts quickly with automated unlocks.",
      icon: unlockAccIcon,
    },
    {
      title: "Multi-Factor Authentication",
      description:
        "Easily set up, modify, or troubleshoot multi-factor authentication.",
      icon: multifacauthIcon,
    },
  ];

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      {/* Background with White Container */}
      <div
        className="relative w-[1113px] h-[690px] bg-white rounded-2xl p-6 shadow-lg overflow-hidden "
        style={{
          backgroundImage: `url(${bgHome})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* Navigation */}
        <div className="absolute top-8 left-6 flex items-center text-sm">
          <a href="/" className="hover:underline flex items-center text-[#3c3c3c]">
            Home
          </a>
          <img src={caretLeftIcon} alt="Separator" className="w-4 h-4 mx-2" />
          <a href="/templates" className="hover:underline text-[#3c3c3c]">
            All templates
          </a>
          <img src={caretLeftIcon} alt="Separator" className="w-4 h-4 mx-2" />
          <span className="text-[#5f4eff]">Password Management</span>
        </div>

        {/* Page Header */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-[#000000] mb-2">
            PASSWORD MANAGEMENT
          </h2>
          <p className="text-sm text-[#6c6f76] mb-6">
            Start with our most-used templates for work and life.
          </p>
        </div>

        {/* Cards Section */}
        <div className="flex gap-[25px] p-0">
          {cardsData.map((card, index) => (
            <Card
              key={index}
              title={card.title}
              description={card.description}
              icon={card.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PasswordPage;