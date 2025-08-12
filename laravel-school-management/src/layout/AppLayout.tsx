import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import Sidebar from "../pages/Sidebar";

const drawerWidth = 2;

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f4f6f8" }}
    >
     
      <Sidebar />

      <Box sx={{ flexGrow: 1 }}>
  
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            minHeight: 70,
            zIndex: (theme) => theme.zIndex.drawer + 1,
            ml: `${drawerWidth}px`,
            width: `calc(100% - ${drawerWidth}px)`,
            backgroundColor: "#0A1929", // match sidebar color
            borderBottom: "1px solid #1c3c60",
          }}
        >
          <Toolbar
            sx={{
              justifyContent: "space-between",
              px: 4,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#90caf9" }}
            >
              School Management System
            </Typography>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#90caf9",
                color: "#90caf9",
                "&:hover": {
                  backgroundColor: "#1976d2",
                  borderColor: "#1976d2",
                  color: "#fff",
                },
              }}
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        
        <Box sx={{ mt: 11, px: 4, py: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
