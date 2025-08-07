import { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
} from "@mui/material";
import { studentOperations } from "../api/auth.api";

const RegisterStudentPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    roll_number: "",
    class: "",
    date_of_birth: "",
    admission_date: "",
    assigned_teacher_id: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const payload = {
      ...formData,
      role: "student",
      status: "active",
    };

    try {
      await studentOperations(payload);
      setMessage("Student registered successfully!");
      setFormData({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        roll_number: "",
        class: "",
        date_of_birth: "",
        admission_date: "",
        assigned_teacher_id: "",
      });
    } catch (err) {
      setError("Registration failed. Please check the input.");
    }
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", mt: 5, px: 2 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" align="center" gutterBottom fontWeight={600}>
          Register Student
        </Typography>

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {[
              ["username", "Username"],
              ["password", "Password"],
              ["first_name", "First Name"],
              ["last_name", "Last Name"],
              ["email", "Email"],
              ["phone", "Phone Number"],
              ["roll_number", "Roll Number"],
              ["class", "Class"],
              ["assigned_teacher_id", "Assigned Teacher ID"],
              ["date_of_birth", "Date of Birth"],
              ["admission_date", "Admission Date"],
            ].map(([name, label]) => (
              <Grid item xs={12} sm={4} key={name}>
                <TextField
                  size="small"
                  name={name}
                  label={label}
                  type={
                    name === "password"
                      ? "password"
                      : name.includes("date")
                      ? "date"
                      : "text"
                  }
                  value={(formData as any)[name]}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={
                    name.includes("date") ? { shrink: true } : {}
                  }
                  required
                />
              </Grid>
            ))}
          </Grid>

          {/* Button placed clearly below the grid */}
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              size="medium"
              sx={{
                px: 4,
                py: 1,
                fontWeight: 500,
                fontSize: "0.875rem",
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              Register
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterStudentPage;
