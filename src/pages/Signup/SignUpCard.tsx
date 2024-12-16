import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useState } from "react";
import bartLogo from "../../assets/bartLogo.svg";
import CardBackground from "../../components/CardBackground";
export default function Card() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-[450px] mx-auto">
      {/* Logo and Header */}
      <div className="flex flex-col items-center gap-5">
        <img src={bartLogo} alt="Bart Logo" className="w-16 h-16" />
        <div className="text-[#202B3B] text-[24px] font-medium">
          Upload Profile Photo
        </div>
      </div>

      <CardBackground>
        <div className="p-5 space-y-7 w-full max-w-[450px]">
          {/* Header Section */}
          <div className="space-y-7 ">
            {/* Drag/Select a photo */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-32 h-32 rounded-full bg-white border-2 border-dashed border-[#202B3B] flex items-center justify-center text-[#202B3B] text-center opacity-30">
                Drag/Select a photo
              </div>
            </div>

            {/* Form Section */}
            <div className="space-y-4 ">
              <div className="space-y-4 mb-4">
                <div className="relative h-[63px] flex flex-col gap-2">
                  <div className="text-[#202B3B] text-xs font-medium pl-2">
                    First Name
                  </div>
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className=" rounded-full"
                  />
                </div>

                <div className="relative h-[63px] flex flex-col gap-2">
                  <div className="text-[#202B3B] text-xs font-medium pl-2">
                    Last Name
                  </div>
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="rounded-full"
                  />
                </div>
              </div>

              <Button
                variant="default"
                className="w-full  h-[49px] rounded-full text-white bg-gradient-to-b
                 from-[#FE7855] to-[#FF0000] hover:opacity-90 transition-opacity"
              >
                I'm Ready
              </Button>
            </div>
          </div>

          {/* Footer Section */}
          <div className="flex flex-col items-center gap-7 w-[311px] mx-auto"></div>
        </div>
      </CardBackground>
    </div>
  );
}
