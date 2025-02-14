import { io, Socket } from "socket.io-client";
import { useEffect, useState, useCallback } from "react";

interface Message {
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
}

interface ChatState {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

const SOCKET_URL =  "http://localhost:4000";

const RealTimeChat = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [chatState, setChatState] = useState<ChatState>({
    isConnected: false,
    isLoading: true,
    error: null,
  });

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Handle socket events
  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      setSocketId(socket.id || "");
      console.log("Connected to socket:", socket.id);
      setChatState(prev => ({
        ...prev,
        isConnected: true,
        isLoading: false,
        error: null,
      }));
    });

    socket.on("connect_error", (error) => {
      setChatState(prev => ({
        ...prev,
        isConnected: false,
        isLoading: false,
        error: "Failed to connect to chat server",
      }));
      console.error("Socket connection error:", error);
    });

    socket.on("private-message", (message: Message) => {
      if (message.senderId !== socket.id) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    socket.on("disconnect", () => {
      setChatState(prev => ({
        ...prev,
        isConnected: false,
        error: "Disconnected from chat server",
      }));
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("private-message");
      socket.off("disconnect");
    };
  }, [socket]);

  const sendPrivateMessage = useCallback(() => {
    if (!messageInput.trim() || !receiverId || !socket) return;

    try {
      const messageData: Message = {
        content: messageInput,
        senderId: socketId,
        receiverId: receiverId,
        timestamp: new Date(),
      };

      socket.emit("private-message", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
      setChatState(prev => ({
        ...prev,
        error: "Failed to send message",
      }));
    }
  }, [messageInput, receiverId, socket, socketId]);

  if (chatState.isLoading) {
    return <div className="p-4">Connecting to chat server...</div>;
  }

  if (chatState.error) {
    return (
      <div className="p-4 text-red-500">
        Error: {chatState.error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <div className={`w-3 h-3 rounded-full mr-2 ${
          chatState.isConnected ? "bg-green-500" : "bg-red-500"
        }`} />
        <span className="text-sm text-gray-600">
          {chatState.isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter receiver's ID"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          className="border p-2 mr-2 w-full rounded"
        />
      </div>
      
      <div className="mb-4 h-80 overflow-y-auto border p-4 rounded">
        {messages.map((msg, index) => (
          <div
            key={`${msg.timestamp.toString()}-${index}`}
            className={`mb-2 ${
              msg.senderId === socketId ? "text-right" : "text-left"
            }`}
          >
            <div className={`inline-block p-2 rounded ${
              msg.senderId === socketId ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}>
              {msg.content}
              <div className="text-xs mt-1 opacity-75">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendPrivateMessage()}
          placeholder="Type your message..."
          className="flex-1 border p-2 mr-2 rounded"
          disabled={!chatState.isConnected}
        />
        <button
          onClick={sendPrivateMessage}
          className={`px-4 py-2 rounded ${
            chatState.isConnected 
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!chatState.isConnected}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default RealTimeChat;