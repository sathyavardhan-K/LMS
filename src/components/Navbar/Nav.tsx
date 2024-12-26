// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaBars } from "react-icons/fa";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "@radix-ui/react-popover"; // Popover components from Radix UI

// interface NavProps {
//   isAuthenticated: boolean;
//   setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const Nav: React.FC<NavProps> = ({ isAuthenticated, setIsAuthenticated }) => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   // Initialize role and name from localStorage or fallback to null
//   const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
//   const [name, setName] = useState<string | null>(localStorage.getItem("userName"));

//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleStorageChange = () => {
//       setRole(localStorage.getItem("role"));
//       setName(localStorage.getItem("userName"));
//     };

//     window.addEventListener("storage", handleStorageChange);

//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     setIsAuthenticated(false);
//     setRole(null);
//     setName(null);
//     navigate("/login");
//   };

//   useEffect(() => {
//     if (isAuthenticated) {
//       setRole(localStorage.getItem("role"));
//       setName(localStorage.getItem("userName"));
//     }
//   }, [isAuthenticated]);

//   return (
//     <div className="bg-gradient-to-r bg-black p-4 shadow-lg overflow-hidden">
//       <div className="flex justify-between items-center max-w-screen-xxl">
//         <Link
//           to={
//             role === "admin"
//               ? "/admin/dashboard"
//               : role === "trainer"
//               ? "/trainer"
//               : role === "trainee"
//               ? "/trainee"
//               : "/"
//           }
//           className="hover:scale-105 transform transition"
//         >
//           <img
//             src="https://teqcertify.com/wp-content/uploads/2024/12/Untitled-design-3.png"
//             alt="teqcertify"
//             className="w-48 h-16"
//           />
//         </Link>

//         {/* Desktop Navigation Buttons */}
//         <div className="hidden md:flex items-center space-x-6">
//           {!isAuthenticated ? (
//             <Link to="/login" className="text-white" />
//           ) : (
//             <>
//               <span className="text-white font-medium">{`Welcome, ${
//                 name || "User"
//               }`}</span>

//               {/* Avatar with initials */}
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <div className="cursor-pointer">
//                     {/* If avatarUrl is not used, show initials as the avatar */}
//                     <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
//                       {name?.charAt(0)}
//                     </div>
//                   </div>
//                 </PopoverTrigger>

//                 <PopoverContent className="bg-white text-black p-4 rounded-lg shadow-lg w-48 mr-10 mt-5">
//                   <div className="flex flex-col space-y-2">
//                     <Link
//                       to="/trainee/settings"
//                       className="text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-full text-center shadow-md transition duration-300"
//                     >
//                       <p>User Settings</p>
//                     </Link>
//                     <button
//                       onClick={handleLogout}
//                       className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-full shadow-md transition duration-300"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 </PopoverContent>
//               </Popover>
//             </>
//           )}
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           onClick={toggleMobileMenu}
//           className="md:hidden text-white text-2xl focus:outline-none"
//         >
//           <FaBars />
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden bg-gray-800 mt-2 rounded-lg p-4">
//           <div className="flex flex-row items-center gap-4">
//             {!isAuthenticated ? (
//               <Link to="/login" className="text-white" />
//             ) : (
//               <>
//                 <span className="text-white font-medium">{`Welcome, ${
//                   name || "User"
//                 }`}</span>

//                 {/* Avatar for Mobile Menu */}
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <div className="cursor-pointer">
//                       {/* If avatarUrl is not used, show initials as the avatar */}
//                       <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
//                         {name?.charAt(0)}
//                       </div>
//                     </div>
//                   </PopoverTrigger>

//                   <PopoverContent className="bg-white text-black p-4 rounded-lg shadow-lg w-64">
//                     <div className="flex flex-row space-x-2">
//                       {/* User Settings Button */}
//                       <Link
//                         to="/trainee/settings"
//                         className="text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-full text-center shadow-md transition duration-300"
//                       >
//                         User Settings
//                       </Link>

