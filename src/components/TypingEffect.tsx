// TypingEffect.tsx
import React, { useState, useEffect } from "react";
import createMarkup from "../utils/chatUtils";

interface TypingEffectProps {
  text: string;
  speed?: number; // Speed in milliseconds
}

const TypingEffect: React.FC<TypingEffectProps> = ({ text, speed = 50 }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    // Parse the HTML content first
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = text;

    let index = 0;
    const intervalId = setInterval(() => {
      if (index <= text.length) {
        // Use the original HTML text up to the current index
        setDisplayedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return (
    // <div
    //   className="text-sm text-black
    //     [&_a:hover]:text-blue-300
    //     [&_ol]:list-decimal [&_ul]:list-disc [&_li]:ml-4 [&_li]:block [&_li]:my-1"
    //   dangerouslySetInnerHTML={createMarkup(displayedText)}
    // />
    <div
      className="text-sm opacity-80 font-passenger text-[#00000]"
      dangerouslySetInnerHTML={createMarkup(displayedText)}
    />
  );
};

export default TypingEffect;
