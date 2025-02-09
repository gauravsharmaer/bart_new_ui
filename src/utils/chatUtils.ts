import DOMPurify from "dompurify";
import { REACT_APP_GOOEY_API_KEY, REACT_APP_GOOEY_API_URL } from "../config";

// Add type declarations at the top of the file
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
    webkitAudioContext: typeof AudioContext;
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

  // Process text enclosed in ** as headings
  processedText = processedText.replace(
    /\*\*(.*?)\*\*/g,
    '<span class="font-bold ">$1</span>'
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
    .replace(/<[^>]*>/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[•\s]*Source[^\n]*(\n|$)/g, "\n")
    .replace(/\s+/g, " ")
    .trim();

  // Create new speech synthesis instance
  const speech = new SpeechSynthesisUtterance();
  speech.text = cleanText;
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;
  speech.lang = "en-US";

  // // Get available voices and set an English voice
  // const voices = window.speechSynthesis.getVoices();
  // const englishVoice = voices.find(
  //   (voice) => voice.lang.startsWith("en-") && voice.name.includes("Female")
  // );
  // if (englishVoice) {
  //   speech.voice = englishVoice;
  // }

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

// Function to play audio blob for testing
// export const playAudioBlob = async (audioBlob: Blob): Promise<void> => {
//   const url = URL.createObjectURL(audioBlob);
//   const audio = new Audio(url);

//   try {
//     await audio.play();
//     console.log("Playing audio for testing...");

//     // Clean up the URL after playing
//     audio.onended = () => {
//       URL.revokeObjectURL(url);
//       console.log("Audio playback finished");
//     };
//   } catch (error) {
//     console.error("Error playing audio:", error);
//     URL.revokeObjectURL(url);
//   }
// };

export const handleTextToAvatarConversion = async (
  text: string
): Promise<string> => {
  try {
    // Clean the text but preserve natural speech patterns
    const cleanText = text
      .replace(/<[^>]*>/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/https?:\/\/\S+/g, "")
      .trim();

    console.log("Cleaned text:", cleanText);

    // Create the payload for Gooey API
    const payload = {
      functions: null,
      variables: null,
      text_prompt: cleanText,
      input_face:
        "https://testing-bart-1.s3.us-east-2.amazonaws.com/LipSync+Video.mp4",
      face_padding_top: 0,
      face_padding_bottom: 18,
      face_padding_left: 0,
      face_padding_right: 0,
      sadtalker_settings: null,
      selected_model: "Wav2Lip",
      text_to_speech: true,
      tts_settings: {
        voice_id: "en-US-Neural2-F",
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
      },
    };

    console.log("Sending request to Gooey API with payload:", payload);

    // Make the API call
    const response = await fetch(REACT_APP_GOOEY_API_URL, {
      method: "POST",
      headers: {
        Authorization: `bearer ${REACT_APP_GOOEY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log("API Response:", result);

    if (result.output && result.output.output_video) {
      return result.output.output_video;
    } else {
      throw new Error("No video URL in response");
    }
  } catch (error) {
    console.error("Avatar conversion failed:", error);
    throw error;
  }
};

// Remove unused functions
export const textToSpeechBlob = undefined;
export const sendToGooeyAPI = undefined;

export default createMarkup;
