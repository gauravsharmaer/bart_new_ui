import { io, Socket } from "socket.io-client";
import { useEffect, useState, useCallback } from "react";
import { saveMessage, getChatHistory, deleteChat, editMessage } from "./api";
import { realTimeMessage, User, ChatState } from "../../Interface/Interface";




const SOCKET_URL = "http://localhost:4000";

const RealTimeChat = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<realTimeMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState("");
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  const [chatState, setChatState] = useState<ChatState>({
    isConnected: false,
    isLoading: true,
    error: null,
    selectedUser: null,
  });

  const currentUserId = localStorage.getItem("user_id") || "";

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket']
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
      console.log("Connected to socket:", socket.id);
      
      // Auto-register user when socket connects
      const userData = {
        userId: localStorage.getItem("user_id") || "",
        username: localStorage.getItem("name") || "",
      };
      
      socket.emit("register-user", userData);
      
      setChatState((prev) => ({
        ...prev,
        isConnected: true,
        isLoading: false,
        error: null,
      }));
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setChatState((prev) => ({
        ...prev,
        isConnected: false,
        isLoading: false,
        error: "Failed to connect to chat server",
      }));
    });

    socket.on("private-message", (message: realTimeMessage) => {
      console.log("Received private message:", message);
      // Add message to state regardless of sender
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("users-updated", (users: User[]) => {
      console.log("Users updated:", users);
      const filteredUsers = users.filter((user) => user.userId !== currentUserId);
      setConnectedUsers(filteredUsers);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setChatState((prev) => ({
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
      socket.off("users-updated");
    };
  }, [socket, currentUserId]);

  // Load chat history when selecting a user
  useEffect(() => {
    if (!chatState.selectedUser) return;

    const loadChatHistory = async () => {
      try {
        const userId = localStorage.getItem("user_id") || "";
        const response = await getChatHistory(userId, chatState.selectedUser?.userId || "");
        
        // Check if response and response.data exist
        if (response && response.data && Array.isArray(response.data.messages)) {
          setMessages(response.data.messages);
          setCurrentChatId(response.data._id); // Store the chat ID
        } else {
          setMessages([]);
          setCurrentChatId(null);
        }
        
      } catch (error) {
        console.error("Error loading chat history:", error);
        setChatState(prev => ({
          ...prev,
          error: "Failed to load chat history"
        }));
        setMessages([]); // Reset messages on error
        setCurrentChatId(null);
      }
    };

    loadChatHistory();
  }, [chatState.selectedUser]);

  // Add socket event listener for edited messages
  useEffect(() => {
    if (!socket) return;

    socket.on("message-edited", (editData: { messageId: string, content: string, chatId: string }) => {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg._id === editData.messageId ? { ...msg, content: editData.content } : msg
        )
      );
    });

    return () => {
      socket.off("message-edited");
    };
  }, [socket]);

  const sendPrivateMessage = useCallback(async () => {
    if (!messageInput.trim() || !chatState.selectedUser || !socket) return;

    try {
      const userId = localStorage.getItem("user_id") || "";
      
      // Save message to database
      const response = await saveMessage(
        userId,
        chatState.selectedUser.userId,
        messageInput
      );

      // Extract the actual message from the response
      const savedMessage = response.data;

      // Emit socket event with all necessary information for private messaging
      const messageWithSocketInfo = {
        ...savedMessage,
        receiverId: chatState.selectedUser.userId,
        receiverSocketId: chatState.selectedUser.socketId,
        senderSocketId: socket.id
      };

      console.log("Sending private message:", messageWithSocketInfo);
      socket.emit("private-message", messageWithSocketInfo);

      // Update local messages immediately
      setMessages(prev => [...prev, savedMessage]);
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
      setChatState(prev => ({
        ...prev,
        error: "Failed to send message"
      }));
    }
  }, [messageInput, chatState.selectedUser, socket]);

  const handleDeleteChat = useCallback(async () => {
    if (!chatState.selectedUser) return;

    try {
      const userId = localStorage.getItem("user_id") || "";
      await deleteChat(userId, chatState.selectedUser.userId);
      
      // Clear messages and reset selected user
      setMessages([]);
      setChatState(prev => ({ ...prev, selectedUser: null }));
    } catch (error) {
      console.error("Error deleting chat:", error);
      setChatState(prev => ({
        ...prev,
        error: "Failed to delete chat"
      }));
    }
  }, [chatState.selectedUser]);

  const handleStartEdit = (message: realTimeMessage) => {
    console.log("Attempting to edit message:", message); // Debug log
    if (!message._id) {
      console.warn("Message has no _id:", message);
      return;
    }
    setEditingMessageId(message._id);
    setEditInput(message.content);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditInput("");
  };

  const handleSaveEdit = async (messageId: string) => {
    if (!editInput.trim() || !chatState.selectedUser || !currentChatId) return;

    try {
      await editMessage(
        currentChatId,
        messageId,
        editInput
      );

      // Update local state
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg._id === messageId ? { ...msg, content: editInput } : msg
        )
      );

      // Emit socket event for real-time update
      if (socket) {
        socket.emit("message-edited", {
          messageId,
          content: editInput,
          receiverId: chatState.selectedUser.userId,
          chatId: currentChatId
        });
      }

      // Reset editing state
      setEditingMessageId(null);
      setEditInput("");
    } catch (error) {
      console.error("Error editing message:", error);
      setChatState(prev => ({
        ...prev,
        error: "Failed to edit message"
      }));
    }
  };

  if (chatState.isLoading) {
    return <div className="p-4">Connecting to chat server...</div>;
  }

  if (chatState.error) {
    return <div className="p-4 text-red-500">Error: {chatState.error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex gap-4">
        <div className="w-1/4 border rounded p-4">
          <h2 className="font-bold mb-4">Online Users</h2>
          {connectedUsers && connectedUsers.map((user) => (
            <div
              key={user.socketId}
              onClick={() =>
                setChatState((prev) => ({ ...prev, selectedUser: user }))
              }
              className={`p-2 cursor-pointer rounded mb-2 ${
                chatState.selectedUser?.userId === user.userId
                  ? "bg-blue-100 border-2 border-blue-500"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                <span>{user.username}</span>
              </div>
            </div>
          ))}
          {(!connectedUsers || connectedUsers.length === 0) && (
            <div className="text-gray-500 text-sm">No users online</div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${
                  chatState.isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm text-gray-600">
                {chatState.isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            {chatState.selectedUser && (
              <button
                onClick={handleDeleteChat}
                className="px-3 py-1 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
              >
                Delete Chat
              </button>
            )}
          </div>

          <div className="mb-4 h-80 overflow-y-auto border p-4 rounded">
            {messages && messages.map((msg, index) => {
              const isCurrentUser = msg.sender === currentUserId;
              const senderUser = connectedUsers.find(user => user.userId === msg.sender);
              const senderName = isCurrentUser ? 'You' : (senderUser?.username || 'Unknown User');
              const isEditing = editingMessageId === msg._id;
              
              return (
                <div
                  key={index}
                  className={`mb-2 ${
                    isCurrentUser ? "text-right" : "text-left"
                  }`}
                >
                  <div className="mb-1 text-xs text-gray-500">
                    {!isCurrentUser && senderName}
                  </div>
                  
                  <div
                    className={`inline-block p-2 rounded-lg max-w-[70%] ${
                      isCurrentUser
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={editInput}
                          onChange={(e) => setEditInput(e.target.value)}
                          className="p-1 rounded text-black"
                          autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => msg._id && handleSaveEdit(msg._id)}
                            className="px-2 py-1 bg-green-500 text-white rounded text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-2 py-1 bg-gray-500 text-white rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="break-words">{msg.content}</div>
                        <div className="text-xs mt-1 opacity-75 flex items-center justify-end">
                          <span>{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}</span>
                          {isCurrentUser && msg._id && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent event bubbling
                                handleStartEdit(msg);
                              }}
                              className="ml-2 text-xs underline hover:no-underline cursor-pointer"
                              title={msg._id ? "Edit message" : "Cannot edit - no message ID"}
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendPrivateMessage()}
              placeholder={chatState.selectedUser ? `Message ${chatState.selectedUser.username}...` : "Select a user to start chatting..."}
              className="flex-1 border p-2 mr-2 rounded"
              disabled={!chatState.isConnected || !chatState.selectedUser}
            />
            <button
              onClick={sendPrivateMessage}
              className={`px-4 py-2 rounded ${
                chatState.isConnected && chatState.selectedUser
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!chatState.isConnected || !chatState.selectedUser}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeChat;
