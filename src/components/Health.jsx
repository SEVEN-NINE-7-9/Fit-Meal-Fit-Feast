import React, { useState } from "react";
import { FaUser, FaRulerVertical, FaClipboardList, FaBolt } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Health() {
  const [formData, setFormData] = useState({
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

  const [showPlan, setShowPlan] = useState(false);

  // Calculate BMI
  const calculateBMI = () => {
    const { height, weight } = formData;
    if (!height || !weight) return null;
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return "";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 24.9) return "Normal weight";
    if (bmi < 29.9) return "Overweight";
    return "Obese";
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userHealthData", JSON.stringify(formData));
    setShowPlan(true);
  };

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);

  return (
    <div className="bg-[#f9fefb] min-h-screen py-12 px-6 sm:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-10">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-2">
          Complete Your <span className="text-green-600">Health Assessment</span>
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Tell us about yourself to get a personalized diet plan powered by AI
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Info */}
          <section className="border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3 font-bold text-xl">
              <FaUser /> Personal Information
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="border rounded-md px-4 py-2 w-full"
                required
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                className="border rounded-md px-4 py-2 w-full"
                required
              />
            </div>

            <div className="mt-4">
              <p className="font-medium mb-2">Gender *</p>
              <div className="flex gap-6">
                {["Male", "Female", "Other"].map((g) => (
                  <label key={g} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      onChange={handleChange}
                      required
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="font-medium mb-2">Dietary Preference *</p>
              <div className="flex gap-6">
                {["Vegetarian", "Non-Vegetarian", "Vegan"].map((d) => (
                  <label key={d} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="diet"
                      value={d}
                      onChange={handleChange}
                      required
                    />
                    {d}
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Physical Measurements */}
          <section className="border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3 text-green-600 font-semibold text-xl">
              <FaRulerVertical /> Physical Measurements
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="number"
                name="height"
                placeholder="Height (cm)"
                value={formData.height}
                onChange={handleChange}
                className="border rounded-md px-4 py-2 w-full"
                required
              />
              <input
                type="number"
                name="weight"
                placeholder="Weight (kg)"
                value={formData.weight}
                onChange={handleChange}
                className="border rounded-md px-4 py-2 w-full"
                required
              />
            </div>
          </section>

          {/* Goals & Activity */}
          <section className="border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3 text-green-600 font-semibold text-xl">
              <FaBolt /> Goals & Activity Level
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="border rounded-md px-4 py-2 w-full"
                required
              >
                <option value="">Select your primary goal</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Maintain Weight">Maintain Weight</option>
                <option value="Muscle Gain">Muscle Gain</option>
              </select>

              <select
                name="activity"
                value={formData.activity}
                onChange={handleChange}
                className="border rounded-md px-4 py-2 w-full"
                required
              >
                <option value="">Select activity level</option>
                <option value="Light">Light</option>
                <option value="Moderate">Moderate</option>
                <option value="Intense">Intense</option>
              </select>
            </div>
          </section>

          {/* Medical Info */}
          <section className="border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3 text-green-600 font-semibold text-xl">
              <FaClipboardList /> Medical Information
            </div>
            <textarea
              name="conditions"
              placeholder="Medical Conditions"
              value={formData.conditions}
              onChange={handleChange}
              className="border rounded-md px-4 py-2 w-full mb-3"
            />
            <textarea
              name="allergies"
              placeholder="Food Allergies"
              value={formData.allergies}
              onChange={handleChange}
              className="border rounded-md px-4 py-2 w-full mb-3"
            />
            <textarea
              name="medications"
              placeholder="Current Medications"
              value={formData.medications}
              onChange={handleChange}
              className="border rounded-md px-4 py-2 w-full mb-3"
            />
          </section>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md transition-all"
            >
              ⚡ Generate My Diet Plan
            </button>
          </div>
        </form>
      </div>

      {/* AI Diet Plan */}
      {showPlan && (
        <div className="max-w-5xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-10 border-t-4 border-green-500">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            ⚡ Your Personalized Diet Plan
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold mb-2">Health Summary</h3>
              <p>
                BMI: <span className="text-yellow-600">{bmi} ({bmiCategory})</span>
              </p>
              <p>
                Goal: <span className="text-green-600">{formData.goal}</span>
              </p>
              <p>Activity Level: {formData.activity}</p>
              <p>Diet Type: {formData.diet}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Daily Targets</h3>
              <p>Calories: 2085 kcal</p>
              <p>Protein: 130g (25%)</p>
              <p>Carbs: 261g (50%)</p>
              <p>Fat: 58g (25%)</p>
              <p>Water: 2.8 L/day</p>
            </div>
          </div>

          <div className="border-t pt-4 flex justify-center gap-4 mt-6">
            <Link
              to="/nutritionist"
              state={{ userHealthData: formData }}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Refer the AI Nutritionist
            </Link>
            <button
              onClick={() => setShowPlan(false)}
              className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100"
            >
              Modify Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
