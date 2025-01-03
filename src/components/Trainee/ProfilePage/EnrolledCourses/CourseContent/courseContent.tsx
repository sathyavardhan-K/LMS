import React, { useState } from "react";
import AuthorDetails from "./authorDetails";

const CourseContent: React.FC = () => {
  // State to manage the visibility of subtopics for each main topic
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  // Main topics with subtopics and time duration
  const courseStructure = [
    {
      id: 1,
      title: "Intro to Figma",
      subtopics: [
        { title: "What is Figma?", duration: "15 min" },
        { title: "Figma Interface Overview", duration: "20 min" },
        { title: "Creating Your First Project", duration: "30 min" },
      ],
    },
    {
      id: 2,
      title: "Intermediate Figma Concepts",
      subtopics: [
        { title: "Designing with Constraints", duration: "25 min" },
        { title: "Components and Variants", duration: "35 min" },
        { title: "Prototyping Basics", duration: "40 min" },
      ],
    },
    {
      id: 3,
      title: "Advanced Figma Techniques",
      subtopics: [
        { title: "Advanced Prototyping", duration: "50 min" },
        { title: "Auto Layout", duration: "45 min" },
        { title: "Figma Plugins and Integrations", duration: "60 min" },
      ],
    },
  ];

  // Toggle the visibility of subtopics
  const handleTopicClick = (topic: string) => {
    if (expandedTopic === topic) {
      setExpandedTopic(null); // Collapse if the same topic is clicked
    } else {
      setExpandedTopic(topic); // Expand the selected topic
    }
  };

  return (
    <div className="w-[460px] overflow-y-auto">
      <aside>
        <h3 className="text-lg font-semibold mb-4">Course Content</h3>
        <hr />

        {/* List of Main Topics */}
        <div className="space-y-4 mt-5">
          {courseStructure.map((course, index) => (
            <div key={index}>
              <div
                className="font-semibold text-lg cursor-pointer hover:bg-gray-200 p-2 rounded-md flex justify-between items-center"
                onClick={() => handleTopicClick(course.title)}
              >
                <span>{course.id + ") " + course.title}</span>

                {/* Arrow icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className={`transition-transform ${expandedTopic === course.title ? "rotate-180" : ""}`}
                >
                  <path
                    d="M19 9l-7 7-7-7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Subtopics (Dropdown) */}
              {expandedTopic === course.title && (
                <div className="pl-4 mt-2 space-y-2">
                  {course.subtopics.map((subtopic, subIndex) => (
                    <div key={subIndex} className="flex justify-between p-2 rounded-md hover:bg-gray-100">
                      <span>{subtopic.title}</span>
                      <span className="text-gray-500">{subtopic.duration}</span>
                    </div>
                  ))}
                </div>
              )}
              <hr />
            </div>
          ))}
        </div>
      </aside>

      

      
    </div>
  );
};

export default CourseContent;
