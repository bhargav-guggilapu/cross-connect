import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import HeadBar from "./components/HeadBar";
import Agent from "./components/Agent";
import Draft from "./components/Draft";
import ProhibitedItems from "./components/ProhibitedItems";
import Delivered from "./components/Delivered";
import Account from "./components/Account";
import InProgress from "./components/InProgress";
import { ROLES } from "./components/Constants/Constants";
import LoginPage from "./components/Login";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./auth/firebase";
import Loading from "./components/Loading";

export default function App() {
  const [userRole, setUserRole] = useState(ROLES.CUSTOMER);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-screen bg-orange-50 font-sans">
      {user ? (
        <>
          <HeadBar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar userRole={userRole} />
            <div className="flex-1 overflow-auto">
              <Routes>
                <Route
                  path="/dashboard"
                  element={<Dashboard userRole={userRole} />}
                />
                <Route path="/agent" element={<Agent />} />
                <Route path="/draft" element={<Draft />} />
                <Route path="/in-progress" element={<InProgress />} />
                <Route path="/delivered" element={<Delivered />} />
                <Route path="/prohibited-items" element={<ProhibitedItems />} />
                <Route
                  path="/account"
                  element={<Account userRole={userRole} />}
                />
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage userRole={userRole} setUserRole={setUserRole} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </div>
  );
}
