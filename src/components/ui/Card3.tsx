import { useState } from "react";

const Card3 = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // Ensure only numbers are entered
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Automatically move to the next input field if the current one is filled
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }

    if (e.key === "Enter") {
      // Trigger the submit button when Enter is pressed
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    alert(`Entered OTP: ${otp.join("")}`);
  };

  return (
    <div className="bg-[#f5f5f5] flex flex-col items-center gap-3 mt-0 p-6 rounded-xl shadow-xl max-w-sm mx-auto">
      <div className="flex gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            value={digit}
            maxLength={1}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-12 text-center text-lg font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        ))}
      </div>
      <div className="w-full flex justify-start">
        <button
          className="bg-orange-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-orange-600"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Card3;
