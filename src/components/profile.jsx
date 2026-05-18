// src/components/Profile.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { HealthContext } from "../context/HealthContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Profile() {
  const {
    profile,
    setProfile,
    goals,
    setGoals,
    dailyTasks,
    setDailyTasks,
    weightHistory,
    setWeightHistory,
    useFirebase,
    setUseFirebase,
  } = useContext(HealthContext);

  const [localProfile, setLocalProfile] = useState(profile || {});
  const [picPreview, setPicPreview] = useState(localProfile.picture || null);
  const [newWeight, setNewWeight] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [editingGoalIndex, setEditingGoalIndex] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => setLocalProfile(profile || {}), [profile]);

  function updateField(key, value) {
    const updated = { ...(localProfile || {}), [key]: value };
    setLocalProfile(updated);
    setProfile(updated);
  }

  function handlePictureChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setPicPreview(dataUrl);
      const updated = { ...(localProfile || {}), picture: dataUrl, pictureName: file.name };
      setLocalProfile(updated);
      setProfile(updated);
    };
    reader.readAsDataURL(file);
  }

  function addWeightEntry() {
    const wt = parseFloat(newWeight);
    if (!wt || wt <= 0) return;
    const entry = { date: new Date().toISOString().slice(0, 10), weight: wt };
    const updated = [...(weightHistory || []).filter(Boolean), entry];
    setWeightHistory(updated);
    setNewWeight("");
  }

  const latestWeight = weightHistory && weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : localProfile.weight;
  const bmi = useMemo(() => {
    const h = localProfile.height ? Number(localProfile.height) / 100 : null;
    const w = latestWeight ? Number(latestWeight) : null;
    if (!h || !w) return null;
    const val = w / (h * h);
    return val ? val.toFixed(1) : null;
  }, [localProfile.height, latestWeight, weightHistory]);

  const todayKey = new Date().toISOString().slice(0, 10);
  const todayTasks = (dailyTasks && dailyTasks[todayKey]) || [
    { id: "water", label: "Drink 2L water", done: false },
    { id: "steps", label: "10,000 steps", done: false },
    { id: "meals", label: "Log 3 meals", done: false },
  ];

  function toggleTask(id) {
    const current = dailyTasks || {};
    const todays = current[todayKey] ? [...current[todayKey]] : [...todayTasks];
    const idx = todays.findIndex((t) => t.id === id);
    if (idx >= 0) todays[idx].done = !todays[idx].done;
    else todays.push({ id, label: id, done: true });
    const updated = { ...current, [todayKey]: todays };
    setDailyTasks(updated);
  }

  function addCustomTask() {
    if (!taskInput.trim()) return;
    const id = `task_${Date.now()}`;
    const current = dailyTasks || {};
    const todays = current[todayKey] ? [...current[todayKey]] : [...todayTasks];
    todays.push({ id, label: taskInput.trim(), done: false });
    setDailyTasks({ ...current, [todayKey]: todays });
    setTaskInput("");
  }

  function addGoal() {
    if (!goalInput.trim()) return;
    const g = { id: `g_${Date.now()}`, text: goalInput.trim(), createdAt: new Date().toISOString(), completed: false, history: [] };
    setGoals([...(goals || []), g]);
    setGoalInput("");
  }

  function toggleGoalComplete(id) {
    setGoals((prev) =>
      (prev || []).map((g) => (g.id === id ? { ...g, completed: !g.completed, history: [...(g.history||[]), { at: new Date().toISOString(), completed: !g.completed }] } : g))
    );
  }

  function deleteGoal(id) {
    setGoals((prev) => (prev || []).filter((g) => g.id !== id));
  }

  function startEditGoal(idx) {
    setEditingGoalIndex(idx);
    setGoalInput(goals[idx].text);
  }

  function saveEditGoal() {
    if (editingGoalIndex === null) return;
    setGoals((prev) => {
      const copy = [...(prev || [])];
      copy[editingGoalIndex] = { ...copy[editingGoalIndex], text: goalInput };
      return copy;
    });
    setEditingGoalIndex(null);
    setGoalInput("");
  }

  const chartData = (weightHistory || []).slice(-12).map((w) => ({ date: w.date, weight: w.weight }));

  return (
    <div className="min-h-screen bg-[#f5fff8] p-6 flex justify-center">
      <div className="w-full max-w-5xl space-y-8">
<br></br>
<br></br>
<br></br>
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl shadow border border-green-100 grid md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border">
              {picPreview ? <img src={picPreview} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-400">No Image</div>}
            </div>
            <label className="bg-green-600 text-white px-4 py-1 rounded cursor-pointer">
              Upload
              <input type="file" className="hidden" accept="image/*" onChange={handlePictureChange} />
            </label>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input value={localProfile.fullName || ""} onChange={(e)=>updateField("fullName", e.target.value)} className="w-full mt-1 px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Age</label>
              <input value={localProfile.age || ""} onChange={(e)=>updateField("age", e.target.value)} className="w-full mt-1 px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Height (cm)</label>
              <input value={localProfile.height || ""} onChange={(e)=>updateField("height", e.target.value)} className="w-full mt-1 px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Weight (kg)</label>
              <input value={localProfile.weight || ""} onChange={(e)=>updateField("weight", e.target.value)} className="w-full mt-1 px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Diet</label>
              <input value={localProfile.diet || ""} onChange={(e)=>updateField("diet", e.target.value)} className="w-full mt-1 px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Activity</label>
              <input value={localProfile.activity || ""} onChange={(e)=>updateField("activity", e.target.value)} className="w-full mt-1 px-3 py-2 border rounded" />
            </div>
          </div>

          <div className="md:col-span-2 mt-3 text-gray-700">BMI: <span className="font-semibold">{bmi || "—"}</span></div>
        </div>

        {/* Weight Chart Card */}
        <div className="bg-white p-6 rounded-2xl shadow border border-green-100">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg">Weight Progress</h3>
            <div className="flex items-center gap-2">
              <input value={newWeight} onChange={(e)=>setNewWeight(e.target.value)} placeholder="kg" className="px-2 py-1 border rounded w-24" />
              <button onClick={addWeightEntry} className="bg-green-600 text-white px-3 py-1 rounded">Add</button>
            </div>
          </div>
          <div style={{ width: "100%", height: 240 }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="#10B981" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">No weight history yet — add an entry.</p>
            )}
          </div>
        </div>

        {/* Tasks & Goals Card */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow border border-green-100">
            <h4 className="font-semibold mb-3">Today's Tasks</h4>
            <div className="space-y-2">
              {(dailyTasks?.[todayKey] || todayTasks).map((t) => (
                <div key={t.id} className="flex items-center gap-2">
                  <input type="checkbox" checked={t.done} onChange={()=>toggleTask(t.id)} />
                  <span className={`${t.done?"line-through text-gray-400":""}`}>{t.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input value={taskInput} onChange={(e)=>setTaskInput(e.target.value)} placeholder="Add a task" className="flex-1 px-2 py-1 border rounded"/>
              <button onClick={addCustomTask} className="bg-blue-600 text-white px-3 py-1 rounded">Add</button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow border border-green-100">
            <h4 className="font-semibold mb-3">Goals</h4>
            <div className="space-y-2 mb-3">
              {(goals||[]).map((g, idx)=>(
                <div key={g.id} className="flex justify-between gap-2 border-b pb-1">
                  <div>
                    <input type="checkbox" checked={g.completed} onChange={()=>toggleGoalComplete(g.id)} />
                    <span className={`${g.completed?"line-through text-gray-400":"font-medium"} ml-2`}>{g.text}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={()=>startEditGoal(idx)} className="text-blue-600 text-sm">Edit</button>
                    <button onClick={()=>deleteGoal(g.id)} className="text-red-600 text-sm">Del</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={goalInput} onChange={(e)=>setGoalInput(e.target.value)} placeholder="Add a goal" className="flex-1 px-2 py-1 border rounded"/>
              {editingGoalIndex!==null ? 
                <button onClick={saveEditGoal} className="bg-yellow-500 px-3 py-1 rounded">Save</button>
                : <button onClick={addGoal} className="bg-green-600 text-white px-3 py-1 rounded">Add</button>
              }
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow border border-green-100">
            <h4 className="font-semibold mb-3">Quick Stats</h4>
            <p>Last Weight: {latestWeight || "—"} kg</p>
            <p>BMI: {bmi || "—"}</p>
            <p>Profile saved: {localProfile ? "Yes" : "No"}</p>
            <button onClick={()=>setProfile(localProfile)} className="mt-3 w-full bg-indigo-600 text-white py-2 rounded">Save Profile</button>
          </div>
        </div>

      </div>
    </div>
  );
}
