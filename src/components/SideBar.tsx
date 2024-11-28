import React from "react";
import { UserCheck, Users, DollarSign, Grid, Shield, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <>
      <div className="flex h-screen bg-gray-700 text-gray-200">
      {/* Sidebar */}
      <div className="flex flex-col w-64 bg-gray-800">
        {/* Header */}
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-4">
          <SidebarButton icon={<Grid />} label="Courses" to="/courses" />
          <SidebarButton icon={<Users />} label="Trainers" to="/trainers" />
          <SidebarButton icon={<UserCheck />} label="Trainees" to="/trainees" />
          <SidebarButton icon={<DollarSign />} label="Finance" to="/finance" />
          <SidebarButton icon={<Shield />} label="Admin" to="/admin" />
          <SidebarButton icon={<PlusCircle />} label="Add User" to="/add-user" /> 
        </nav>
      </div>
    </div>
    </>
    
  );
};

type SidebarButtonProps = {
  icon: React.ReactNode;
  label: string;
  to: string;
};

const SidebarButton: React.FC<SidebarButtonProps> = ({ icon, label, to }) => (
  <Link
    to={to}
    className="flex items-center w-full p-2 text-sm font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2"
  >
    <div className="mr-3 text-blue-400">{icon}</div>
    <span>{label}</span>
  </Link>
);

export default Sidebar;
