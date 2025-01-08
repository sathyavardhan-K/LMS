import React from "react";
import Animation from "../../../../../images/animated_8.gif";
import RightArrow from "../../../../../icons/right_arrow_2.png";

const NewCourse: React.FC = () => {
  const courses = [
    {
      id: 1,
      title: "Course 1",
      image: Animation,
      description: "Learn the basics of programming.",
    },
    {
      id: 2,
      title: "Course 2",
      image: Animation,
      description: "Master web development with React.",
    },
    {
      id: 3,
      title: "Course 3",
      image: Animation,
      description: "Understand data structures and algorithms.",
    },
    {
      id: 4,
      title: "Course 4",
      image: Animation,
      description: "Dive into backend development with Node.js.",
    },
    {
      id: 5,
      title: "Course 5",
      image: Animation,
      description: "Explore machine learning concepts.",
    },
    {
      id: 6,
      title: "Course 6",
      image: Animation,
      description: "Learn cloud computing with AWS.",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-green-200 to-blue-200 p-6 rounded-lg shadow-lg ml-40 max-w-5xl h-[500px] flex flex-col -mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">New Courses</h2>
      <p className="mb-6 text-gray-600">
        Learn our course from scratch and become a pro in just two months. No prior experience required!
      </p>
      <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col overflow-y-auto h-[350px] space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-gray-50 p-4 rounded-lg shadow-md flex items-center gap-4 hover:bg-gray-100 transition duration-300"
          >
            {/* Course Image */}
            <div className="w-20 h-20 flex-shrink-0">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover rounded-md"
              />
            </div>

            {/* Course Details */}
            <div className="flex-grow w-20">
              <h2 className="text-lg font-bold text-gray-800 mb-1">{course.title}</h2>
              <p className="text-sm text-gray-600">{course.description}</p>
            </div>

            {/* Explore Button */}
            <div>
              <button className="bg-[#4d78b8] rounded-full p-3 shadow hover:bg-[#3b5e8f] transition-all">
                <img src={RightArrow} alt="Explore Icon" className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewCourse;
