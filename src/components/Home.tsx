import React from "react";
import { Outlet, Navigate } from "react-router-dom"; // For nested routes and redirection
import SideBar from "./SideBar";

interface HomeProps {
  isAuthenticated: boolean;
}

const Home: React.FC<HomeProps> = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen">
      <SideBar /> {/* Sidebar remains persistent */}
      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        <Outlet /> {/* Active route will be rendered here */}
      </div>
    </div>
  );
};

export default Home;
