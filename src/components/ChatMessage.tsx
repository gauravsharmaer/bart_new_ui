import { useState, useCallback, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import ChatLogo from "../assets/Genie.svg";
import VerifyAuth from "../pages/Home/verifyAuth";
import { askBart, verifyOTP } from "../Api/CommonApi";
import OtpInputCard from "./ui/OtpInputCard";
import createMarkup from "../utils/chatUtils";
import ChatButtonCard from "./ui/ChatButtonCard";
import UserCard from "./ui/UserCard";
import TicketCard from "./ui/ticketcard";
import TypingEffect from './TypingEffect';
import VoiceChatCard from "./ui/VoiceChatCard";

// Speech Recognition Types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal?: boolean;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult[];
  [index: number]: SpeechRecognitionResult[];
}

interface SpeechRecognitionErrorEvent extends Event {
  error: 'not-allowed' | 'audio-capture' | 'network' | 'no-speech' | 'service-not-allowed';
  message: string;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
}

interface ISpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: ISpeechRecognitionConstructor;
    webkitSpeechRecognition?: ISpeechRecognitionConstructor;
  }
}

interface Message {
  text: string;
  isUserMessage: boolean;
  button_display: boolean;
  number_of_buttons: number;
  button_text: string[];
  id?: string;
  vertical_bar?: boolean;
  timestamp: string;
  ticket?: boolean;
  ticket_options?: {
    name: string | undefined;
    description: string | undefined;
    ticket_id: string | undefined;
    assignee_name: string | undefined;
  };
}

interface ChatMessageProps {
  message: Message;
  chatId: string;
  onNewMessage: (message: Message) => void;
  isMuted?: boolean;
}

interface ChatMessageRef {
  startVoiceRecognition: () => void;
  stopVoiceRecognition: () => void;
}

