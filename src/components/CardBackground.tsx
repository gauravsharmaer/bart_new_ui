import React from "react";
interface CardProps {
  children?: React.ReactNode;
}
const CardBackground = ({ children }: CardProps) => {
  return (
    <div
      className="items-center gap-2.5 px-0 py-2 relative bg-gradient-to-t from-[#FF3F0C0A] via-white to-white rounded-[20px] overflow-hidden border border-solid border-transparent flex flex-col w-full max-w-[500px] mx-auto"
      style={{
        background:
          "linear-gradient(to top, #FF3F0C0A, rgba(255, 63, 12, 0) 50%, white)",
      }}
    >
      {children}
    </div>
  );
};

export default CardBackground;
