import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Login from './components/Navbar/Login';
import Nav from './components/Navbar/Nav';

import CourseTable from './components/Tables/courseTables';
import UserTable from './components/Tables/userTables';
import AdminTable from './components/Tables/adminTables';
import FinanceTable from './components/Tables/financeTables';
import TrainerTable from './components/Tables/trainerTables';
import AddUser from './components/Tables/addUser';

import AllUsers from './components/Tables/allUsers';

import { Toaster } from 'sonner';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const token = Cookies.get('authToken'); // Retrieve the token
    const userId = Cookies.get('userId'); // Retrieve the user ID
    console.log('user id', userId);
  },[isAuthenticated])

  useEffect(() => {
    const authenticateWithToken = async () => {
      const token = Cookies.get('authToken'); // Retrieve the token
      const userId = Cookies.get('userId'); // Retrieve the user ID
      console.log('user id', userId);
      
      if (token && userId) {
        
        try {
          // Validate token and fetch user details
          const response = await axios.get(`/auth/userDetails/${userId}`, { 
            headers: { Authorization: `Bearer ${token}` },
          });
  
          const user = response.data.user;
          const fullName = `${user.firstName} ${user.lastName}`;
  
          // Update authentication state and user name
          setIsAuthenticated(true);
          setUserName(fullName);
        } catch (error) {
          console.error('Token validation failed:', error);
          Cookies.remove('authToken'); // Clear invalid token
          Cookies.remove('userId'); // Clear invalid userId
          setIsAuthenticated(false);
        }
      }
      setLoading(false); // Mark authentication check as complete
    };
  
    authenticateWithToken();
  }, []);
  

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>; // Show a loading screen while verifying the token
  }

  return (
    <>
      <Router>
        {/* Navbar */}
        <Nav
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          userName={userName}
        />

        <Routes>
          {/* Protected Route */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Home isAuthenticated={isAuthenticated} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            {/* Nested routes */}
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<CourseTable />} />
            

            <Route path="allUsers/" element={<AllUsers/>}>
                <Route path="trainees" element={<UserTable />} />
                <Route path="admin" element={<AdminTable />} />
                <Route path="finance" element={<FinanceTable />} />
                <Route path="trainers" element={<TrainerTable />} />
                <Route path="add-user" element={<AddUser />} />
            </Route>
          </Route>

          {/* Login Route */}
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} setUserName={setUserName} />}
          />
        </Routes>
      </Router>

      <Toaster />
    </>
  );
};

export default App;
