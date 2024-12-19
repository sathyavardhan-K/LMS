import React from "react";
import { Outlet } from "react-router-dom";

interface TraineeProb {
  isAuthenticated: boolean;
}

const TraineeHelloWorld: React.FC<TraineeProb> = () => {

  return (
    <>  
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-200">
            <Outlet/>
        </div>
    </>
  );
};

export default TraineeHelloWorld;
