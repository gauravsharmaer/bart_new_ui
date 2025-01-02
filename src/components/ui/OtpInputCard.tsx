import React from "react";
import { OtpInputCardProps } from "../../props/Props";

const OtpInputCard: React.FC<OtpInputCardProps> = ({
  onSubmitOTP,
  otp,
  setOtp,
}) => {
  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }

    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const otpString = otp.join("");
    if (otpString.length === 6) {
      onSubmitOTP(otpString);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-fit">
      <p className="text-lg font-medium">Please enter the OTP below:</p>
      <div className="flex gap-2 justify-center">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            value={digit}
            maxLength={1}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-12 text-center text-lg font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        ))}
      </div>
      <div className="w-full flex">
        <button
          onClick={handleSubmit}
          className="bg-orange-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-orange-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default OtpInputCard;
