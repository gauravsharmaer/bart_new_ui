// TypingEffect.tsx
import React, { useState, useEffect } from "react";
import createMarkup from "../utils/chatUtils";
import { TypingEffectProps } from "../props/Props";


const TypingEffect: React.FC<TypingEffectProps> = ({ text, speed = 50, inline = false }) => {
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
    <div
      data-testid="typing-effect"
      className="text-sm opacity-80 font-passenger text-[#00000]"
      dangerouslySetInnerHTML={createMarkup(displayedText, inline ? 'inline' : 'vertical')}
    />
  );
};

export default TypingEffect;
