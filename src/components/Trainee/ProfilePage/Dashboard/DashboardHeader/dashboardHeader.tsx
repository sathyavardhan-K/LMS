import React, { useState } from "react";
import Time from "@/images/clock.png"; // Time image
import Result from "@/images/result.png"; // Result image
import CompletedCourse from "@/images/online-course.png"; // Completed course image
import Points from "@/images/reward.png";
import Badges from "@/images/medal.png";
import Code from "@/images/programming.png";
import ProductivityChart from "./productivityChart";

const DashboardHeader: React.FC = () => {
  const [name, setName] = useState<string | null>(
    localStorage.getItem("userName")
  );

  return (
    <div className="bg-slate-700 p-6 text-white w-[1300px] rounded-lg ml-4 grid grid-cols-2 md:grid-cols-2">
      <div>
        <h1 className="text-xl font-bold">Welcome back, Mr. {name}</h1>
        <p className="mb-4">
          Track, manage, and forecast your platform performance
        </p>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-4">
            {/* Time Spent Section */}
            <OverviewCard imgSrc={Time} title="Time spent" value="2 h" />

            {/* Test Results Section */}
            <OverviewCard imgSrc={Result} title="Test Results" value="80%" />

            {/* Completed Courses Section */}
            <OverviewCard
              imgSrc={CompletedCourse}
              title="Course Completed"
              value="2"
            />

            {/* Points Section */}
            <OverviewCard imgSrc={Points} title="Points" value="901" />

            {/* Badges Section */}
            <OverviewCard imgSrc={Badges} title="Badges" value="10" />

            {/* Code Section*/}
            <OverviewCard imgSrc={Code} title="Code" value="20" />
          </div>
        </div>
      </div>

      {/* Grid section for the chart */}
      <div className="flex p-4 rounded-lg flex-col gap-1 ml-[250px]">
        <h1 className="font-bold mt-2">Productivity</h1>
        <p className="mb-5">Track your productivity and performance</p>
        <ProductivityChart />
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
      <img src={imgSrc} alt={title} className="w-10 h-10 mr-4" />
    </div>
    <div className="items-center justify-center">
      <h3 className="font-semibold">{title}</h3>
      <p className="font-extrabold">{value}</p>
    </div>
  </div>
);

export default DashboardHeader;
