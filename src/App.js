import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import HeadBar from "./components/HeadBar";
import { Snackbar } from "@mui/material";
import Agent from "./components/Agent";
import Draft from "./components/Draft";
import ProhibitedItems from "./components/ProhibitedItems";
import Delivered from "./components/Delivered";
import Account from "./components/Account";
import InProgress from "./components/InProgress";

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
            <Route path="/in-progress" element={<InProgress />} />
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
