import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation();

  // Check if the current path matches the route
  const isActiveCourses = location.pathname === "/trainee/courses";
  const isActiveDashboard = location.pathname === "/trainee/dashboard";

  return (
    <>
      <nav className="mt-3">
        <ul>
          <Link to="/trainee/dashboard">
            <div
              className={`flex flex-col-2 py-3 px-4 rounded-lg transition mb-5 gap-4 cursor-pointer ${
                isActiveDashboard
                  ? "bg-violet-500 text-white"
                  : "bg-white hover:bg-violet-500 hover:text-white text-slate-600"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill={isActiveDashboard ? "#fff" : "#B7B7B7"}
              >
                <path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" />
              </svg>
              <li>Dashboard</li>
            </div>
          </Link>

          <Link to="/trainee/courses">
            <div
              className={`flex flex-col-2 py-3 px-4 rounded-lg transition mb-5 gap-4 cursor-pointer ${
                isActiveCourses
                  ? "bg-violet-500 text-white"
                  : "bg-white hover:bg-violet-500 hover:text-white text-slate-600"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill={isActiveCourses ? "#fff" : "#B7B7B7"}
              >
                <path d="M640-400q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM400-160v-76q0-21 10-40t28-30q45-27 95.5-40.5T640-360q56 0 106.5 13.5T842-306q18 11 28 30t10 40v76H400Zm86-80h308q-35-20-74-30t-80-10q-41 0-80 10t-74 30Zm154-240q17 0 28.5-11.5T680-520q0-17-11.5-28.5T640-560q-17 0-28.5 11.5T600-520q0 17 11.5 28.5T640-480Zm0-40Zm0 280ZM120-400v-80h320v80H120Zm0-320v-80h480v80H120Zm324 160H120v-80h360q-14 17-22.5 37T444-560Z" />
              </svg>
              <li>Enrolled Courses</li>
            </div>
          </Link>

          <Link to="/trainee/code-challenges">
            <div className="flex flex-col-2 py-3 px-4 rounded-lg hover:bg-violet-500 transition text-slate-600 bg-white mb-5 hover:text-white gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#B7B7B7"
              >
                <path d="M280-120v-80h160v-124q-49-11-87.5-41.5T296-442q-75-9-125.5-65.5T120-640v-40q0-33 23.5-56.5T200-760h80v-80h400v80h80q33 0 56.5 23.5T840-680v40q0 76-50.5 132.5T664-442q-18 46-56.5 76.5T520-324v124h160v80H280Zm0-408v-152h-80v40q0 38 22 68.5t58 43.5Zm200 128q50 0 85-35t35-85v-240H360v240q0 50 35 85t85 35Zm200-128q36-13 58-43.5t22-68.5v-40h-80v152Zm-200-52Z" />
              </svg>
              <li>Code Challenges</li>
            </div>
          </Link>

          {/* <Link to="/trainee/settings">
            <div className="flex flex-col-2 py-3 px-4 rounded-lg hover:bg-violet-500 transition text-slate-600 bg-white mb-5 hover:text-white gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#B7B7B7"
              >
                <path d="M400-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM80-160v-112q0-33 17-62t47-44q51-26 115-44t141-18h14q6 0 12 2-8 18-13.5 37.5T404-360h-4q-71 0-127.5 18T180-306q-9 5-14.5 14t-5.5 20v32h252q6 21 16 41.5t22 38.5H80Zm560 40-12-60q-12-5-22.5-10.5T584-204l-58 18-40-68 46-40q-2-14-2-26t2-26l-46-40 40-68 58 18q11-8 21.5-13.5T628-460l12-60h80l12 60q12 5 22.5 11t21.5 15l58-20 40 70-46 40q2 12 2 25t-2 25l46 40-40 68-58-18q-11 8-21.5 13.5T732-180l-12 60h-80Zm40-120q33 0 56.5-23.5T760-320q0-33-23.5-56.5T680-400q-33 0-56.5 23.5T600-320q0 33 23.5 56.5T680-240ZM400-560q33 0 56.5-23.5T480-640q0-33-23.5-56.5T400-720q-33 0-56.5 23.5T320-640q0 33 23.5 56.5T400-560Zm0-80Zm12 400Z" />
              </svg>
              <li>User Settings</li>
            </div>
          </Link> */}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
