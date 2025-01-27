import DOMPurify from "dompurify";

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
export const playAudioBlob = async (audioBlob: Blob): Promise<void> => {
  const url = URL.createObjectURL(audioBlob);
  const audio = new Audio(url);

  try {
    await audio.play();
    console.log("Playing audio for testing...");

    // Clean up the URL after playing
    audio.onended = () => {
      URL.revokeObjectURL(url);
      console.log("Audio playback finished");
    };
  } catch (error) {
    console.error("Error playing audio:", error);
    URL.revokeObjectURL(url);
  }
};

export const textToSpeechBlob = async (text: string): Promise<Blob> => {
  try {
    console.log("Original input text:", text);

    const cleanText = text
      .replace(/<[^>]*>/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/[•\s]*Source[^\n]*(\n|$)/g, "\n")
      .replace(/\s+/g, " ")
      .trim();

    console.log("Cleaned text being sent to TTS API:", cleanText);

    const requestBody = {
      text: cleanText,
      voice: "en-US",
      rate: 1.0,
      pitch: 1.0,
      mens: true,
      format: "wav", // Explicitly request WAV format
    };

    console.log("TTS API request payload:", requestBody);

    // Call the deployed TTS API with specific parameters for better clarity
    const response = await fetch("https://voice-api-va05.onrender.com/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "audio/wav", // Explicitly request WAV format
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TTS API error response:", errorText);
      throw new Error(`TTS API request failed: ${errorText}`);
    }

    // Get the audio blob with explicit WAV type
    const audioBlob = await response.blob();
    const properAudioBlob = new Blob([audioBlob], { type: "audio/wav" });

    console.log("Received audio blob:", {
      originalType: audioBlob.type,
      newType: properAudioBlob.type,
      size: properAudioBlob.size,
    });

    // Verify the audio blob is valid
    if (properAudioBlob.size === 0) {
      throw new Error("Received empty audio blob from TTS API");
    }

    // Play the audio for testing
    await playAudioBlob(properAudioBlob);

    return properAudioBlob;
  } catch (error) {
    console.error("Error with TTS API:", error);
    throw error;
  }
};

// Function to convert blob to base64
const blobToBase64 = async (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(",")[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Function to send audio to Gooey.AI
export const sendToGooeyAPI = async (
  audioBlob: Blob
): Promise<{ video_url: string }> => {
  try {
    console.log("Starting Gooey API request with audio blob:", {
      type: audioBlob.type,
      size: audioBlob.size,
    });

    // Convert audio blob to base64
    const base64Audio = await blobToBase64(audioBlob);
    console.log("Successfully converted audio to base64");

    // Create the payload with base64 audio
    const payload = {
      functions: null,
      variables: null,
      input_face:
        "https://testing-bart-1.s3.us-east-2.amazonaws.com/LipSync+Video.mp4",
      face_padding_top: 0,
      face_padding_bottom: 18,
      face_padding_left: 0,
      face_padding_right: 0,
      sadtalker_settings: null,
      selected_model: "Wav2Lip",
      input_audio_base64: base64Audio,
      input_audio_format: audioBlob.type,
    };

    console.log("Sending request to Gooey API");

    const gooeyResponse = await fetch(
      "https://api.gooey.ai/v3/Lipsync/async/",
      {
        method: "POST",
        headers: {
          Authorization:
            "bearer sk-9P7tzGYH4qOPymfuEsuDxFMDdUhqpKNa4nC7dQXIXusCiWJJ",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!gooeyResponse.ok) {
      const errorData = await gooeyResponse.json();
      console.error("Gooey API error:", errorData);
      throw new Error(`Gooey API request failed: ${JSON.stringify(errorData)}`);
    }

    // Get the status URL from the response headers
    const statusUrl = gooeyResponse.headers.get("Location");
    if (!statusUrl) {
      throw new Error("No status URL returned from Gooey API");
    }

    console.log("Status URL for checking progress:", statusUrl);

    // Poll for completion
    while (true) {
      console.log("Checking processing status...");
      const statusResponse = await fetch(statusUrl, {
        headers: {
          Authorization:
            "bearer sk-9P7tzGYH4qOPymfuEsuDxFMDdUhqpKNa4nC7dQXIXusCiWJJ",
        },
      });

      if (!statusResponse.ok) {
        const errorData = await statusResponse.json();
        console.error("Status check error:", errorData);
        throw new Error(
          `Status check failed with status: ${
            statusResponse.status
          }. Error: ${JSON.stringify(errorData)}`
        );
      }

      const result = await statusResponse.json();
      console.log("Processing status:", result.status);

      if (result.status === "completed") {
        console.log("Video generation completed successfully");
        return { video_url: result.output.output_video };
      } else if (result.status === "failed") {
        console.error("Full error details:", result);
        throw new Error(`Lip-syncing failed: ${JSON.stringify(result)}`);
      }

      // Wait 3 seconds before next check
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  } catch (error) {
    console.error("Gooey API error:", error);
    throw error;
  }
};

// Main function to handle text to avatar conversion
export const handleTextToAvatarConversion = async (
  text: string
): Promise<string> => {
  try {
    // 1. Create audio from text and get it as a blob
    const audioBlob = await textToSpeechBlob(text);
    console.log("Audio blob created:", audioBlob);

    // 2. Send directly to Gooey.AI
    const result = await sendToGooeyAPI(audioBlob);
    console.log("Gooey API response:", result);

    return result.video_url;
  } catch (error) {
    console.error("Avatar conversion failed:", error);
    throw error;
  }
};

export default createMarkup;
