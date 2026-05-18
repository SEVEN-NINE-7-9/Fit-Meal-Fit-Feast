import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/ui/navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Restaurants from "./components/Restaurants";
import Health from "./components/Health";       
import Nutritionist from "./components/Nutritionist";
import Orders from "./components/Orders";
import Profile from "./components/profile";

// Import the HealthContext provider
import { HealthProvider } from "./context/HealthContext.jsx";

// Wrapper component to handle conditional Navbar
function AppWrapper() {
  const location = useLocation();

  // Hide Navbar on login and signup pages
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Main Pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/health" element={<Health />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/nutritionist" element={<Nutritionist />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} /> 
        
        {/* Authentication Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Default Route → Redirect to Home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <HealthProvider>
      <Router>
        <AppWrapper />
      </Router>
    </HealthProvider>
  );
}
