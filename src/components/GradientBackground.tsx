// interface GradientBackgroundProps {
//   children?: React.ReactNode;
// }
import { GradientBackgroundProps } from "../props/Props";

export default function GradientBackground({
  children,
}: GradientBackgroundProps) {
  return (
    <div className="bg-white min-h-screen w-full">
      <div className="bg-white overflow-hidden min-h-screen w-full relative">
        {/* Center coral gradients */}
        <div
          className="absolute w-[280px] h-[430px] bottom-0 left-[485px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, #F9C6B9 0%, #EF613C 100%)",
            filter: "blur(193px)",
          }}
        />
        <div
          className="absolute w-[280px] h-[430px] bottom-0 left-[820px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, #F9C6B9 0%, #EF613C 100%)",
            filter: "blur(193px)",
          }}
        />

        {/* Side yellow-orange gradients */}
        <div
          className="absolute w-[335px] h-[462px] bottom-0 left-[111px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, #FFA462 0%, #F4D564 100%)",
            filter: "blur(193px)",
          }}
        />
        <div
          className="absolute w-[335px] h-[462px] bottom-0 left-[1194px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, #FFA462 0%, #F4D564 100%)",
            filter: "blur(193px)",
          }}
        />

        {/* Container for child components */}
        <div className="relative z-10 min-h-screen">{children}</div>
      </div>
    </div>
  );
}
