import React from "react";
import { HashRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Nav from "./components/Navbar/Nav"; 
import Footer from "./components/Trainee/Footer/Footer";
import { Toaster } from "sonner";
import Dashboard from "./components/Dashboard";
import Login from "./components/Navbar/Login";
import CourseTable from "./components/Tables/courseTables";
import UserManagement from "./components/Tables/userManagement";
import AddUser from "./components/Tables/addUser";
import AllUsers from "./components/Tables/allUsers";
import CourseCategoryTable from "./components/Tables/courseCategory";
import ManageRoles from "./components/Tables/rolesTables";
import PermissionRoles from "./components/Tables/permissionTables";
import ProtectedRoute from "./components/protectedRoute";
import TraineeHome from "./components/Trainee/traineeHome";
import UserSettings from "./components/Trainee/ProfileSettings/profileSettings";
import CoursePage from "./components/Trainee/ProfilePage/CoursePage/coursePage";
import TrainerHelloWorld from "./components/Trainer/TrainerHelloWorld";
import BatchTable from "./components/Tables/batchTable";

interface AppRouterProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  userRole: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
}

const AppRouter: React.FC<AppRouterProps> = ({
  isAuthenticated,
  setIsAuthenticated,
  userRole,
  setUserName,
}) => {
  return (
    <Router>
        <Nav
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <Routes>
        {/* Admin Protected Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Home isAuthenticated={isAuthenticated} />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="courses" element={<CourseTable />} />
          <Route path="course-category" element={<CourseCategoryTable />} />
          <Route path="manage-roles-and-permissions" element={<ManageRoles />} />
          <Route path="manage-permissions" element={<PermissionRoles />} />
          <Route path="batch-management" element={<BatchTable />} />
          <Route path="allUsers" element={<AllUsers />}>
            <Route path=":roleName" element={<UserManagement />} />
            <Route path="add-user" element={<AddUser />} />
          </Route>
        </Route>

        {/* Trainee Protected Routes */}
        <Route
          path="/trainee/*"
          element={
            <ProtectedRoute allowedRoles={["trainee"]}>
              <TraineeHome isAuthenticated={isAuthenticated} />
            </ProtectedRoute>
          }
        >
          <Route path="courses" element={<CoursePage />} />
          <Route path="settings" element={<UserSettings />} />
        </Route>

        {/* Trainer Protected Routes */}
        <Route
          path="/trainer/*"
          element={
            <ProtectedRoute allowedRoles={["trainer"]}>
              <TrainerHelloWorld />
            </ProtectedRoute>
          }
        />

        {/* Role-based Redirection */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              userRole === "admin" ? (
                <Navigate to="/admin" replace />
              ) : userRole === "trainer" ? (
                <Navigate to="/trainer" replace />
              ) : userRole === "trainee" ? (
                <Navigate to="/trainee" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Login Route */}
        <Route
          path="/login"
          element={
            <Login
              setIsAuthenticated={setIsAuthenticated}
              setUserName={setUserName}
            />
          }
        />
      </Routes>
      <Toaster />
      <Footer />
    </Router>
  );
};

export default AppRouter;
