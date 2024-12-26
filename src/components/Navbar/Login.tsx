import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Loginpic from "../../images/login&signup.png";
import LoadingSpinner from "../loadingSpinner";

interface LoginProps {
  setIsAuthenticated: (auth: boolean) => void;
  setUserName: (name: string) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated, setUserName }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for spinner
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Show spinner when login starts

    try {
      const response = await axios.post("/auth/login", { email, password });

      // Log response for debugging
      console.log("Login successful:", response.data);

      const { accessToken, user } = response.data;
      console.log("tokennn", accessToken);

      // Save token and user data to localStorage
      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("role", user.role);
      localStorage.setItem("userName", `${user.firstName} ${user.lastName}`);
      localStorage.setItem("userId", user.id);

      // Update application state
      setIsAuthenticated(true);
      setUserName(`${user.firstName} ${user.lastName}`);

      console.log("user role", user.role);

      // Redirect based on user role
      if (user.role === "admin") {
        console.log("user role", user.role);
        navigate("/admin/dashboard");
      } else if (user.role === "trainer") {
        navigate("/trainer");
      } else if (user.role === "trainee") {
        navigate("/trainee");
      } else {
        navigate("/"); // Default or fallback route
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false); // Hide spinner after login completes
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner timeout={8000}/>} {/* Show spinner when loading */}
      <div className="flex items-center justify-center min-h-screen bg-yellow-50">
        {/* Card Container */}
        <div className="relative flex flex-col bg-white space-x-5 rounded-2xl shadow-md md:max-w-[1000px] md:min-w[800px] md:flex-row md:space-y-0 -mt-[50px]">
          <div className="flex flex-col pb-5">
            <h1 className="font-extrabold text-3xl m-6 mx-16 text-zinc-700">
              Log in
            </h1>
            <h2 className="mx-16 my-3 text-slate-500 font-normal">
              TeqCertify offers a wide range of industry-aligned courses
              designed to empower learners at every stage of their journey.
              Whether you're looking to upskill, switch careers, or master a new
              domain, our courses are tailored to meet your goals.
            </h2>
            <form onSubmit={handleLogin}>
              <input
                className="mx-16 my-5 px-5 py-3 border border-slate-300 rounded-2xl"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="mx-16 my-5 px-5 py-3 border border-slate-300 rounded-2xl"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && (
                <p className="text-red-500 text-sm mb-4 mx-16">{error}</p>
              )}

              <div className="flex flex-col pb-10 md:flex-row m-2 space-y-5 mx-20">
                <p className="md:flex-1 my-3 cursor-pointer text-xl font-bold text-yellow-500 hover:text-yellow-700 duration-200 mt-6">
                  Forgot your password?
                </p>

                <button
                  className="md:flex-1 rounded-lg py-5 transition duration-200 text-slate-50 bg-yellow-400 shadow-sm font-semibold hover:translate-y-[-5px] hover:shadow-md hover:shadow-yellow-400"
                  type="submit"
                >
                  Log in
                </button>
              </div>
            </form>
          </div>
          <img
            src={Loginpic}
            className="object-cover max-w-[400px] hidden rounded-md md:block"
            alt="Summer beach"
          />
        </div>
      </div>
    </>
  );
};

export default Login;