const ChatMessage = forwardRef<ChatMessageRef, ChatMessageProps>(({ message, onNewMessage, isMuted }, ref) => {
  const [showAuthVideoCard, setShowAuthVideoCard] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [clickedButton, setClickedButton] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [showFullText, setShowFullText] = useState(false);
  const [showVoiceCard, setShowVoiceCard] = useState(false);
  const [voiceText, setVoiceText] = useState("");

  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.');
      return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return null;
    }

    const recognition: ISpeechRecognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onstart = () => {
      setIsListening(true);
      console.log('Speech recognition started');
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('Speech recognition ended');
      if (!isProcessing && !document.hidden && !isSpeaking) {
        recognition.start();
      }
    };

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const resultIndex = event.resultIndex;
      const transcript = event.results[resultIndex][0].transcript;

      if (!isProcessing) {
        setIsProcessing(true);
        setVoiceText(transcript);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setShowVoiceCard(false);
        await handleVoiceInput(transcript);
        setIsProcessing(false);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      
      // Only show alert for permission errors
      if (event.error === 'not-allowed') {
        alert('Please allow microphone access to use voice chat.');
      }
      
      // For no-speech errors, just restart if we're supposed to be listening
      if (event.error === 'no-speech' && isListening && !isProcessing && !document.hidden) {
        try {
          recognition.start();
        } catch (e) {
          console.log('Failed to restart recognition:', e);
          setIsListening(false);
        }
        return;
      }

      setIsListening(false);
      setIsProcessing(false);
    };

    return recognition;
  };

  const speak = useCallback(
    async (text: string) => {
      return new Promise<void>((resolve) => {
        if (!text || isMuted) {
          resolve();
          return;
        }

        // Clean up any ongoing speech synthesis
        if (utteranceRef.current) {
          window.speechSynthesis.cancel();
        }

        // Wait a moment for the cleanup to complete
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(text);
          utteranceRef.current = utterance;

          // Load voices and select an English voice
          const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            const englishVoice = voices.find(
              (voice) => 
                voice.lang.includes('en-US') || 
                voice.lang.includes('en-GB')
            );
            
            if (englishVoice) {
              utterance.voice = englishVoice;
            }
          };

          // Handle the voiceschanged event
          speechSynthesis.onvoiceschanged = loadVoices;
          loadVoices();

          utterance.lang = 'en-US';
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;

          utterance.onstart = () => {
            setIsSpeaking(true);
          };

          utterance.onend = () => {
            setIsSpeaking(false);
            utteranceRef.current = null;
            resolve();
          };

          utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            if (event.error !== 'interrupted') {
              setIsSpeaking(false);
              resolve();
            }
          };

          window.speechSynthesis.speak(utterance);
        }, 100);
      });
    },
    [isMuted]
  );

  const handleVoiceInput = async (transcript: string) => {
    const userMessage: Message = {
      text: transcript,
      isUserMessage: true,
      timestamp: new Date().toISOString().replace("Z", "000"),
      button_display: false,
      number_of_buttons: 0,
      button_text: [],
      ticket: false,
    };
    onNewMessage(userMessage);

    try {
      const result = await askBart({
        question: transcript,
        user_id: localStorage.getItem("user_id") || "",
        chat_id: localStorage.getItem("chat_id") || "",
      });
      localStorage.setItem("chat_id", result.chat_id);

      const botMessage: Message = {
        text: result.answer || "No response received",
        isUserMessage: false,
        timestamp: new Date().toISOString().replace("Z", "000"),
        button_display: result.display_settings?.button_display || false,
        number_of_buttons: result.display_settings?.options?.buttons?.length || 0,
        button_text: result.display_settings?.options?.buttons || [],
        ticket: result.display_settings?.ticket || false,
        ticket_options: result.display_settings?.options?.ticket_options || {},
      };

      onNewMessage(botMessage);
      // Automatically speak the bot's response
    } catch (error) {
      console.error("API Error:", error);
      const errorMessage = "Sorry, I encountered an error processing your request.";
      onNewMessage({
        text: errorMessage,
        isUserMessage: false,
        timestamp: new Date().toISOString().replace("Z", "000"),
        button_display: false,
        number_of_buttons: 0,
        button_text: [],
        ticket: false,
      });
    }
  };

  const startVoiceRecognition = async () => {
    try {
      if (isListening || isProcessing) {
        console.log('Already listening or processing');
        return;
      }

      setShowVoiceCard(true);

      if (!recognitionRef.current) {
        recognitionRef.current = initializeSpeechRecognition();
        if (!recognitionRef.current) return;
      }

      // Request microphone permission
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        recognitionRef.current.start();
      } catch (err) {
        console.error('Microphone error:', err);
        setIsListening(false);
        setShowVoiceCard(false);
        throw new Error('Microphone access denied or not available');
      }

    } catch (error) {
      setIsListening(false);
      setIsProcessing(false);
      setShowVoiceCard(false);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Voice recognition error:', errorMessage);
      
      const errorBotMessage: Message = {
        text: errorMessage,
        isUserMessage: false,
        timestamp: new Date().toISOString().replace("Z", "000"),
        button_display: false,
        number_of_buttons: 0,
        button_text: [],
        ticket: false,
      };
      onNewMessage(errorBotMessage);
    }
  };

  const stopVoiceRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
    setIsListening(false);
    setIsProcessing(false);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopVoiceRecognition();
      window.speechSynthesis.cancel();
    };
  }, [stopVoiceRecognition]);

  // Prevent infinite loop when tab is inactive
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isListening) {
        stopVoiceRecognition();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isListening, stopVoiceRecognition]);

  const handleVerificationComplete = useCallback(async () => {
    setShowAuthVideoCard(false);

    try {
      const userMessage: Message = {
        text: "Facial Recognition Verified",
        isUserMessage: true,
        timestamp: new Date().toISOString().replace("Z", "000"),
        button_display: false,
        number_of_buttons: 0,
        button_text: [],
        ticket: false,
      };
      onNewMessage(userMessage);

      const result = await askBart({
        question: "verified_success",
        user_id: localStorage.getItem("user_id") || "",
        chat_id: localStorage.getItem("chat_id") || "",
      });
      localStorage.setItem("chat_id", result.chat_id);

      const botMessage: Message = {
        text: result.answer || "No response received",
        isUserMessage: false,
        timestamp: new Date().toISOString().replace("Z", "000"),
        button_display: result.display_settings?.button_display || false,
        number_of_buttons: result.display_settings?.options?.buttons?.length || 0,
        button_text: result.display_settings?.options?.buttons || [],
        ticket: result.display_settings?.ticket || false,
        ticket_options: result.display_settings?.options?.ticket_options || {},
      };

      onNewMessage(botMessage);
      await speak(result.answer);
    } catch (error) {
      console.error("API Error:", error);
    }
  }, [onNewMessage, speak]);

  const handleButtonClick = async (button: string) => {
    setClickedButton(button);
    if (button.toLowerCase() === "facial recognition") {
      setShowAuthVideoCard(true);
    } else {
      const userMessage: Message = {
        text: button,
        isUserMessage: true,
        timestamp: new Date().toISOString().replace("Z", "000"),
        button_display: false,
        number_of_buttons: 0,
        button_text: [],
        ticket: false,
      };
      onNewMessage(userMessage);

      try {
        const result = await askBart({
          question: button,
          user_id: localStorage.getItem("user_id") || "",
          chat_id: localStorage.getItem("chat_id") || "",
        });
        localStorage.setItem("chat_id", result.chat_id);

        const botMessage: Message = {
          text: result.answer || "No response received",
          isUserMessage: false,
          timestamp: new Date().toISOString().replace("Z", "000"),
          button_display: result.display_settings?.button_display || false,
          number_of_buttons: result.display_settings?.options?.buttons?.length || 0,
          button_text: result.display_settings?.options?.buttons || [],
          ticket: result.display_settings?.ticket || false,
          ticket_options: result.display_settings?.options?.ticket_options || {},
        };

        onNewMessage(botMessage);
      
      } catch (error) {
        console.error("API Error:", error);
        const errorMessage = "Sorry, I encountered an error processing your request.";
        onNewMessage({
          text: errorMessage,
          isUserMessage: false,
          timestamp: new Date().toISOString().replace("Z", "000"),
          button_display: false,
          number_of_buttons: 0,
          button_text: [],
          ticket: false,
        });
      }
    }
  };

  const handleOtpSubmit = async (otpString: string) => {
    try {
      const userMessage: Message = {
        text: "Done",
        isUserMessage: true,
        timestamp: new Date().toISOString().replace("Z", "000"),
        button_display: false,
        number_of_buttons: 0,
        button_text: [],
        ticket: false,
      };
      onNewMessage(userMessage);

      const result = await verifyOTP({
        otp: parseInt(otpString),
        email: localStorage.getItem("email") || "",
        chat_id: localStorage.getItem("chat_id") || "",
      });

      const botMessage: Message = {
        text: result.answer || "No response received",
        isUserMessage: false,
        timestamp: new Date().toISOString().replace("Z", "000"),
        button_display: result.display_settings?.button_display || false,
        number_of_buttons: result.display_settings?.options?.buttons?.length || 0,
        button_text: result.display_settings?.options?.buttons || [],
        ticket: result.display_settings?.ticket || false,
        ticket_options: result.display_settings?.options?.ticket_options || {},
      };

      onNewMessage(botMessage);
    } catch (error) {
      const errorMessage: Message = {
        text: error instanceof Error ? error.message : "OTP verification failed",
        isUserMessage: false,
        timestamp: new Date().toISOString().replace("Z", "000"),
        button_display: false,
        number_of_buttons: 0,
        button_text: [],
        ticket: false,
      };
      onNewMessage(errorMessage);
    }
  };

  // Modify the useEffect for new messages
  useEffect(() => {
    if (!message.isUserMessage && message.text && !isMuted) {
      // Reset state
      setShowFullText(false);
      
      // Cancel any ongoing speech
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
        utteranceRef.current = null;
      }

      // Calculate typing duration
      const typingDuration = message.text.length * 50; // 50ms per character

       // Start speech after a slight delay to ensure any previous speech is properly cancelled
       const speechTimeout = setTimeout(() => {
        speak(message.text);
      }, 100);

      // Show full text after typing effect completes
      const typingTimeout = setTimeout(() => {
        setShowFullText(true);
      }, typingDuration);

      return () => {
        clearTimeout(speechTimeout);
        clearTimeout(typingTimeout);
        if (utteranceRef.current) {
          window.speechSynthesis.cancel();
          utteranceRef.current = null;
        }
      };
    }
  }, [message, speak, isMuted]);

  // Add cleanup for speech synthesis when component unmounts or page refreshes
  useEffect(() => {
    const cleanup = () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
        utteranceRef.current = null;
      }
    };

    // Handle page refresh/unload
    window.addEventListener('beforeunload', cleanup);
    
    return () => {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    startVoiceRecognition,
    stopVoiceRecognition
  }));

  return (
    <div className="flex items-start mb-8 w-full text-left">
      {message.isUserMessage ? (
        <UserCard
          name={localStorage.getItem("name") || "User"}
          text={message.text}
        />
      ) : (
        <div className="flex items-start w-full">
          <img
            src={ChatLogo}
            alt="BART Buddy"
            className="w-8 h-8 rounded-full object-cover mx-2"
          />
          <div className="flex-1">
            <div className="flex items-center justify-start">
              <span className="text-sm font-semibold mr-2 text-black">
                BART Buddy
              </span>
              <span className="w-1 h-1 bg-white rounded-full mx-1"></span>
              <span className="text-xs text-gray-400">
                {new Date(message.timestamp.replace("000", "Z")).toLocaleString()}
              </span>
            </div>
            <div className="flex mt-2">
              {(message.button_display ||
                message.text.includes("verification code")) && (
                <div
                  className="w-1 h-auto mr-2"
                  style={{
                    background: "#523EC6",
                    borderRadius: "4px",
                  }}
                ></div>
              )}
              <div className="flex-1">
                <div className="text-sm text-black mb-2 [&_a]:text-blue-400 [&_a]:underline [&_a:hover]:text-blue-300">
                  {showFullText ? (
                    <div dangerouslySetInnerHTML={createMarkup(message.text)} />
                  ) : (
                    <TypingEffect text={message.text} speed={50} />
                  )}
                </div>
                {message.text.includes("verification code") && (
                  <OtpInputCard
                    onSubmitOTP={(otpString) => handleOtpSubmit(otpString)}
                    otp={otp}
                    setOtp={setOtp}
                  />
                )}
                {message.button_display &&
                  !message.text.includes("verification code") && (
                    <ChatButtonCard
                      buttons={message.button_text}
                      onButtonClick={handleButtonClick}
                      clickedButton={clickedButton}
                    />
                  )}
                {message.ticket && message.ticket_options && (
                  <TicketCard
                    name={message.ticket_options.name}
                    description={message.ticket_options.description}
                    ticket_id={message.ticket_options.ticket_id}
                    assignee_name={message.ticket_options.assignee_name}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showAuthVideoCard && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative w-[500px] bg-[#2C2C2E] rounded-3xl p-4">
            <button
              onClick={() => setShowAuthVideoCard(false)}
              className="absolute top-1 right-4 text-xl text-white hover:text-gray-400"
              aria-label="Close modal"
            >
              x
            </button>
            <div className="bg-[#2C2C2E] rounded-lg p-6">
              <div className="flex flex-col items-center">
                <VerifyAuth
                  onVerificationComplete={handleVerificationComplete}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {showVoiceCard && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <VoiceChatCard text={voiceText} />
        </div>
      )}
    </div>
  );
});

export default ChatMessage;