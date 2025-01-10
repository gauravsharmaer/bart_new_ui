// TypingEffect.tsx
import React, { useState, useEffect } from 'react';
import createMarkup from '../utils/chatUtils';

interface TypingEffectProps {
  text: string;
  speed?: number; // Speed in milliseconds
}

const TypingEffect: React.FC<TypingEffectProps> = ({ text, speed = 50 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    // Parse the HTML content first
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    //const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
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

  return <div dangerouslySetInnerHTML={createMarkup(displayedText)} />;
};

export default TypingEffect;