//                       {/* Logout Button */}
//                       <button
//                         onClick={handleLogout}
//                         className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-full shadow-md transition duration-300"
//                       >
//                         Logout
//                       </button>
//                     </div>
//                   </PopoverContent>
//                 </Popover>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Nav;


import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { MdPersonAddAlt1 } from "react-icons/md";

interface NavProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Nav: React.FC<NavProps> = ({ isAuthenticated, setIsAuthenticated }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Initialize role and name from localStorage or fallback to null
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
  const [name, setName] = useState<string | null>(localStorage.getItem("userName"));
  
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for manual storage updates in other tabs
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role"));
      setName(localStorage.getItem("userName"));
    };

    // Add event listener for changes in localStorage
    window.addEventListener("storage", handleStorageChange);

    // Clean up the event listener when the component is unmounted
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Search for: ${searchQuery}`);
  };

  // Toggle the mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.clear(); // Clear localStorage on logout
    setIsAuthenticated(false); // Update authentication state
    setRole(null); // Clear role
    setName(null); // Clear name
    navigate('/login'); // Redirect to login page
  };

  useEffect(() => {
    if (isAuthenticated) {
      // After login, update the role and name state
      setRole(localStorage.getItem("role"));
      setName(localStorage.getItem("userName"));
    }
  }, [isAuthenticated]);

  return (
    <div className="bg-gradient-to-r bg-black p-4 shadow-lg">
      <div className="flex justify-between items-center max-w-screen-xxl ml-8">

        <Link
          to={
            role === "admin"
              ? "/admin/dashboard"
              : role === "trainer"
              ? "/trainer"
              : role === "trainee"
              ? "/trainee"
              : "/"
          }
          className="hover:scale-105 transform transition"
        >
          <img src="https://teqcertify.com/wp-content/uploads/2024/12/Untitled-design-3.png" alt="teqcertify" className="w-56 h-16" />
        </Link>
  

        {/* Desktop Navigation Buttons */}
        <div className="hidden md:flex items-center w-full px-12">
          {!isAuthenticated ? (
            <>
              <div className="flex flex-1 justify-center items-center space-x-6">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `relative text-white font-metropolis font-semibold text-md ${isActive ? "text-green-500" : "hover:text-green-500 transition"
                    } group`
                  }
                >
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-[0.5px] bg-green-500 transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `relative text-white font-metropolis font-semibold text-md ${isActive ? "text-green-500" : "hover:text-green-500 transition"
                    } group`
                  }
                >
                  About
                  <span className="absolute bottom-0 left-0 w-0 h-[0.5px] bg-green-500 transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
                <NavLink
                  to=""
                  className={({ isActive }) =>
                    `relative text-white font-metropolis font-semibold text-md ${isActive ? "text-green-500" : "hover:text-green-500 transition"
                    } group`
                  }
                  style={{ wordSpacing: "0.2em" }}
                >
                  Talent Acquisition Partner
                  <span className="absolute bottom-0 left-0 w-0 h-[0.5px] bg-green-500 transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `relative text-white font-metropolis font-semibold text-md ${isActive ? "text-green-500" : "hover:text-green-500 transition"
                    } group`
                  }
                >
                  Contact
                  <span className="absolute bottom-0 left-0 w-0 h-[0.5px] bg-green-500 transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
              </div>
              {/* Register Button */}
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `relative flex items-center text-white font-metropolis font-semibold text-md ${isActive ? "text-green-500" : "hover:text-green-500 transition"
                  } group`
                }
              >
                <MdPersonAddAlt1 className="mr-2 text-xl text-gray-600 hover:text-green-500" /> Register
              </NavLink>
            </>
          ) : (
            // Authenticated state: Show username and logout
            <div className="flex flex-1 justify-end items-center space-x-4">
              <span className="text-white font-medium">{`Welcome, ${name || "User"}`}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-red-700 transition duration-300"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-white text-2xl focus:outline-none"
        >
          <FaBars />
        </button>
      </div>
    </div>
  );
};

export default Nav;