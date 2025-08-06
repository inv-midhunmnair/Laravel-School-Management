import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import AuthLayout from "../layout/AuthLayout";
import AppLayout from "../layout/AppLayout";
import ProtectedRoute from "../auth/ProtectedRoute";
import DashboardPage from "../pages/Dashboard";
import RegisterTeacherPage from "../pages/RegisterTeacherPage";
import TeacherListing from "../pages/TeacherListing";

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

    <Route
      path="/register-teacher"
      element={
        <ProtectedRoute
          element={
            <AppLayout>
              <RegisterTeacherPage />
            </AppLayout>
          }
        />
      }
    />

    <Route
      path="/teachers"
      element={
        <ProtectedRoute
          element={
            <AppLayout>
              <TeacherListing />
            </AppLayout>
          }
        />
      }
    />
  </Routes>
);

export default Approutes;
