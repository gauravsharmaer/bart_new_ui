//New chatUtils.ts

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

// Add these variables at the top of the file, after imports
let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentMessageId: string | null = null;
let activeMessageComponent: { resetSpeakingState: () => void } | null = null;

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

  // processedText = processedText.replace(
  //   /\[(.*?)\]\((.*?)\)/g,
  //   '<a href="$2" target="_blank" class=" border border-gray-300  p-2 bg-white rounded-md font-bold flex w-[300px]">$1</a>'
  // );

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

export const speakText = (text: string, messageId: string): SpeechSynthesisUtterance => {
  // Clean the text - remove HTML tags and hyperlinks
  let cleanText = text
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Remove markdown links [text](url) - keep only the text part
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    // Remove URLs
    .replace(/https?:\/\/\S+/g, "")
    // Remove just the word "source" and any text after it on the same line
    .replace(/source.*?(?=\n|$)/gi, "")
    // Clean up extra spaces and line breaks
    .replace(/\s+/g, " ")
    .trim();

  
  // Create new speech synthesis instance
  const speech = new SpeechSynthesisUtterance();
  speech.text = cleanText;
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;
  speech.lang = 'en-US';
  
  // Update global state
  currentUtterance = speech;
  currentMessageId = messageId;

  try {
    window.speechSynthesis.speak(speech);
  } catch (error) {
    console.error('Speech synthesis error:', error);
    currentUtterance = null;
    currentMessageId = null;
  }

  return speech;
};

// Function to stop speaking
export const stopSpeaking = () => {
  if (currentUtterance) {
    window.speechSynthesis.pause();
  }
};

// Function to resume speaking
export const resumeSpeaking = () => {
  if (currentUtterance) {
    window.speechSynthesis.resume();
  }
};

export const cancelSpeaking = () => {
  try {
    window.speechSynthesis.cancel();
    
    if (activeMessageComponent) {
      activeMessageComponent.resetSpeakingState();
    }
  } catch (error) {
    console.error('Error cancelling speech:', error);
  } finally {
    currentUtterance = null;
    currentMessageId = null;
  }
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

export const getCurrentSpeakingMessageId = () => currentMessageId;

export const setActiveMessageComponent = (component: { resetSpeakingState: () => void }) => {
  activeMessageComponent = component;
};

// Add this at the top with other event listeners
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    window.speechSynthesis.cancel();
  });
}

export default createMarkup;