import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useState } from "react";
import bartLogo from "../../assets/bartLogo.svg";
import profileSignup from "../../assets/profile_signup.svg";

const Card = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[450px] mx-auto">
      {/* Logo and Header */}
      <div className="flex flex-col items-center gap-8">
        <img src={bartLogo} alt="Bart Logo" className="w-16 h-16" />
        <div className="text-[#202B3B] text-[24px] font-medium">
          Upload Profile Photo
        </div>
      </div>

      {/* Card Background */}
      <div className="p-5 space-y-7 w-full max-w-[450px]">
        {/* Header Section */}
        <div className="space-y-7">
          {/* Drag/Select a photo */}
          <div className="flex flex-col items-center gap-2">
            <img
              src={profileSignup}
              alt="Profile Signup"
              className="w-32 h-32 rounded-full"
            />
          </div>

          {/* Form Section */}
          <div className="space-y-4">
            <div className="space-y-4 mb-4">
              <div className="relative h-[63px] flex flex-col gap-2">
                <div className="text-[#202B3B] text-xs font-medium pl-4">
                  First Name
                </div>
                <Input
                  type="search"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="rounded-full w-100 h-100"
                />
              </div>

              <div className="relative h-[63px] flex flex-col gap-2 ">
                <div className="text-[#202B3B] text-xs font-medium pl-4">
                  Last Name
                </div>
                <Input
                  type="search"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="rounded-full w-100 h-100"
                />
              </div>
            </div>

            <Button
              variant="default"
              className="w-full h-[49px] rounded-full text-white bg-gradient-to-b
               from-[#FE7855] to-[#FF0000] hover:opacity-90 transition-opacity"
            >
              I'm Ready
            </Button>
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex flex-col items-center gap-7 w-[311px] mx-auto"></div>
      </div>
    </div>
  );
};

export default Card;