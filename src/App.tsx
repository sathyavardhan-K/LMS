import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';

import './App.css';
import CourseTable from './components/Tables/courseTables';
import UserTable from './components/Tables/userTables';
import AdminTable from './components/Tables/adminTables';
import FinanceTable from './components/Tables/financeTables';
import TrainerTable from './components/Tables/trainerTables';
import AddUser from './components/Tables/addUser';


import { Toaster } from 'sonner';

function App() {
  return (
      <>
          <Router>
              <Routes>
                  {/* The route will render the Home component with the Sidebar and an Outlet for nested content */}
                <Route path="/" element={<Home />}>
                      {/* Nested routes */}
                    <Route index element={<Dashboard />} />

                    <Route path="courses" element={<CourseTable />} /> {/* CourseTable content */}
                    <Route path="trainees" element={<UserTable />} /> {/* UserTable content */}
                    <Route path="admin" element={<AdminTable/>}/>
                    <Route path="finance" element={<FinanceTable/>}/>
                    <Route path="trainers" element={<TrainerTable/>}/>
                    <Route path="add-user" element={<AddUser/>} />
                </Route>

              </Routes>
          </Router>
          
          <Toaster />
      </>
    
  );
}

export default App;
