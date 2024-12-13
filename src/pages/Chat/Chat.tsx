import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import InputBar from "./InputBar";
import { SiteHeader } from "../Home/Navbar";
import Timeline from "./Timeline";
import ChatArea from "./ChatArea";

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
      content: "Sure, I can help with that! Please share your Username/Email ID.",
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
      time: "12:15 PM",
      content: "Hi, I can assist with your request!",
    },
    {
      type: "response",
      logo: "https://example.com/bot-logo.png",
      botName: "BART Buddy",
      time: "12:15 PM",
      content: "Hello, I can assist with your request!",
    },
  ]);

  const [isTyping] = useState(false);

  const globalStyles = `
    ::-webkit-scrollbar {
      display: none;
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
    },
    chatContainer: {
      display: "flex",
      flex: 1,
      background: "linear-gradient(to bottom, #fff, #f5f5f5, #ffe4e1)",
      overflow: "hidden",
    },
  };

  return (
    <div style={styles.container}>
      <SiteHeader />
      <div style={styles.chatContainer}>
        <SideBar />
        <ChatArea
          messages={messages}
          isTyping={isTyping}
          isTimelineOpen={isTimelineOpen}
          setTimelineOpen={setTimelineOpen}
        />
        <Timeline isOpen={isTimelineOpen} onClose={() => setTimelineOpen(false)} />
      </div>
    </div>
  );
};

export default Chat;

