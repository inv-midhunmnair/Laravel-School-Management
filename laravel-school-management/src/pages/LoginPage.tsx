import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { loginUser } from "../api/auth.api";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser(username, password);
      login(data.access_token, data.role);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
        School Management Login
      </Typography>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        align="center"
        mb={2}
      >
        Please enter your credentials to continue
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
            variant="outlined"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            variant="outlined"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: 1.5,
              fontWeight: "bold",
              fontSize: "1rem",
              textTransform: "none",
            }}
          >
            Login
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default LoginPage;
