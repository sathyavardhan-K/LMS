import React from "react";
import { Outlet } from "react-router-dom";  // This is for rendering nested routes
import SideBar from "./SideBar";  // Your Sidebar component

const Home: React.FC = () => {
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
