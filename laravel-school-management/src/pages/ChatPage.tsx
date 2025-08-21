import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../api/axios.interceptor";
import { getEcho } from "../echo";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
} from "@mui/material";

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  created_at: string;
  formatted_time: string;
}

interface User {
  id: number;
  name: string;
  email?: string;
  role?: string;
}

const ChatPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await axiosInstance.get<User>("/me");
      setCurrentUser(res.data);
    } catch (err) {
      console.error("Failed to fetch current user:", err);
    }
  };

  const fetchUsers = async () => {
    if (!currentUser) return;
    try {
      const res = await axiosInstance.get("/chat/users");
      const data = res.data;

      if (data.role === "teacher") {
        const students: User[] = data.students.map((s: any) => ({
          id: s.id,
          name: s.name,
          email: s.email,
          role: "student",
        }));
        setUsers(students);
      }

      if (data.role === "student") {
        const teacher: User = {
          id: data.teacher.id,
          name: data.teacher.name,
          email: data.teacher.email,
          role: "teacher",
        };
        setUsers([teacher]);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchMessages = async (receiverId: number) => {
    if (!currentUser) return;
    try {
      const res = await axiosInstance.get<Message[]>(`/messages/${receiverId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !currentUser) return;
    try {
      const res = await axiosInstance.post<Message>("/messages", {
        receiver_id: selectedUser.id,
        message: newMessage,
      });

      setMessages((prev) =>
        prev.some((msg) => msg.id === res.data.id) ? prev : [...prev, res.data]
      );

      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    fetchUsers();

    const echo = getEcho();
    const channelName = `chat.${currentUser.id}`;

    const channel = echo.private(channelName);

    channel.listen(".message.sent", (msg: Message) => {
      if (
        selectedUser &&
        (msg.sender_id === selectedUser.id ||
          msg.receiver_id === selectedUser.id)
      ) {
        setMessages((prev) =>
          prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
        );
      }
    });

    return () => {
      echo.leave(channelName);
    };
  }, [currentUser, selectedUser]);

  useEffect(() => {
    if (selectedUser && currentUser) {
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedUser]);

  return (
    <Box
      display="flex"
      height="90vh"
      border={1}
      borderColor="grey.300"
      borderRadius={2}
      overflow="hidden"
    >
      {/* Sidebar with Users */}
      <Paper
        sx={{ width: 240, bgcolor: "grey.100", overflowY: "auto" }}
        elevation={0}
      >
        <Typography variant="h6" sx={{ p: 2 }}>
          {currentUser?.role === "teacher" ? "Students" : "Teacher"}
        </Typography>
        <Divider />
        <List>
          {users.map((user) => (
            <ListItem key={user.id} disablePadding>
              <ListItemButton
                selected={selectedUser?.id === user.id}
                onClick={() => setSelectedUser(user)}
              >
                <ListItemText
                  primary={`${user.name} (${user.role})`}
                  secondary={user.email}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Chat Window */}

      <Box flex={1} display="flex" flexDirection="column" bgcolor="white">
        {selectedUser ? (
          <>
            <Paper
              elevation={0}
              sx={{ p: 2, borderBottom: 1, borderColor: "grey.300" }}
            >
              <Typography variant="subtitle1">
                Chat with <strong>{selectedUser.name}</strong>
              </Typography>
            </Paper>

            <Box
              flex={1}
              p={2}
              display="flex"
              flexDirection="column"
              gap={1}
              overflow="auto"
            >
              {messages.map((msg) => {
                const isCurrentUser = msg.sender_id === currentUser?.id;
                return (
                  <Box
                    key={msg.id}
                    sx={{
                      alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                      bgcolor: isCurrentUser ? "success.light" : "grey.200",
                      p: 1.5,
                      borderRadius: 2,
                      maxWidth: "70%",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1">{msg.message}</Typography>

                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ display: "block", textAlign: "right", mt: 0.5 }}
                    >
                      {msg.formatted_time}
                    </Typography>
                  </Box>
                );
              })}

              <div ref={messagesEndRef} />
            </Box>

            <Box display="flex" p={2} borderTop={1} borderColor="grey.300">
              <TextField
                variant="outlined"
                placeholder="Type a message..."
                fullWidth
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button
                variant="contained"
                onClick={sendMessage}
                disabled={!newMessage.trim()}
              >
                Send
              </Button>
            </Box>
          </>
        ) : (
          <Box
            flex={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="grey.500"
          >
            Select a user to start chatting
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatPage;
