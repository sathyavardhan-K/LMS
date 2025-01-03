// import React from "react";
// import { Outlet, useLocation } from "react-router-dom";
// import Calendar from "./CalenderManagement/calenderManagement";

// interface TraineeProb {
//   isAuthenticated: boolean;
// }

// const TraineeHome: React.FC<TraineeProb> = () => {
//   const location = useLocation();

//   // Hide Calendar on the settings page or any other page you want to exclude
//   const shouldShowCalendar = location.pathname !== "/trainee/settings";

//   return (
//     <>  
//       <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-200">
//         {shouldShowCalendar && <Calendar />}
//         <Outlet />
//       </div>
//     </>
//   );
// };

// export default TraineeHome;

import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./ProfilePage/SideBar/sideBar";
import CoursePage from "./ProfilePage/EnrolledCourses/CoursePage/coursePage";

interface TraineeProb {
  isAuthenticated: boolean;
}

const TraineeHome: React.FC<TraineeProb> = () => {
  const location = useLocation();

  // Check if the current route is "settings"
  const isSettingsPage = location.pathname.includes("/settings");

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-100 to-purple-200">
 
      <div className="flex flex-1">
        {/* Sidebar only if not on settings page */}
        {!isSettingsPage && (
          <aside className="w-[320px] bg-violet-300 p-4 font-semibold">
            <Sidebar />
          </aside>
        )}

        {/* Main Content Area */}
        <main className={`flex-1 ${isSettingsPage ? "p-8" : "p-4"} bg-white`}>
          
         <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TraineeHome;

