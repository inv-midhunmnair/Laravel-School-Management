import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const getWelcomeMessage = () => {
    console.log("Test");
    if (role === "admin") return "Welcome, Admin";
    if (role === "teacher") return "Welcome, Teacher";
    if (role === "student") return "Welcome, Student";
  };

  return (
    <Stack spacing={4} alignItems="center" mt={5}>
      <Typography variant="h4" fontWeight={600}>
        {getWelcomeMessage()}
      </Typography>

      {role === "admin" && (
        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          justifyContent="center"
          useFlexGap
        >
          <Button
            variant="contained"
            color="info"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate("/register-teacher")}
            sx={{
              minWidth: 180,
              borderRadius: 2,
              boxShadow: 2,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Register Teacher
          </Button>

          <Button
            variant="contained"
            color="info"
            startIcon={<GroupAddIcon />}
            onClick={() => navigate("/register-student")}
            sx={{
              minWidth: 180,
              borderRadius: 2,
              boxShadow: 2,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Register Student
          </Button>

          <Button
            variant="contained"
            color="info"
            startIcon={<VisibilityIcon />}
            onClick={() => navigate("/students")}
            sx={{
              minWidth: 180,
              borderRadius: 2,
              boxShadow: 2,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            View Students
          </Button>

          <Button
            variant="contained"
            color="info"
            startIcon={<VisibilityIcon />}
            onClick={() => navigate("/teachers")}
            sx={{
              minWidth: 180,
              borderRadius: 2,
              boxShadow: 2,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            View Teachers
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default DashboardPage;
