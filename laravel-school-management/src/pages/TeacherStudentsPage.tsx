import { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Pagination,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import axiosInstance from "../api/axios.interceptor";
import { API_ENDPOINTS } from "../api/api.constants";

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  admission_date: string;
  roll_number: string;
  class: string;
}

interface PaginatedResponse {
  data: Student[];
  current_page: number;
  total: number;
  per_page: number;
}

const TeacherStudentsPage = () => {
  const { token } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.TEACHER_STUDENTS}?page=${currentPage}`
        );

        const data: PaginatedResponse = response.data.data;

        setStudents(data.data); // student list
        setCurrentPage(data.current_page); // current page
        setTotalPages(Math.ceil(data.total / data.per_page)); // total pages
      } catch (error) {
        console.error("Failed to fetch assigned students", error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [currentPage, token]);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page); // triggers useEffect
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Assigned Students
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : students.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center">
          No students assigned yet.
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {students.map((student) => (
              <Grid item xs={12} sm={6} md={4} key={student.id}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      {student.first_name} {student.last_name}
                    </Typography>
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
                      <strong>Class:</strong> {student.class}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Date of Birth:</strong> {student.date_of_birth}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Admission Date:</strong> {student.admission_date}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box mt={4} display="flex" justifyContent="center">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default TeacherStudentsPage;
