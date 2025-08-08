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

interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  employee_id: string;
  subject_specialization: string;
  date_of_joining: string;
  status: string;
}

const Teacher = () => {
  const [teachers, setteachers] = useState<Teacher[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState<Partial<Teacher>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

  const fetchTeachers = async (pageNumber: number) => {
    try {
      const res = await axiosInstance.get(`/admin/teachers?page=${pageNumber}`);
      const resData = res.data.data;
      const mappedTeachers = resData.map(
        (t: any): Teacher => ({
          id: t.id,
          first_name: t.first_name,
          last_name: t.last_name,
          email: t.email,
          phone: t.phone,
          employee_id: t.employee_id,
          subject_specialization: t.subject_specialization,
          date_of_joining: t.date_of_joining,
          status: t.status,
        })
      );
      setteachers(mappedTeachers);
      setLastPage(res.data.last_page);
    } catch (err) {
      console.error("Error fetching teachers:", err);
      alert("Failed to load teachers.");
    }
  };

  useEffect(() => {
    fetchTeachers(page);
  }, [page]);

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({ ...teacher });
    setErrorMessages([]);
  };

  const handleClose = () => {
    setEditingTeacher(null);
    setFormData({});
    setErrorMessages([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!editingTeacher) return;
    try {
      await axiosInstance.put(`/admin/teachers/${editingTeacher.id}`, formData);
      setSuccessMessage("Teacher updated successfully.");
      fetchTeachers(page);
      handleClose();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Failed to update teacher:", err);
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        const errorList = Object.values(serverErrors).flat();
        setErrorMessages(errorList as string[]);
      } else {
        alert("Failed to update teacher.");
      }
    }
  };

  const confirmDelete = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!teacherToDelete) return;
    try {
      await axiosInstance.delete(`/admin/teachers/${teacherToDelete.id}`);
      setSuccessMessage("Teacher deleted successfully.");
      fetchTeachers(page);
    } catch (err) {
      console.error("Failed to delete student:", err);
      alert("Failed to delete student.");
    } finally {
      setDeleteConfirmOpen(false);
      setTeacherToDelete(null);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Teacher Directory
      </Typography>

      <Collapse in={!!successMessage}>
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      </Collapse>

      <Grid container spacing={3}>
        {teachers.map((teacher) => (
          <Grid item xs={12} sm={6} md={4} key={teacher.id}>
            <Card elevation={3}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6" color="primary">
                    {teacher.first_name} {teacher.last_name}
                  </Typography>
                  <Stack direction="row">
                    <Tooltip title="Edit Teacher">
                      <IconButton
                        onClick={() => handleEdit(teacher)}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Teacher">
                      <IconButton
                        onClick={() => confirmDelete(teacher)}
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
                  <strong>Email:</strong> {teacher.email}
                </Typography>
                <Typography variant="body2">
                  <strong>Phone:</strong> {teacher.phone}
                </Typography>
                <Typography variant="body2">
                  <strong>Employee ID</strong> {teacher.employee_id}
                </Typography>
                <Typography variant="body2">
                  <strong>Date of Joining</strong> {teacher.date_of_joining}
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong> {teacher.status}
                </Typography>
                <Typography variant="body2">
                  <strong>Subject</strong> {teacher.subject_specialization}
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
        open={!!editingTeacher}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Teacher</DialogTitle>
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
                label="Employee ID"
                name="employee_id"
                value={formData.employee_id || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Subject"
                name="subject_specialization"
                value={formData.subject_specialization || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date of Joining"
                name="date_of_joining"
                value={formData.date_of_joining || ""}
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
            {teacherToDelete?.first_name} {teacherToDelete?.last_name}
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

export default Teacher;
