// src/context/HealthContext.jsx
import React, { createContext, useState } from "react";

// Create the context
export const HealthContext = createContext();

// Create a provider component
export function HealthProvider({ children }) {
  const [healthData, setHealthData] = useState({
    fullName: "",
    age: "",
    gender: "",
    diet: "",
    height: "",
    weight: "",
    goal: "",
    activity: "",
    conditions: "",
    allergies: "",
    medications: "",
    medicalFiles: [],
  });

  return (
    <HealthContext.Provider value={{ healthData, setHealthData }}>
      {children}
    </HealthContext.Provider>
  );
}
