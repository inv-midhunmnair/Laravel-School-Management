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
import DeleteIcon from "@mui/icons-material/Delete";

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
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

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
          class: s.class,
          date_of_birth: s.date_of_birth,
          admission_date: s.admission_date,
          status: s.status,
          assigned_teacher_id: s.assigned_teacher_id,
        })
      );
      setStudents(mappedStudents);
      setLastPage(resData.last_page);
    } catch (err) {
      console.error("Error fetching students:", err);
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
    setErrorMessages([]);
  };

  const handleClose = () => {
    setEditingStudent(null);
    setFormData({});
    setErrorMessages([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "assigned_teacher_id"
          ? value === ""
            ? null
            : parseInt(value, 10)
          : value,
    }));
  };

  const handleUpdate = async () => {
    if (!editingStudent) return;
    try {
      await axiosInstance.put(`/admin/students/${editingStudent.id}`, formData);
      setSuccessMessage("Student updated successfully.");
      fetchStudents(page);
      handleClose();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Failed to update student:", err);
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        const errorList = Object.values(serverErrors).flat();
        setErrorMessages(errorList as string[]);
      } else {
        alert("Failed to update student.");
      }
    }
  };

  const confirmDelete = (student: Student) => {
    setStudentToDelete(student);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;
    try {
      await axiosInstance.delete(`/admin/students/${studentToDelete.id}`);
      setSuccessMessage("Student deleted successfully.");
      fetchStudents(page);
    } catch (err) {
      console.error("Failed to delete student:", err);
      alert("Failed to delete student.");
    } finally {
      setDeleteConfirmOpen(false);
      setStudentToDelete(null);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Student Directory
      </Typography>

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
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6" color="primary">
                    {student.first_name} {student.last_name}
                  </Typography>
                  <Stack direction="row">
                    <Tooltip title="Edit Student">
                      <IconButton
                        onClick={() => handleEdit(student)}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Student">
                      <IconButton
                        onClick={() => confirmDelete(student)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2">
                  <strong>Email:</strong> {student.email}
                </Typography>
                <Typography variant="body2">
                  <strong>Phone:</strong> {student.phone}
                </Typography>
                <Typography variant="body2">
                  <strong>Roll No:</strong> {student.roll_number}
                </Typography>
                <Typography variant="body2">
                  <strong>Class:</strong> {student.class}
                </Typography>
                <Typography variant="body2">
                  <strong>DOB:</strong> {student.date_of_birth}
                </Typography>
                <Typography variant="body2">
                  <strong>Admission:</strong> {student.admission_date}
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong> {student.status}
                </Typography>
                <Typography variant="body2">
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

      {/* Edit Dialog */}
      <Dialog
        open={!!editingStudent}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent>
          {errorMessages.length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {errorMessages.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </Alert>
          )}

          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                name="first_name"
                value={formData.first_name || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                name="last_name"
                value={formData.last_name || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Roll Number"
                name="roll_number"
                value={formData.roll_number || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Class"
                name="class"
                value={formData.class || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date of Birth"
                name="date_of_birth"
                value={formData.date_of_birth || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Admission Date"
                name="admission_date"
                value={formData.admission_date || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Status"
                name="status"
                value={formData.status || ""}
                onChange={handleChange}
                fullWidth
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete{" "}
          <strong>
            {studentToDelete?.first_name} {studentToDelete?.last_name}
          </strong>
          ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete} variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentsPage;
