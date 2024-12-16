import React, { useState, useEffect, useRef } from "react";
import SideBar from "./SideBar";
import InputBar from "./InputBar";
import { SiteHeader } from "../Home/Navbar";
import { Lock } from "lucide-react";
import Timeline from "./Timeline";
import ResponseCard from "../../components/ui/ResponseCard";
import UserCard from "../../components/ui/UserCard";
import Card1 from "../../components/ui/Card1";
import Card2 from "../../components/ui/Card2";
import Card3 from "../../components/ui/Card3";
import TicketCard from "../../components/ui/ticketcard";

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
  ]);

  const globalStyles = `
    ::-webkit-scrollbar {
      display: none; /* Hides scrollbar in Chrome, Safari, and Edge (WebKit) */
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

  const [isTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    chatSection: {
      flex: isTimelineOpen ? 0.75 : 1,
      display: "flex",
      flexDirection: "column",
      transition: "flex 0.3s ease",
      height: "100%",
    },
    messages: {
      flex: 1,
      padding: "16px",
      overflowY: "auto",
      backgroundColor: "#ffffff",
      border: "1px solid #e9ecef",
      borderRadius: "8px",
      margin: "16px",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    },
    messageContainer: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "16px",
    },
    responseWrapper: {
      alignSelf: "flex-start",
      maxWidth: "70%",
      position: "relative" as const,
    },
    userWrapper: {
      alignSelf: "flex-end",
      maxWidth: "70%",
    },
    blueBarContainer: {
      position: "relative" as const,
      paddingLeft: "16px",
      marginLeft: "-16px",
    },
    blueBar: {
      position: "absolute" as const,
      left: "0",
      top: "0",
      bottom: "0",
      width: "4px",
      backgroundColor: "#007bff",
      borderRadius: "2px",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "5px 60px 5px 0px",
    },
    centerContent: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    lockIcon: {
      width: "20px",
      height: "20px",
      color: "#6c757d",
    },
    heading: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#495057",
    },
    timelineButton: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      backgroundColor: "#ff7043",
      color: "#ffffff",
      padding: "8px 16px",
      borderRadius: "20px",
      fontSize: "14px",
      fontWeight: "500",
      border: "none",
      cursor: "pointer",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
  };

  const hasCard = (content: string) => {
    return (
      content.includes("Username/Email") ||
      content.includes("Hello") ||
      content.includes("Verification successful!") ||
      content.includes("Hi")
    );
  };

  return (
    <div style={styles.container}>
      <SiteHeader />
      <div style={styles.chatContainer}>
        <SideBar />
        <div style={styles.chatSection}>
          <div style={styles.header}>
            <div style={{ width: "20px" }}></div>
            <div style={styles.centerContent}>
              <Lock style={styles.lockIcon} />
              <span style={styles.heading}>Password Reset</span>
            </div>
            <button
              style={styles.timelineButton}
              onClick={() => setTimelineOpen(!isTimelineOpen)}
            >
              <span>{isTimelineOpen ? "Close Timeline" : "Timeline"}</span>
              <span>&gt;&gt;</span>
            </button>
          </div>

          <div style={styles.messages}>
            <div style={styles.messageContainer}>
              {messages.map((message, index) => {
                if (message.type === "response") {
                  const showCard = hasCard(message.content);
                  const ResponseContent = (
                    <>
                      <ResponseCard
                        logo={message.logo}
                        botName={message.botName}
                        time={message.time}
                        content={message.content}
                      />
                      {message.content.includes("Username/Email") && <Card1 />}
                      {message.content.includes("Hello") && <Card2 />}
                      {message.content.includes("Verification successful!") && <Card3 />}
                      {message.content.includes("Hi") && (
                        <TicketCard
                          dateTime="Jul 19,06:30PM"
                          urgency="Urgent"
                          title="John Doe | Password Recovery"
                          ticketNo="#12345"
                          assigneeName="Alice Johnson"
                          assigneeImage="https://example.com/assignee-avatar.png"
                        />
                      )}
                    </>
                  );

                  return (
                    <div key={index} style={styles.responseWrapper}>
                      {showCard ? (
                        <div style={styles.blueBarContainer}>
                          <div style={styles.blueBar} />
                          {ResponseContent}
                        </div>
                      ) : (
                        ResponseContent
                      )}
                    </div>
                  );
                } else if (message.type === "user") {
                  return (
                    <div key={index} style={styles.userWrapper}>
                      <UserCard
                        logo={message.logo}
                        name={message.name}
                        time={message.time}
                        text={message.text}
                      />
                    </div>
                  );
                }
                return null;
              })}
            </div>
            {isTyping && (
              <div style={{ fontStyle: "italic", color: "#888", textAlign: "left" }}>
                BART Buddy is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <InputBar />
        </div>

        <Timeline isOpen={isTimelineOpen} onClose={() => setTimelineOpen(false)} />
      </div>
    </div>
  );
};

export default Chat;