import React, { useState } from "react";

import CompletedCourse from "@/images/online-course.png"; // Completed course image

import RemainingClasses from "@/images/hourglass.png";
import Attendance from "@/images/time-management.png";

import CalenderManage from "../CalenderManage/calenderManage";

const DashboardHeader: React.FC = () => {
  const [name, setName] = useState<string | null>(
    localStorage.getItem("userName")
  );

  return (
    <div className="grid grid-cols-2 mt-4">
      <div className="bg-slate-700 p-6 text-white w-[800px] h-[450px] rounded-lg ml-4 grid grid-cols-2 md:grid-cols-1">
        <div>
          <h1 className="text-xl font-bold">Welcome back, Mr. {name}</h1>
          <p className="mb-4">
            Track, manage, and forecast your platform performance
          </p>

          <div className="mt-10">
            <h2 className="text-lg font-semibold">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-4">
              {/* Completed Courses Section */}
              <OverviewCard
                imgSrc={CompletedCourse}
                title="Module Completed"
                value="2"
              />

              {/* Attedance Section */}
              <OverviewCard
                imgSrc={Attendance}
                title="Attendance"
                value="10 Days"
              />

              {/* Remaining Classes */}
              <OverviewCard
                imgSrc={RemainingClasses}
                title="Remaining Classes"
                value="30 Classes"
              />
            </div>
          </div>

          {/* Upcoming Events Section */}
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-2">Upcoming Events</h2>
            <ul className="text-sm space-y-5">
              <li>
                <span className="font-semibold">Assignment:</span> Assignment 1
                <br />
                <span className="text-gray-300">Due Date: 12th Jan 2025</span>
              </li>
              <li>
                <span className="font-semibold">Class:</span> React
                <br />
                <span className="text-gray-300">
                  Time: 10:00 AM to 12:00 PM
                </span>
              </li>
            </ul>
          </div>

          
        </div>
      </div>
      <div>
        <CalenderManage />
      </div>
    </div>
  );
};

const OverviewCard: React.FC<{
  imgSrc: string;
  title: string;
  value: string;
}> = ({ imgSrc, title, value }) => (
  <div className="grid grid-cols-2">
    <div className="flex items-center hover:bg-slate-400 hover:text-white p-4 rounded-lg w-[70px] bg-slate-200 text-black">
      <img src={imgSrc} alt={title} className="w-10 h-10" />
    </div>
    <div className="-ml-5">
      <h3 className="font-semibold">{title}</h3>
      <p className="font-extrabold">{value}</p>
    </div>
  </div>
);

export default DashboardHeader;
