import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import { SiteHeader } from "../Home/Navbar";
import Timeline from "./Timeline";
import ChatArea from "./ChatArea";

interface Message {
  type: string;
  logo: string;
  botName?: string;
  name?: string;
  time: string;
  content?: string;
  text?: string;
}

const Chat: React.FC = () => {
  const [isTimelineOpen, setTimelineOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "response",
      logo: "https://example.com/bot-logo.png",
      botName: "BART Buddy",
      time: "12:10 PM",
      content: "Welcome to the Password Reset Service. How can I assist you today?",
    },
    {
      type: "user",
      logo: "https://example.com/user-avatar.png",
      name: "John Doe",
      time: "12:11 PM",
      text: "I need to reset my password.",
    },
    {
      type: "response",
      logo: "https://example.com/bot-logo.png",
      botName: "BART Buddy",
      time: "12:12 PM",
      content: "Hi, How are you",
    },
    {
      type: "user",
      logo: "https://example.com/user-avatar.png",
      name: "John Doe",
      time: "12:13 PM",
      text: "cameron.williamson@bart.com",
    },
    {
      type: "response",
      logo: "https://example.com/bot-logo.png",
      botName: "BART Buddy",
      time: "12:14 PM",
      content: "Verification successful! Please select one of the following applications to reset your password.",
    },
    {
      type: "response",
      logo: "https://example.com/bot-logo.png",
      botName: "BART Buddy",
      time: "12:12 PM",
      content: "Sure, I can help with that! Please share your Username/Email ID.",
    },
    {
      type: "response",
      logo: "https://example.com/bot-logo.png",
      botName: "BART Buddy",
      time: "12:12 PM",
      content: "Hello.",
    },
  ]);

  const handleNewMessage = (text: string) => {
    const newMessage: Message = {
      type: "user",
      logo: "https://example.com/user-avatar.png",
      name: "John Doe",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: text,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const [isTyping] = useState(false);

  const globalStyles = `
    ::-webkit-scrollbar {
      display: none;
    }
    body {
      margin: 0;
      font-family: Arial, sans-serif;
    }
  `;

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = globalStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column" as const,
      height: "100vh",
      backgroundColor: "#f8f9fa",
      '@media (max-width: 576px)': {
        height: 'calc(100vh - 56px)', // Account for mobile browser nav
      },
    },
    chatContainer: {
      display: "flex",
      flex: 1,
      background: "linear-gradient(to bottom, #fff, #f5f5f5, #ffe4e1)",
      overflow: "hidden",
      '@media (max-width: 768px)': {
        flexDirection: 'column',
      },
    },
    sidebar: {
      flex: "0 0 250px",
    },
    timeline: {
      flex: "0 0 300px",
    },
    mainContent: {
      flex: 1,
      display: "flex",
      flexDirection: "column" as const,
    },
  };

  return (
    <div style={styles.container}>
      <SiteHeader />
      <div style={styles.chatContainer}>
        <SideBar style={styles.sidebar} />
        <ChatArea
          messages={messages}
          isTyping={isTyping}
          isTimelineOpen={isTimelineOpen}
          setTimelineOpen={setTimelineOpen}
          onNewMessage={handleNewMessage}
        />
        {isTimelineOpen && <Timeline isOpen={isTimelineOpen} onClose={() => setTimelineOpen(false)} />}
      </div>
    </div>
  );
};

export default Chat;
