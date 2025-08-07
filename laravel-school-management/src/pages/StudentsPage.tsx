import { useEffect, useState } from "react";
import axiosInstance from "../api/axios.interceptor";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Pagination,
  Divider,
  IconButton,
  Tooltip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Collapse,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  roll_number: string;
  student_class: string;
  date_of_birth: string;
  admission_date: string;
  status: string;
  assigned_teacher_id: number;
}

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Partial<Student>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const fetchStudents = async (pageNumber: number) => {
    try {
      const res = await axiosInstance.get(`/admin/students?page=${pageNumber}`);
      const resData = res.data.data;

      const mappedStudents = resData.data.map(
        (s: any): Student => ({
          id: s.id,
          first_name: s.first_name,
          last_name: s.last_name,
          email: s.email,
          phone: s.phone,
          roll_number: s.roll_number,
          student_class: s.class,
          date_of_birth: s.date_of_birth,
          admission_date: s.admission_date,
          status: s.status,
          assigned_teacher_id: s.assigned_teacher_id,
        })
      );

      setStudents(mappedStudents);
      setLastPage(resData.last_page);
    } catch (err) {
      console.error("❌ Error fetching students:", err);
      alert("Failed to load students.");
    }
  };

  useEffect(() => {
    fetchStudents(page);
  }, [page]);

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({ ...student });
  };

  const handleClose = () => {
    setEditingStudent(null);
    setFormData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "assigned_teacher_id") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? null : parseInt(value, 10),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async () => {
    if (!editingStudent) return;

    try {
      await axiosInstance.put(`/admin/students/${editingStudent.id}`, formData);
      setSuccessMessage("Student updated successfully.");
      fetchStudents(page);
      handleClose();

      // Auto-dismiss after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to update student:", err);
      alert("Failed to update student.");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Student Directory
      </Typography>

      {/* Success Alert */}
      <Collapse in={!!successMessage}>
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      </Collapse>

      <Grid container spacing={3}>
        {students.map((student) => (
          <Grid item xs={12} sm={6} md={4} key={student.id}>
            <Card elevation={3}>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6" color="primary">
                    {student.first_name} {student.last_name}
                  </Typography>
                  <Tooltip title="Edit Student">
                    <IconButton
                      onClick={() => handleEdit(student)}
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  <strong>Email:</strong> {student.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Phone:</strong> {student.phone}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Roll No:</strong> {student.roll_number}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Class:</strong> {student.student_class}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>DOB:</strong> {student.date_of_birth}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Admission:</strong> {student.admission_date}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Status:</strong> {student.status}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Teacher ID:</strong>{" "}
                  {student.assigned_teacher_id ?? "Unassigned"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={lastPage}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Edit Student Dialog */}
      <Dialog
        open={!!editingStudent}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <TextField
                name="first_name"
                label="First Name"
                fullWidth
                value={formData.first_name || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="last_name"
                label="Last Name"
                fullWidth
                value={formData.last_name || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                value={formData.email || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="phone"
                label="Phone"
                fullWidth
                value={formData.phone || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="roll_number"
                label="Roll Number"
                fullWidth
                value={formData.roll_number || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="student_class"
                label="Class"
                fullWidth
                value={formData.student_class || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="date_of_birth"
                label="Date of Birth"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.date_of_birth || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="admission_date"
                label="Admission Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.admission_date || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="status"
                label="Status"
                fullWidth
                value={formData.status || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="assigned_teacher_id"
                label="Assigned Teacher ID"
                type="number"
                fullWidth
                value={
                  formData.assigned_teacher_id !== null &&
                  formData.assigned_teacher_id !== undefined
                    ? formData.assigned_teacher_id
                    : ""
                }
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentsPage;
