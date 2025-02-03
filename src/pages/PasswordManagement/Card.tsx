import { CardProps } from "./Interface/Interface";
import Arrow from "../../assets/arrow.svg"
import BackGround from "../../assets/bg_card.svg"
import Hover from "../../assets/hover_arrow.svg"
 
const Card = ({ title, description, icon }: CardProps) => {
  return (
    <div className="relative flex-1 min-w-[290px] h-[176px] rounded-xl bg-white dark:bg-[#2c2d32] p-5 flex flex-col justify-between text-left mb-4 group overflow-hidden border-t-0 border-l border-r border-b border-solid border-[#D7D7D7] dark:border-[#3a3b40] transition-all duration-200">
      {/* Gradient Bar */}
      <div className="absolute top-0 left-0 w-full h-[9px] rounded-t-xl bg-gradient-to-r from-[#BEA4FD] to-[#786AFF]"></div>
      
      {/* Background on Hover */}
      <img
        src={BackGround}
        alt="Background"
        className="absolute top-0 right-0 w-[280px] h-[200px] object-cover rounded-xl opacity-0 group-hover:opacity-100 
         transition-opacity duration-200"
      />
      
      {/* Icon */}
      <img
        src={icon}
        alt={`${title} Icon`}
        className="absolute top-6 left-4.5 w-[29px] h-[29px] z-10 dark:opacity-90"
      />
      
      {/* Title and Description */}
      <div className="z-10">
        <h3 className="mt-[40px] mb-3 text-[15px] font-semibold text-[#262626] dark:text-white transition-colors duration-200">
          {title}
        </h3>
        <p className="m-0 text-[15px] text-[#6c6f76] dark:text-gray-400 leading-5 line-clamp-2 transition-colors duration-200">
          {description}
        </p>
      </div>
      
      {/* Arrow with Hover Effect */}
      <div className="absolute bottom-3 left-3 flex justify-start items-center z-10">
        <img
          src={Arrow}
          alt="Arrow"
          className="w-[25px] h-[25px] cursor-pointer group-hover:opacity-0 dark:opacity-80 transition-opacity duration-300"
        />
        <img
          src={Hover}
          alt="Hover Arrow"
          className="absolute w-[25px] h-[25px] opacity-0 group-hover:opacity-100  transition-opacity duration-300"
        />
      </div>
    </div>
  );
};

export default Card;
