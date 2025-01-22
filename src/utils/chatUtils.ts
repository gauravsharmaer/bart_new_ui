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

let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentMessageId: string | null = null;
let activeMessageComponent: { resetSpeakingState: () => void } | null = null;

export const createTimestamp = (): string => {
  return new Date().toISOString();
};

const createMarkup = (text: string) => {
  // First sanitize the HTML to prevent XSS attacks
  const sanitizedHtml = DOMPurify.sanitize(text, {
    ALLOWED_TAGS: ["h2", "a", "br", "p", "ul", "li"],
    ALLOWED_ATTR: ["href", "target", "class"],
  });

  // Remove Sources header
  let processedText = sanitizedHtml.replace(/<h2>Sources<\/h2>/, "");

  // Convert newlines to <br> tags
  processedText = processedText.replace(/\n/g, "<br>");

  // Process any markdown-style headers that weren't already HTML
  processedText = processedText.replace(
    /^## (.*$)/gm,
    '<h2 class="text-xl font-bold mb-2">$1</h2>'
  );

  // Process links if they're in markdown format
  processedText = processedText.replace(
    /\[(.*?)\]\((.*?)\)/g,
    '<a href="$2" target="_blank" class="border border-gray-300 flex p-1 bg-white rounded-md font-bold w-[300px]">$1</a>'
  );

  // Add classes to existing HTML elements
  processedText = processedText
    // Style paragraphs
    .replace(/<p>/g, '<p class="mb-2">')
    // Style unordered lists
    .replace(/<ul>/g, '<ul class="list-none  mb-2">')
    // Style list items
    .replace(/<li>/g, '<li class="mb-2">')
    // Style links that aren't already styled
    .replace(
      /<a(?![^>]*class=)/g,
      '<a class="border border-gray-300 flex p-1 bg-white rounded-md font-bold w-[300px]"'
    );

  return {
    __html: processedText,
  };
};

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

export const speakText = (
  text: string,
  messageId: string
): SpeechSynthesisUtterance => {
  // Clean the text - remove HTML tags and hyperlinks
  const cleanText = text
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Remove markdown links [text](url) - keep only the text part
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    // Remove URLs
    .replace(/https?:\/\/\S+/g, "")
    // Remove Source references
    .replace(/[•\s]*Source[^\n]*(\n|$)/g, "\n")
    // Clean up extra spaces and line breaks
    .replace(/\s+/g, " ")
    .trim();

  // Create new speech synthesis instance
  const speech = new SpeechSynthesisUtterance();
  speech.text = cleanText;
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;
  speech.lang = "en-US";

  // Update global state
  currentUtterance = speech;
  currentMessageId = messageId;

  try {
    window.speechSynthesis.speak(speech);
  } catch (error) {
    console.error("Speech synthesis error:", error);
    currentUtterance = null;
    currentMessageId = null;
  }

  return speech;
};

// Function to stop speaking
// export const stopSpeaking = () => {
//   window.speechSynthesis.cancel();
// };

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
    console.error("Error cancelling speech:", error);
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

export const getCurrentSpeakingMessageId = () => currentMessageId;

export const setActiveMessageComponent = (component: {
  resetSpeakingState: () => void;
}) => {
  activeMessageComponent = component;
};

// Add this at the top with other event listeners
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    window.speechSynthesis.cancel();
  });
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
