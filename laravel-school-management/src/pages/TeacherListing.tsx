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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [open, setOpen] = useState(false);

  const fetchTeachers = async (pageNumber: number) => {
    try {
      const res = await axiosInstance.get(
        `/admin/teachers/?page=${pageNumber}`
      );
      setTeachers(res.data.data);
      setCount(Math.ceil(res.data.count / 3));
    } catch (err) {
      console.error("❌ Error fetching teachers:", err);
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

  const handleEditClick = (teacher: any) => {
    setSelectedTeacher(teacher);
    setFormData({ ...teacher });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTeacher(null);
    setFormData({});
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
        `/admin/teachers/${selectedTeacher.id}/`,
        formData
      );
      handleClose();
      fetchTeachers(page);
    } catch (error) {
      console.error("❌ Failed to update teacher:", error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Teacher Directory
      </Typography>

      <Grid container spacing={3}>
        {teachers.map((teacher: any) => (
          <Grid item xs={12} sm={6} md={4} key={teacher.id}>
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6" color="primary">
                    {teacher.first_name} {teacher.last_name}
                  </Typography>
                  <IconButton
                    onClick={() => handleEditClick(teacher)}
                    size="small"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
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

      {/* Pagination */}
      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={count}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Teacher</DialogTitle>
        <DialogContent>
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
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeachersPage;
