import { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { studentOperations } from "../api/auth.api";
import axiosInstance from "../api/axios.interceptor";

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

  const [teachers, setTeachers] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const fetchAllTeachers = async () => {
    try {
      let allTeachers: any[] = [];
      let page = 1;
      let totalPages = 1;

      do {
        const response = await axiosInstance.get(
          `/admin/teachers?page=${page}`
        );
        const data = response.data;
        allTeachers = [...allTeachers, ...data.data];
        totalPages = data.last_page;
        page++;
      } while (page <= totalPages);

      setTeachers(allTeachers);
    } catch (error) {
      console.error("Failed to fetch teachers", error);
    }
  };

  useEffect(() => {
    fetchAllTeachers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as string]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setErrors([]);

    const payload = {
      ...formData,
      role: "student",
      status: "active",
    };

    try {
      await studentOperations(payload);
      setMessage("Student registered successfully!");
      setErrors([]);
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
    } catch (err: any) {
      const serverErrors = err?.response?.data?.errors;
      if (serverErrors) {
        const errorList = Object.values(serverErrors).flat();
        setErrors(errorList);
      } else {
        setErrors(["Registration failed. Please try again."]);
      }
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

        {errors.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {errors.map((err, index) => (
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
              ["phone", "Phone Number"],
              ["roll_number", "Roll Number"],
              ["class", "Class"],
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

            {/* Assigned Teacher Dropdown */}
            <Grid item xs={12} sm={4}>
              <FormControl size="small" fullWidth required variant="outlined">
                <InputLabel id="demo-simple-select-label">
                  Assigned Teacher
                </InputLabel>
                <Select
                  labelId="assigned-teacher-label"
                  name="assigned_teacher_id"
                  sx={{ minWidth: 180 }}
                  value={formData.assigned_teacher_id}
                  label="Assigned Teacher"
                  onChange={handleChange}
                >
                  {teachers.map((teacher) => (
                    <MenuItem key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
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

export default RegisterStudentPage;
