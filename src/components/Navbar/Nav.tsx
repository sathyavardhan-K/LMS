import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaSearch } from "react-icons/fa";
import GWClogoLight from '../../images/gwc_light.svg';
import teqcertify from '../../images/teq-logo-2.png';

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
          <img src="https://teqcertify.com/wp-content/uploads/2024/12/Untitled-design-3.png" alt="teqcertify" className="w-48 h-16" />
        </Link>
  

        {/* Desktop Navigation Buttons */}
        <div className="hidden md:flex items-center space-x-6">
          {!isAuthenticated ? (
            <Link to="/login" className="text-white"/>
          ) : (
            <>
              <span className="text-white font-medium">{`Welcome, ${name || "User"}`}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-red-700 transition duration-300"
              >
                Logout
              </button>
            </>
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 mt-2 rounded-lg p-4">
          <div className="flex flex-col items-center space-y-4">
            {!isAuthenticated ? (
              <Link to="/login" className="text-white">Login</Link>
            ) : (
              <>
                <span className="text-white font-medium">{`Welcome, ${name || "User"}`}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-red-700 transition duration-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Nav;
