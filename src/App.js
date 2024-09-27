import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import HeadBar from "./components/HeadBar/HeadBar";
import { Snackbar } from "@mui/material";
import Agent from "./components/Agent/Agent";
import Draft from "./components/Draft/Draft";
import ProhibitedItems from "./components/Prohibited Items/ProhibitedItems";
import Delivered from "./components/Delivered/Delivered";
import Account from "./components/Account/Account";

function PlaceholderComponent({ title }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-orange-200">
      <h2
        className="text-2xl font-bold text-orange-800 mb-4"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        {title}
      </h2>
      <p>
        This is a placeholder for the {title} page. Content will be implemented
        later.
      </p>
    </div>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-orange-50 font-sans">
      {/* Top Bar */}
      <HeadBar />

      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/agent" element={<Agent />} />
            <Route path="/draft" element={<Draft />} />
            <Route
              path="/in-progress"
              element={<PlaceholderComponent title="In Progress" />}
            />
            <Route path="/delivered" element={<Delivered />} />
            <Route path="/prohibited-items" element={<ProhibitedItems />} />
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
      <Snackbar open={open} autoHideDuration={6000} message="Note archived" />
    </div>
  );
}
