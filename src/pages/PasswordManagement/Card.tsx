import genie from "../../assets/genie.svg";
import { CardProps } from "./Interface/Interface";

const Card = ({ title, description }: CardProps) => {
  return (
    <div className="flex-1 min-w-[288px] h-[176px] rounded-xl bg-white p-5 shadow-md flex flex-col justify-between text-left border-t-[9px] border-t-[#7b5cff] relative mb-4">
      <img
        src={genie}
        alt="Genie Icon"
        className="absolute top-3 left-3 w-[29px] h-[29px]"
      />
      <div>
        <h3 className="mt-[30px] mb-2 text-[15px] font-semibold text-[#262626]">
          {title}
        </h3>
        <p className="m-0 text-[15px] text-[#6c6f76] leading-5">
          {description}
        </p>
      </div>
      <div className="flex justify-start items-center mt-auto">
        <span className="text-[#7b5cff] text-[25px] cursor-pointer">
          &rarr;
        </span>
      </div>
    </div>
  );
};

export default Card;
