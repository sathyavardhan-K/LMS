import React from "react";
import RightArrows from "../../../../../icons/right_arrow_2.png";

const NewCourses: React.FC = () => {
  // Inline JSON data for courses
  const courses = [
    {
      id: 1,
      name: "Course 1",
      description: "Learn the basics of programming.",
      image: "/path/to/image1.png", // Replace with actual image path
    },
    {
      id: 2,
      name: "Course 2",
      description: "Advance your knowledge in web development.",
      image: "/path/to/image2.png", // Replace with actual image path
    },
    {
      id: 3,
      name: "Course 3",
      description: "Master data structures and algorithms.",
      image: "/path/to/image3.png", // Replace with actual image path
    },
  ];

  return (
    <div className="bg-gray-200 p-4 rounded shadow w-[800px]">
      <h2 className="text-lg font-bold">New Courses</h2>

      <div className="grid grid-cols-3 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white p-4 shadow mt-4 h-72 relative rounded-xl"
          >
            {/* Course Image */}
            <img
              src={course.image}
              alt={course.name}
              className="w-full h-32 object-cover rounded"
            />
            {/* Course Details */}
            <h2 className="text-lg font-bold mt-2">{course.name}</h2>
            <p>{course.description}</p>

            {/* Arrow Icon */}
            <div className="absolute bottom-4 right-4 bg-orange-400 rounded-lg">
              <img
                src={RightArrows}
                alt="Explore Icon"
                className="w-10 h-10"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewCourses;
