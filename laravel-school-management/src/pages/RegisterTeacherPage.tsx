import { useState } from "react";
import { teacherOperations } from "../api/auth.api";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Alert,
  Paper,
} from "@mui/material";

const RegisterTeacherPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    employee_id: "",
    subject_specialization: "",
    date_of_joining: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const payload = {
      ...formData,
      role: "teacher",
      status: "active",
    };

    try {
      await teacherOperations(payload);
      setMessage("Teacher registered successfully!");
      setFormData({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        employee_id: "",
        subject_specialization: "",
        date_of_joining: "",
      });
    } catch (err: any) {
      const serverErrors = err?.response?.data?.errors;
      if (serverErrors) {
        const errorList = Object.values(serverErrors).flat();
        setError(errorList);
      } else {
        setError(["Registration failed. Please check the input."]);
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", mt: 5, px: 2 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" align="center" gutterBottom fontWeight={600}>
          Register Teacher
        </Typography>

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        {error.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {error.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
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
              ["phone", "Phone"],
              ["employee_id", "Employee ID"],
              ["subject_specialization", "Subject Specialization"],
              ["date_of_joining", "Date of Joining"],
            ].map(([name, label]) => (
              <Grid item xs={12} sm={4} key={name}>
                <TextField
                  size="small"
                  name={name}
                  label={label}
                  type={
                    name === "password"
                      ? "password"
                      : name === "date_of_joining"
                      ? "date"
                      : "text"
                  }
                  value={(formData as any)[name]}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputLabelProps={
                    name === "date_of_joining" ? { shrink: true } : {}
                  }
                />
              </Grid>
            ))}
          </Grid>

          
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

export default RegisterTeacherPage;
