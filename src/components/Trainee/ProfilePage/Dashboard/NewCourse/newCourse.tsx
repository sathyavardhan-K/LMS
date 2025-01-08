import React, { useState } from "react";
import RightArrows from "@/icons/right_arrow_2.png";
import LeftArrows from "@/icons/left_arrow_2.png";

const NewCourse: React.FC = () => {
  const courses = [
    { id: 1, title: "Course 1", description: "Learn the basics of programming." },
    { id: 2, title: "Course 2", description: "Master web development with React." },
    { id: 3, title: "Course 3", description: "Understand data structures and algorithms." },
    { id: 4, title: "Course 4", description: "Dive into backend development with Node.js." },
    { id: 5, title: "Course 5", description: "Explore machine learning concepts." },
    { id: 6, title: "Course 6", description: "Learn cloud computing with AWS." },
  ];

  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);

  // Handle next course navigation
  const handleNext = () => {
    if (currentCourseIndex < courses.length - 1) {
      setCurrentCourseIndex((prev) => prev + 1);
    }
  };

  // Handle previous course navigation
  const handlePrevious = () => {
    if (currentCourseIndex > 0) {
      setCurrentCourseIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="bg-[#8ce1bc] p-4 rounded shadow ml-40 max-w-5xl h-[500px] flex flex-col justify-between">
      <h2 className="text-lg font-bold mb-2">New Courses</h2>
      <p className="mb-4">
        Learn our course from scratch and become a pro in just two months. No prior experience required!
      </p>
      <div className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center">
        {/* Display the current course */}
        <div className="flex flex-col items-center h-[250px] justify-center">
          <h2 className="text-xl font-bold mb-2">{courses[currentCourseIndex].title}</h2>
          <p className="text-gray-700">{courses[currentCourseIndex].description}</p>
        </div>

        {/* Navigation buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentCourseIndex === 0}
            className={`p-2 rounded-full bg-[#4d78b8] hover:bg-[#3b5e8f] transition-all ${
              currentCourseIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <img src={LeftArrows} alt="Previous Icon" className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentCourseIndex === courses.length - 1}
            className={`p-2 rounded-full bg-[#4d78b8] hover:bg-[#3b5e8f] transition-all ${
              currentCourseIndex === courses.length - 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <img src={RightArrows} alt="Next Icon" className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewCourse;
