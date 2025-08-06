import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import AuthLayout from "../layout/AuthLayout";
import { Dashboard } from "@mui/icons-material";
import AppLayout from "../layout/AppLayout";
import ProtectedRoute from "../auth/ProtectedRoute";
import DashboardPage from "../pages/Dashboard";

const Approutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      }
    />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute
          element={
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          }
        />
      }
    />
  </Routes>
);

export default Approutes;
