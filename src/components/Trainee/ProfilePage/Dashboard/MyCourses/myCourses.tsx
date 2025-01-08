import React from "react";
import Animation from "../../../../../images/animated_8.gif"; // Course image

// Sample data for courses
const courses = [
  {
    name: "React for Beginners",
    image: Animation,
    lessons: 12,
    start: "Jan 1, 2025",
    rate: "4.5/5",
    level: "Beginner",
  },
  {
    name: "Advanced JavaScript",
    image: Animation,
    lessons: 10,
    start: "Feb 15, 2025",
    rate: "4.7/5",
    level: "Advanced",
  },
  {
    name: "Python Mastery",
    image: Animation,
    lessons: 15,
    start: "Mar 10, 2025",
    rate: "4.8/5",
    level: "Intermediate",
  },
  // Add more courses as needed
];

const MyCourses: React.FC = () => {
  return (
    <div className="bg-[#8ce1bc] p-6 rounded shadow w-[800px] mx-auto h-[500px]">
      <h2 className="text-lg font-bold">My Courses</h2>
      {/* <p className="text-sm text-gray-600 mb-6">View and manage your enrolled courses.</p> */}

      {/* Course Table */}
      <div className="overflow-x-auto mt-10">
        <div className="bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-4 gap-4 p-4 border-b">
            <div className="font-semibold text-gray-700">Course Name</div>
            <div className="font-semibold text-gray-700">Start</div>
            <div className="font-semibold text-gray-700">Rate</div>
            <div className="font-semibold text-gray-700">Level</div>
          </div>

          {/* Courses */}
          {courses.map((course, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-4 p-4 border-b hover:bg-gray-50"
            >
              {/* Course Name Column */}
              <div className="flex items-center space-x-4">
                <img src={course.image} alt={course.name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <p className="font-semibold text-gray-800">{course.name}</p>
                  <p className="text-sm text-gray-500">{course.lessons} Lessons</p>
                </div>
              </div>
              {/* Start Column */}
              <div className="text-gray-700">{course.start}</div>
              {/* Rate Column */}
              <div className="text-gray-700">{course.rate}</div>
              {/* Level Column */}
              <div className="text-gray-700">{course.level}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
