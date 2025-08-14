import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../api/axios.interceptor";
import echo from "../echo";

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  created_at: string;
}

interface User {
  id: number;
  name: string;
  role: string;
}

const ChatPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch current user info
  const fetchCurrentUser = async () => {
    try {
      const res = await axiosInstance.get<User>("/me");
      setCurrentUserId(res.data.id);
    } catch (err) {
      console.error("Failed to fetch current user:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get<User[]>("/chat/users");
      setUsers(res.data);

      if (res.data.length > 0 && !selectedUser) {
        setSelectedUser(res.data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchMessages = async (receiverId: number) => {
    try {
      const res = await axiosInstance.get<Message[]>(`/messages/${receiverId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    try {
      await axiosInstance.post("/messages/send", {
        receiver_id: selectedUser.id,
        message: newMessage,
      });
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  useEffect(() => {
    let channel: any;

    if (selectedUser) {
      fetchMessages(selectedUser.id);

      channel = echo.private(`chat.${selectedUser.id}`);
      channel.listen(".MessageSent", (e: { message: Message }) => {
        setMessages((prev) => [...prev, e.message]);
      });
    }

    return () => {
      if (channel) {
        channel.stopListening(".MessageSent");
      }
    };
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div style={styles.container}>
      <div style={styles.userList}>
        <h3>
          {users.length > 0 && users[0].role === "teacher"
            ? "Students"
            : "Teacher"}
        </h3>
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              ...styles.userItem,
              backgroundColor:
                selectedUser?.id === user.id ? "#1565c0" : "#fff",
              color: selectedUser?.id === user.id ? "#fff" : "#000",
            }}
            onClick={() => setSelectedUser(user)}
          >
            {user.name} ({user.role})
          </div>
        ))}
      </div>

      <div style={styles.chatWindow}>
        {selectedUser ? (
          <>
            <div style={styles.chatHeader}>
              Chat with <strong>{selectedUser.name}</strong>
            </div>

            <div style={styles.messages}>
              {messages.map((msg) => {
                const isCurrentUser = msg.sender_id === currentUserId;
                return (
                  <div
                    key={msg.id}
                    style={{
                      ...styles.message,
                      alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                      backgroundColor: isCurrentUser ? "#d1f5d3" : "#f0f0f0",
                    }}
                  >
                    {msg.message}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div style={styles.inputArea}>
              <input
                style={styles.input}
                type="text"
                value={newMessage}
                placeholder="Type a message..."
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button style={styles.sendButton} onClick={sendMessage}>
                Send
              </button>
            </div>
          </>
        ) : (
          <div style={styles.noChat}>Select a user to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    height: "90vh",
    border: "1px solid #ccc",
    borderRadius: "8px",
    overflow: "hidden",
  },
  userList: {
    width: "200px",
    borderRight: "1px solid #ccc",
    padding: "10px",
    overflowY: "auto",
    backgroundColor: "#f5f5f5",
  },
  userItem: {
    padding: "8px",
    borderRadius: "8px",
    marginBottom: "5px",
    cursor: "pointer",
  },
  chatWindow: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  chatHeader: {
    padding: "10px",
    borderBottom: "1px solid #ccc",
    fontWeight: "bold",
  },
  messages: {
    flex: 1,
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    overflowY: "auto",
  },
  message: {
    padding: "8px 12px",
    borderRadius: "16px",
    maxWidth: "70%",
  },
  inputArea: {
    display: "flex",
    borderTop: "1px solid #ccc",
    padding: "10px",
    background: "#fff",
  },
  input: {
    flex: 1,
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    marginRight: "8px",
  },
  sendButton: {
    padding: "8px 12px",
    background: "#4caf50",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  noChat: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#999",
    fontStyle: "italic",
  },
};
