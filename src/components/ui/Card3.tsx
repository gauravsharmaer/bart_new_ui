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
  };

  return (
    <div className="bg-[#fff5f5] flex flex-col items-center gap-6 mt-8 p-6 rounded-md shadow-md max-w-sm mx-auto">
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
          onClick={() => alert(`Entered OTP: ${otp.join("")}`)}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Card3;
























// import React, { useCallback, useEffect, useRef, useState } from "react";

// interface OTPInputCardProps {
//   onSubmitOTP: (displayText: string) => void;
//   otp: string[];
//   setOtp: React.Dispatch<React.SetStateAction<string[]>>;
// }

// const Card3: React.FC<OTPInputCardProps> = React.memo(
//   ({ onSubmitOTP, otp, setOtp }) => {
//     const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
//     const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

//     useEffect(() => {
//       inputRefs.current[0]?.focus();
//     }, []);

//     useEffect(() => {
//       const firstEmptyIndex = otp.findIndex((value) => value === "");
//       if (firstEmptyIndex >= 0) {
//         inputRefs.current[firstEmptyIndex]?.focus();
//       }
//     }, [otp]);

//     const handleChange = useCallback(
//       (index: number, value: string) => {
//         const newOtp = [...otp];
//         newOtp[index] = value.slice(-1);
//         setOtp(newOtp);

//         if (value && index < otp.length - 1) {
//           inputRefs.current[index + 1]?.focus();
//         }
//       },
//       [otp, setOtp]
//     );

//     const handleKeyDown = useCallback(
//       (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
//         if (event.key === "Backspace") {
//           event.preventDefault();
//           if (!otp[index] && index > 0) {
//             inputRefs.current[index - 1]?.focus();
//             const updatedOtp = [...otp];
//             updatedOtp[index - 1] = "";
//             setOtp(updatedOtp);
//           } else {
//             const updatedOtp = [...otp];
//             updatedOtp[index] = "";
//             setOtp(updatedOtp);
//           }
//         } else if (event.key === "Enter") {
//           handleSubmit();
//         }
//       },
//       [otp, setOtp]
//     );

//     const handleSubmit = useCallback(() => {
//       if (otp.every((digit) => digit !== "")) {
//         setIsSubmitted(true);
//         onSubmitOTP("Done");
//       } else {
//         // Show an error message or handle incomplete OTP
//         console.log("Please enter all OTP digits");
//       }
//     }, [otp, onSubmitOTP]);

//     if (isSubmitted) return null;

//     return (
//       <div className="otp-input-card bg-gray-800 p-4 rounded-lg">
//         <div className="otp-label text-white mb-2">Please enter OTP below</div>
//         <div className="otp-inputs flex gap-2">
//           {otp.map((value, index) => (
//             <input
//               key={index}
//               type="text"
//               inputMode="numeric"
//               pattern="\d*"
//               value={value}
//               onChange={(e) => handleChange(index, e.target.value)}
//               onKeyDown={(e) => handleKeyDown(index, e)}
//               onFocus={(e) => e.target.select()}
//               maxLength={1}
//               ref={(el) => (inputRefs.current[index] = el)}
//               className="otp-input w-10 h-10 text-center bg-gray-700 text-white border border-gray-600 rounded"
//             />
//           ))}
//         </div>
//         <button
//           className="otp-submit-btn bg-blue-500 text-white px-4 py-2 rounded mt-4"
//           onClick={handleSubmit}
//         >
//           Submit
//         </button>
//       </div>
//     );
//   }
// );

// export default Card3;

