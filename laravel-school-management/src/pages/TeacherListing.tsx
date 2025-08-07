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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
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

interface PaginatedResponse {
  current_page: number;
  data: Teacher[];
  total: number;
  per_page: number;
}

const TeacherListing = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [open, setOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const fetchTeachers = async (pageNumber: number) => {
    try {
      const res = await axiosInstance.get(
        `/admin/teachers/?page=${pageNumber}`
      );
      const data: PaginatedResponse = res.data;

      setTeachers(data.data);
      setPage(data.current_page);
      setTotalPages(Math.ceil(data.total / data.per_page));
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  useEffect(() => {
    fetchTeachers(page);
  }, [page]);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleEditClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormData({ ...teacher });
    setErrorMessages([]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTeacher(null);
    setFormData({});
    setErrorMessages([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      await axiosInstance.put(
        `/admin/teachers/${selectedTeacher?.id}/`,
        formData
      );
      handleClose();
      fetchTeachers(page);
      setSuccessMessage("Teacher updated successfully!");
      setErrorMessages([]);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      console.error("Failed to update teacher:", error);
      const serverErrors = error?.response?.data?.errors;
      if (serverErrors) {
        const errorList = Object.values(serverErrors).flat();
        setErrorMessages(errorList as string[]);
      } else {
        setErrorMessages(["Update failed. Please try again."]);
      }
    }
  };

  const handleDeleteClick = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
    setDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!teacherToDelete) return;
    try {
      await axiosInstance.delete(`/admin/teachers/${teacherToDelete.id}/`);
      setSuccessMessage("Teacher deleted successfully!");
      setDeleteDialog(false);
      setTeacherToDelete(null);
      fetchTeachers(page);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to delete teacher:", error);
      setDeleteDialog(false);
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
        {teachers.map((teacher: Teacher) => (
          <Grid item xs={12} sm={6} md={4} key={teacher.id}>
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6" color="primary">
                    {teacher.first_name} {teacher.last_name}
                  </Typography>
                  <Box>
                    <IconButton
                      onClick={() => handleEditClick(teacher)}
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(teacher)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  <strong>Email:</strong> {teacher.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Phone:</strong> {teacher.phone}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Employee ID:</strong> {teacher.employee_id}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Subject:</strong> {teacher.subject_specialization}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Joined:</strong> {teacher.date_of_joining}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Status:</strong> {teacher.status}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Teacher</DialogTitle>
        <DialogContent>
          {errorMessages.length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                {errorMessages.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </Alert>
          )}

          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <TextField
                label="First Name"
                name="first_name"
                value={formData.first_name || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
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
                label="Subject Specialization"
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
                type="date"
                InputLabelProps={{ shrink: true }}
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
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        maxWidth="xs"
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
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherListing;
