// import DOMPurify from "dompurify";

// // Add type declarations at the top of the file
// declare global {
//   interface Window {
//     SpeechRecognition?: new () => SpeechRecognition;
//     webkitSpeechRecognition?: new () => SpeechRecognition;
//   }
// }

// interface SpeechRecognitionResult {
//   isFinal: boolean;
//   [index: number]: {
//     transcript: string;
//     confidence: number;
//   };
// }

// interface SpeechRecognitionEvent {
//   results: SpeechRecognitionResult[];
//   resultIndex: number;
// }

// interface SpeechRecognitionError {
//   error: string;
//   message: string;
// }

// interface SpeechRecognition extends EventTarget {
//   continuous: boolean;
//   interimResults: boolean;
//   lang: string;
//   onresult: (event: SpeechRecognitionEvent) => void;
//   onend: () => void;
//   onerror: (event: SpeechRecognitionError) => void;
//   start: () => void;
//   stop: () => void;
// }

// export const createTimestamp = (): string => {
//   return new Date().toISOString();
// };

// const createMarkup = (text: string) => {
//   // First convert all dashes to dots
//   let processedText = text.replace(/^-/gm, "•");

//   // Convert markdown headers (##) to HTML
//   processedText = processedText.replace(
//     /^## (.*$)/gm,
//     '<h2 class="text-xl font-bold ">$1</h2>'
//   );

//   // Convert bullet points to list items
//   processedText = processedText.replace(
//     /^•\s+(.*$)/gm,
//     '<li class="relative">• $1</li>'
//   );

//   // Convert numbered lists
//   processedText = processedText.replace(
//     /^\d+\.\s+(.*$)/gm,
//     (match) => `<li>${match}</li>`
//   );

//   // Convert indented bullet points
//   processedText = processedText.replace(/^[ ]{3}•\s+(.*$)/gm, "<li>• $1</li>");

//   // Convert newlines to <br> tags (after handling lists)
//   processedText = processedText.replace(/\n/g, "<br>");

//   // Wrap lists in ul tags (modified to remove extra spacing)
//   processedText = processedText.replace(
//     /(<li.*?>.*?<\/li>\n?)+/gs,
//     (match) => `<ul class="list-none ">${match.replace(/\n/g, "")}</ul>`
//   );

//   // Convert links [text](url) to anchor tags
//   processedText = processedText.replace(
//     /\[(.*?)\]\((.*?)\)/g,
//     '<a href="$2" target="_blank" class="text-blue-500 hover:text-blue-700">$1</a>'
//   );

//   // Sanitize the HTML to prevent XSS attacks
//   const sanitizedHtml = DOMPurify.sanitize(processedText, {
//     ALLOWED_TAGS: ["h2", "ul", "li", "a", "br"],
//     ALLOWED_ATTR: ["href", "target", "class"],
//   });

//   return {
//     __html: sanitizedHtml,
//   };
// };

// export const speakText = (text: string): SpeechSynthesisUtterance => {
//   // Remove HTML tags from the text
//   const cleanText = text.replace(/<[^>]*>/g, "");

//   // Create speech synthesis instance
//   const speech = new SpeechSynthesisUtterance();
//   speech.text = cleanText;
//   speech.volume = 1;
//   speech.rate = 1;
//   speech.pitch = 1;

//   // Use the default voice
//   const voices = window.speechSynthesis.getVoices();
//   const englishVoice = voices.find((voice) => voice.lang.startsWith("en-"));
//   if (englishVoice) {
//     speech.voice = englishVoice;
//   }

//   // Cancel any ongoing speech
//   window.speechSynthesis.cancel();

//   // Return the utterance instance
//   return speech;
// };

// // Function to stop speaking
// export const stopSpeaking = () => {
//   window.speechSynthesis.cancel();
// };

// // Speech Recognition setup
// const SpeechRecognitionAPI =
//   window.SpeechRecognition || window.webkitSpeechRecognition;
// const recognition: SpeechRecognition | null = SpeechRecognitionAPI
//   ? new SpeechRecognitionAPI()
//   : null;

// if (recognition) {
//   recognition.continuous = true;
//   recognition.interimResults = true;
//   recognition.lang = "en-US";
// }

// export const startSpeechRecognition = (
//   onResult: (text: string) => void,
//   onEnd: () => void
// ) => {
//   if (!recognition) {
//     console.error("Speech recognition is not supported in this browser");
//     return false;
//   }

//   recognition.onresult = (event: SpeechRecognitionEvent) => {
//     const transcript = Array.from(event.results)
//       .map((result) => result[0].transcript)
//       .join("");
//     onResult(transcript);
//   };

//   recognition.onend = onEnd;
//   recognition.start();
//   return true;
// };

// export const stopSpeechRecognition = () => {
//   if (recognition) {
//     recognition.stop();
//   }
// };

// export default createMarkup;

import DOMPurify from "dompurify";

// Add type declarations at the top of the file
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: {
    transcript: string;
    confidence: number;
  };
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResult[];
  resultIndex: number;
}

interface SpeechRecognitionError {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionError) => void;
  start: () => void;
  stop: () => void;
}

export const createTimestamp = (): string => {
  return new Date().toISOString();
};

const createMarkup = (text: string) => {
  // First convert all dashes to dots
  let processedText = text.replace(/^-/gm, "•");

  // Convert markdown headers (##) to HTML
  processedText = processedText.replace(
    /^## (.*$)/gm,
    '<h2 class="text-xl font-bold">$1</h2>'
  );

  processedText = processedText.replace(/-/g, "•");

  // Convert links [text](url) to anchor tags
  processedText = processedText.replace(
    /\[(.*?)\]\((.*?)\)/g,
    '<a href="$2" target="_blank" class="text-blue-500 hover:text-blue-700">$1</a>'
  );

  // Convert newlines to <br> tags
  processedText = processedText.replace(/\n/g, "<br>");

  // Sanitize the HTML to prevent XSS attacks
  const sanitizedHtml = DOMPurify.sanitize(processedText, {
    ALLOWED_TAGS: ["h2", "a", "br"],
    ALLOWED_ATTR: ["href", "target", "class"],
  });

  return {
    __html: sanitizedHtml,
  };
};

export const speakText = (text: string): SpeechSynthesisUtterance => {
  // Remove HTML tags from the text
  const cleanText = text.replace(/<[^>]*>/g, "");

  // Create speech synthesis instance
  const speech = new SpeechSynthesisUtterance();
  speech.text = cleanText;
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;

  // Use the default voice
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find((voice) => voice.lang.startsWith("en-"));
  if (englishVoice) {
    speech.voice = englishVoice;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Return the utterance instance
  return speech;
};

// Function to stop speaking
export const stopSpeaking = () => {
  window.speechSynthesis.cancel();
};

// Speech Recognition setup
const SpeechRecognitionAPI =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition: SpeechRecognition | null = SpeechRecognitionAPI
  ? new SpeechRecognitionAPI()
  : null;

if (recognition) {
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";
}

export const startSpeechRecognition = (
  onResult: (text: string) => void,
  onEnd: () => void
) => {
  if (!recognition) {
    console.error("Speech recognition is not supported in this browser");
    return false;
  }

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join("");
    onResult(transcript);
  };

  recognition.onend = onEnd;
  recognition.start();
  return true;
};

export const stopSpeechRecognition = () => {
  if (recognition) {
    recognition.stop();
  }
};

export default createMarkup;
