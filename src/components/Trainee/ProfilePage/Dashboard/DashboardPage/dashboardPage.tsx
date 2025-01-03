// DashboardPage.tsx
import React from "react";
import DashboardHeader from "../DashboardHeader/dashboardHeader";
import NewCourses from "../NewCourses/newCourses";
import MyCourses from "../MyCourses/myCourses";
import CalenderManage from "../CalenderManage/calenderManage";
import Homework from "../HomeWorkProgress/homeWork";

const DashboardPage: React.FC = () => {
  return (
    <>
      {/* Header Section */}
      <DashboardHeader />

      {/* Grid Layout */}
      <div className="grid grid-cols-2 gap-5 p-4">
        <NewCourses />
        <CalenderManage />
        <MyCourses />
        <Homework />
      </div>
    </>
  );
};

export default DashboardPage;