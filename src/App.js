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
import LoginPage from "./components/Login";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./auth/firebase";
import Loading from "./components/Loading";
import { getUserByEmail } from "./services/Api";
import { SnackbarProvider } from "./components/Helpers/SnackbarContext";
import { fetchExchangeRate } from "./components/Helpers/staticFunctions";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fireBaseUser) => {
      if (fireBaseUser) {
        const fetchUserDetails = async () => {
          try {
            const userDetails = await getUserByEmail(fireBaseUser.email);
            setUser(userDetails?.data[0]);
          } catch (error) {
            console.error("Error fetching user details:", error);
          }
          setLoading(false);
        };

        fetchUserDetails();
      } else {
        setUser(null);
        setLoading(false);
      }

      fetchExchangeRate();
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <SnackbarProvider>
      <div className="flex flex-col h-screen bg-orange-50 font-sans">
        {user ? (
          <>
            <HeadBar user={user} setUser={setUser} />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar user={user} setUser={setUser} />
              <div className="flex-1 overflow-auto">
                <Routes>
                  {user.address && user.phoneNumber && (
                    <>
                      <Route
                        path="/dashboard"
                        element={<Dashboard user={user} setUser={setUser} />}
                      />
                      <Route
                        path="/agent"
                        element={<Agent user={user} setUser={setUser} />}
                      />
                      {user.selectedAgent && (
                        <Route
                          path="/draft"
                          element={<Draft user={user} setUser={setUser} />}
                        />
                      )}
                      <Route
                        path="/in-progress"
                        element={<InProgress user={user} setUser={setUser} />}
                      />
                      <Route
                        path="/delivered"
                        element={<Delivered user={user} setUser={setUser} />}
                      />
                    </>
                  )}
                  <Route
                    path="/prohibited-items"
                    element={<ProhibitedItems user={user} setUser={setUser} />}
                  />
                  <Route
                    path="/account"
                    element={<Account user={user} setUser={setUser} />}
                  />
                  <Route
                    path="*"
                    element={
                      <Navigate
                        to={
                          user.address && user.phoneNumber
                            ? "/dashboard"
                            : "/account"
                        }
                        replace
                      />
                    }
                  />
                </Routes>
              </div>
            </div>
          </>
        ) : (
          <Routes>
            <Route
              path="/login"
              element={<LoginPage user={user} setUser={setUser} />}
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </div>
    </SnackbarProvider>
  );
}
