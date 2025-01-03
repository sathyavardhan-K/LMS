import React, { useEffect, useState } from "react";
import RightArrows from "../../../../../icons/right_arrow_2.png";

// Helper function to animate the percentage value
const animatePercentage = (target: number, duration: number) => {
  let start = 0;
  const step = (target - start) / (duration / 10); // Calculate the increment per step
  const interval = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(interval);
    }
    document.getElementById("percentage-value")!.innerText = `${Math.round(
      start
    )}%`;
  }, 10); // Update every 10ms
};

const Homework: React.FC = () => {
  const [percentage, setPercentage] = useState<number>(88);

  useEffect(() => {
    animatePercentage(percentage, 1000); // Animate to 88% over 2 seconds
  }, [percentage]);

  return (
    <div className="bg-gray-200 p-4 rounded shadow ml-40">
      <h2 className="text-lg font-bold">Homework Progress</h2>
      <p>Track and complete your assignments on time.</p>
      <div>
        <div className="bg-white p-2 rounded-xl grid grid-cols-3 gap-4 mt-4 relative overflow-y-scroll">
          <div className="bg-purple-200 shadow rounded-full flex justify-center items-center">
            <p
              id="percentage-value"
              className="text-2xl font-semibold text-gray-800"
            >
              0%
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold mt-4">Assignment 1</h2>
            <p>Complete the assignment by 10th August 2021.</p>
          </div>

          {/* Arrow Icon */}
          <div className="absolute bottom-4 right-10 mb-5 bg-orange-400 rounded-lg p-2">
            <img src={RightArrows} alt="Explore Icon" className="w-10 h-10" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homework;
