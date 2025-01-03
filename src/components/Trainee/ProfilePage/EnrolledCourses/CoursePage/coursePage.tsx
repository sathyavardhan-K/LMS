import React from "react";
import CourseHeader from "../CourseHeader/courseHeader";
import Mainbar from "../MainBar/mainBar";
import CourseContent from "../CourseContent/courseContent";

const CoursePage: React.FC = () => {
  return (
    <>
      {/* Header Section */}
      <CourseHeader />
      
      {/* Content Section */}
      <div className="flex flex-row w-[780px] h-[calc(100vh-7rem)] gap-4">
        {/* Mainbar takes 3/4 of the space */}
        <div className="flex-3 bg-white p-4">
          <Mainbar />
        </div>
        {/* CourseContent takes 1/4 of the space */}
        <div className="flex-1 bg-white p-4">
          <CourseContent />
        </div>
      </div>
    </>
  );
};

export default CoursePage;
