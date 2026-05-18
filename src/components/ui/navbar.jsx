import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check login state on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("fitmealUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("fitmealUser");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="FitMeal" className="w-8 h-8 object-contain" />
            <span className="text-2xl font-semibold text-green-600">FitMeal</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <Link to="/home" className="px-4 py-2 hover:bg-green-600 hover:text-white rounded-md">Home</Link>
            <Link to="/health" className="px-4 py-2 hover:bg-green-600 hover:text-white rounded-md">Health Assessment</Link>
            <Link to="/restaurants" className="px-4 py-2 hover:bg-green-600 hover:text-white rounded-md">Restaurants</Link>
            <Link to="/nutritionist" className="px-4 py-2 hover:bg-green-600 hover:text-white rounded-md">Nutritionist</Link>
            <Link to="/orders" className="px-4 py-2 hover:bg-green-600 hover:text-white rounded-md">Orders</Link>
            <Link to="/profile" className="px-4 py-2 hover:bg-green-600 hover:text-white rounded-md">Profile</Link>
          </div>

          {/* Right Side Button */}
          {!user ? (
            // If NOT logged in → Show Login
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-2 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all"
            >
              Login
            </Link>
          ) : (
            // If logged in → Show Profile + Logout
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="inline-flex items-center justify-center px-6 py-2 rounded-lg text-sm font-semibold text-green-700 border border-green-600 hover:bg-green-600 hover:text-white transition-all"
              >
                {user.name || "Profile"}
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-md"
              >
                Logout
              </button>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}
