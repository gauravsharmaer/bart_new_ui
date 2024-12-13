import React, { useRef, useEffect } from 'react';
import { Lock } from "lucide-react";
import ResponseCard from "../../components/ui/ResponseCard";
import UserCard from "../../components/ui/UserCard";
import Card1 from "../../components/ui/Card1";
import Card2 from "../../components/ui/Card2";
import Card3 from "../../components/ui/Card3";
import TicketCard from "../../components/ui/ticketcard";
import InputBar from "./InputBar";


interface Message {
  type: string;
  logo: string;
  botName?: string;
  name?: string;
  time: string;
  content?: string;
  text?: string;
}

interface ChatAreaProps {
  messages: Message[];
  isTyping: boolean;
  isTimelineOpen: boolean;
  setTimelineOpen: (isOpen: boolean) => void;
  onNewMessage: (message: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isTyping,
  isTimelineOpen,
  setTimelineOpen,
  onNewMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const styles = {
    chatSection: {
      flex: isTimelineOpen ? 0.75 : 1,
      display: "flex",
      flexDirection: "column",
      transition: "flex 0.3s ease",
      height: "100%",
      '@media (max-width: 768px)': {
        flex: '1',
        width: '100%',
      },
      '@media (max-width: 576px)': {
        height: 'calc(100vh - 120px)', // Adjust for header and input
      }
    },
    messages: {
      flex: 1,
      padding: "16px",
      overflowY: "auto" as const,
      background: "linear-gradient(to bottom, #fff, #f5f5f5, #ffe4e1)",
      borderRadius: "8px",
      margin: "7px",
      scrollbarWidth: "none" as const,
      msOverflowStyle: "none" as const,
      '@media (max-width: 576px)': {
        padding: '2px',
        margin: '4px',
      }
    },
    messageContainer: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "7px",
      '@media (max-width: 576px)': {
        gap: '5px',
      }
    },
    responseContent: {
      display: "flex",
      flexDirection: "column" as const,
    },
    cardContainer: {
      marginTop: "1px",
    },
    responseWrapper: {
      alignSelf: "flex-start",
      maxWidth: "70%",
      width: "100%",
      '@media (max-width: 576px)': {
        maxWidth: '85%',
      }
    },
    userWrapper: {
      alignSelf: "flex-end",
      maxWidth: "70%",
      '@media (max-width: 576px)': {
        maxWidth: '85%',
      }
    },
    blueBarWrapper: {
      width: "4px",
      marginRight: "12px",
    },
    blueBar: {
      width: "4px",
      backgroundColor: "#8A2BE2",
      borderRadius: "2px",
      height: "100%",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "5px 60px 5px 0px",
      position: "relative",
      height: "40px",
      '@media (max-width: 576px)': {
        padding: '5px 20px 5px 0px',
        height: '36px',
      }
    },
      centerContent: {
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)", // Center the content horizontally
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
      display: isTimelineOpen ? "none" : "flex",
      alignItems: "center",
      gap: "0px",
      backgroundColor: "#f97316",
      color: "#ffffff",
      padding: "2px 16px",
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

  const renderResponse = (message: Message, index: number) => {
    const showCard = message.content && hasCard(message.content);
    
    return (
      <div key={index} style={styles.responseWrapper}>
        <ResponseCard
          logo={message.logo}
          botName={message.botName!}
          time={message.time}
          content={message.content!}
          showBlueBar={showCard}
        >
          {showCard && (
            <div style={styles.cardContainer}>
              {message.content?.includes("Username/Email") && <Card1 />}
              {message.content?.includes("Hello") && <Card2 />}
              {message.content?.includes("Verification successful!") && <Card3 />}
              {message.content?.includes("Hi") && (
                <TicketCard
                  dateTime="Jul 19,06:30PM"
                  urgency="Urgent"
                  title="John Doe | Password Recovery"
                  ticketNo="#12345"
                  assigneeName="Alice Johnson"
                  assigneeImage="https://example.com/assignee-avatar.png"
                />
              )}
            </div>
          )}
        </ResponseCard>
      </div>
    );
  };


  const handleSendMessage = (text: string) => {
    const newMessage = {
      type: "user",
      logo: "https://example.com/user-avatar.png",
      name: "John Doe",
      time: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      text: text
    };

    setMessages([...messages, newMessage]);
  };

  return (
    <div style={styles.chatSection}>
      <div style={styles.header}>
        <div style={{ width: "20px" }}></div>
        <div style={styles.centerContent}>
          <Lock style={styles.lockIcon} />
          <span style={styles.heading}>Password Reset</span>
        </div>
        <button
          style={styles.timelineButton}
          onClick={() => setTimelineOpen(true)}
        >
          <span>Timeline</span>
          <span>&gt;&gt;</span>
        </button>
      </div>

      <div style={styles.messages}>
        <div style={styles.messageContainer}>
          {messages.map((message, index) => {
            if (message.type === "response") {
              return renderResponse(message, index);
            } else if (message.type === "user") {
              return (
                <div key={index} style={styles.userWrapper}>
                  <UserCard
                    logo={message.logo}
                    name={message.name!}
                    time={message.time}
                    text={message.text!}
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
      <InputBar onSendMessage={onNewMessage} />
    </div>
  );
};

export default ChatArea;
