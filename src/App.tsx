// import React, { useState, useEffect } from 'react';
// import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import axios from 'axios';

// import Home from './components/Home';
// import Dashboard from './components/Dashboard';
// import Login from './components/Navbar/Login';
// import Nav from './components/Navbar/Nav';

// import CourseTable from './components/Tables/courseTables';
// import UserTable from './components/Tables/traineeTables';
// import AdminTable from './components/Tables/adminTables';
// import FinanceTable from './components/Tables/salesTables';
// import TrainerTable from './components/Tables/trainerTables';
// import AddUser from './components/Tables/addUser';

// import AllUsers from './components/Tables/allUsers';
// import CourseCategoryTable from './components/Tables/courseCategory';
// import ManageRoles from './components/Tables/rolesTables';
// import PermissionRoles from './components/Tables/permissionTables';
// import RolePermission from './components/Tables/rolePermission';

// import ProtectedRoute from './components/protectedRoute';

// import { Toaster } from 'sonner';

// const App: React.FC = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
//     () => localStorage.getItem('isAuthenticated') === 'true'
//   );
//   const [userName, setUserName] = useState<string>(() => localStorage.getItem('userName') || '');
//   const [loading, setLoading] = useState<boolean>(true);


//   useEffect(() => {
//     const authenticateWithToken = async () => {
//       const token = localStorage.getItem('authToken');
//       const userId = localStorage.getItem('userId');
//       const roleName = localStorage.getItem('role');

//       console.log("token", token);
//       console.log("userid", userId);
//       console.log("Role Name", roleName);

//       if (token && userId) {
//         try {
//           const response = await axios.get(`/users/${userId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });

//           // Check the full structure of the response
//           console.log('API Response:', response);
//           console.log('respp', response.data.user);

//           // Check if the response contains the user data
//           if (response.data && response.data.user) {
//             const user = response.data.user;
//             const fullName = `${user.firstName} ${user.lastName}`;

//             setIsAuthenticated(true);
//             setUserName(fullName);

//             // localStorage.setItem('isAuthenticated', 'true');
//             // localStorage.setItem('userName', fullName);
//           }
          
//         } catch (error) {
//           console.error('Token validation failed:', error);
//           localStorage.clear();
//           setIsAuthenticated(false);
//         }
//       }
//       setLoading(false);
//     };
//     console.log('isauthenticate',isAuthenticated);

//     authenticateWithToken();
//   }, []);

//   if (loading) {
//     return <div className="text-center mt-20">Loading...</div>;
//   }

//   console.log('isauth',isAuthenticated);

//   return (
//     <>
//       <Router>
//         <Nav
//           isAuthenticated={isAuthenticated}
//           setIsAuthenticated={setIsAuthenticated}
//           userName={userName}
//         />

//         <Routes>
//           <Route
//             path="/"
//             element={
//               isAuthenticated ? (
//                 <Home isAuthenticated={isAuthenticated} />
//               ) : (
//                 <Navigate to="/login" replace/>
//               )
//             }
//           >
//             <Route index element={<Dashboard />} />
//             <Route path="courses" element={<CourseTable />} />
//             <Route path="course-category" element={<CourseCategoryTable />} />
//             <Route path="manage-roles-and-permissions" element={<ManageRoles/>}/>
//             <Route path="manage-permissions" element={<PermissionRoles/>}/>
//             <Route path="manage-role-permission" element={<RolePermission/>}/>
//             <Route path="allUsers/" element={<AllUsers />}>
//               <Route path="trainee" element={<UserTable />} />
//               <Route path="admin" element={<AdminTable />} />
//               <Route path="sales" element={<FinanceTable />} />
//               <Route path="trainer" element={<TrainerTable />} />
//               <Route path="add-user" element={<AddUser />} />
//             </Route>
//           </Route>
//           <Route
//             path="/login"
//             element={<Login setIsAuthenticated={setIsAuthenticated} setUserName={setUserName} />}
//           />
//         </Routes>


        
//       </Router>
//       <Toaster />
//     </>
//   );
// };

// export default App;


import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';

import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Login from './components/Navbar/Login';
import Nav from './components/Navbar/Nav';

import CourseTable from './components/Tables/courseTables';
import UserTable from './components/Tables/traineeTables';
import AdminTable from './components/Tables/adminTables';
import FinanceTable from './components/Tables/salesTables';
import TrainerTable from './components/Tables/trainerTables';
import AddUser from './components/Tables/addUser';

import AllUsers from './components/Tables/allUsers';
import CourseCategoryTable from './components/Tables/courseCategory';
import ManageRoles from './components/Tables/rolesTables';
import PermissionRoles from './components/Tables/permissionTables';
import RolePermission from './components/Tables/rolePermission';

import ProtectedRoute from './components/protectedRoute';


import TrainerHelloWorld from './components/Trainer/TrainerHelloWorld';

import TraineeHelloWorld from './components/Trainee/TraineeHelloWorld';

import { Toaster } from 'sonner';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => localStorage.getItem('isAuthenticated') === 'true'
  );
  const [userRole, setUserRole] = useState<string>(() => localStorage.getItem('role') || '');
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('userName') || '');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const authenticateWithToken = async () => {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');

      if (token && userId) {
        try {
          const response = await axios.get(`/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.data && response.data.user) {
            const user = response.data.user;
            const fullName = `${user.firstName} ${user.lastName}`;

            setIsAuthenticated(true);
            setUserRole(user.role);
            setUserName(fullName);

            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('role', user.role);
            localStorage.setItem('userName', fullName);
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.clear();
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    authenticateWithToken();
  }, []);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <Router>
      <Nav
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />

      <Routes>
        {/* Admin Protected Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Home isAuthenticated={isAuthenticated} />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="courses" element={<CourseTable />} />
          <Route path="course-category" element={<CourseCategoryTable />} />
          <Route path="manage-roles-and-permissions" element={<ManageRoles />} />
          <Route path="manage-permissions" element={<PermissionRoles />} />
          <Route path="manage-role-permission" element={<RolePermission />} />
          <Route path="allUsers/" element={<AllUsers />}>
            <Route path="trainee" element={<UserTable />} />
            <Route path="admin" element={<AdminTable />} />
            <Route path="sales" element={<FinanceTable />} />
            <Route path="trainer" element={<TrainerTable />} />
            <Route path="add-user" element={<AddUser />} />
          </Route>
        </Route>

        {/* Trainer Protected Routes */}
        <Route
          path="/trainer/*"
          element={
            <ProtectedRoute allowedRoles={['trainer']}>
              <TrainerHelloWorld />
            </ProtectedRoute>
          }
        >
          {/* <Route path="dashboard" element={<Dashboard />} /> */}
        </Route>


        <Route
          path="/trainee"
          element={
            <ProtectedRoute allowedRoles={['trainee']}>
              <TraineeHelloWorld />
            </ProtectedRoute>
          }
        />


        {/* Role-based Redirection */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              userRole === 'admin' ? (
                <Navigate to="/admin" replace />
              ) : userRole === 'trainer' ? (
                <Navigate to="/trainer" replace />
              ) : userRole === 'trainee' ? (
                <Navigate to="/trainee" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />


        {/* Login Route */}
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} setUserName={setUserName} />}
        />
      </Routes>

      <Toaster />
    </Router>
  );
};

export default App;
