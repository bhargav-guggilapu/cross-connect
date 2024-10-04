import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Divider, Menu } from "@mui/material";
import { ChangeCircle, Logout, Security } from "@mui/icons-material";
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase";
import Button from "./Helpers/Button";
import { COLORS, ROLES } from "./Constants/Constants";
import logo from "../images/logo.jpg";
import { updateUser } from "../services/Api";
import Loading from "./Loading";

export default function HeadBar({ user, setUser }) {
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElZip, setAnchorElZip] = useState(null);
  const [newZipCode, setNewZipCode] = useState("");
  const [zipCodeError, setZipCodeError] = useState("");
  const [zipTouched, setZipTouched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good Morning");
    else if (hour >= 12 && hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleZipClick = (event) => {
    setAnchorElZip(event.currentTarget);
  };

  const handleZipMenuClose = () => {
    setNewZipCode("");
    setZipCodeError("");
    setZipTouched(false);
    setAnchorElZip(null);
  };

  const handleZipCodeInputChange = (e) => {
    const value = e.target.value;
    setNewZipCode(value);

    if (value.length !== 6) {
      setZipCodeError("Zip code must be exactly 6 characters.");
    } else {
      setZipCodeError("");
    }

    setZipTouched(true);
  };

  const handleZipCodeChange = async () => {
    if (newZipCode.length !== 6) {
      setZipCodeError("Zip code must be exactly 6 characters.");
      setZipTouched(true);
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await updateUser({
        ...user,
        zipCode: newZipCode,
        selectedAgent: null,
      });
      setUser(updatedUser.data);
    } catch (error) {
      console.error("Unable to update zip code: ", error);
    }
    handleZipMenuClose();
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed: ", error);
    }
    handleMenuClose();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-md">
      <div className="w-64 p-4 border-r border-white/20 flex items-center">
        <Avatar alt="logo" src={logo} />
        <h1
          className="text-2xl text-white font-bold ml-3"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          CrossConnect
        </h1>
      </div>
      <header className="flex-1 flex justify-between items-center px-4 ml-2">
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          {greeting} {user.firstName}
        </h1>
        <div className="flex items-center space-x-4">
          {user.role === ROLES.CUSTOMER && (
            <>
              <span
                className="bg-orange-500 font-bold text-white px-3 py-1 rounded-full text-sm mr-2 cursor-pointer"
                onClick={handleZipClick}
              >
                {user.zipCode}
              </span>
              <Menu
                anchorEl={anchorElZip}
                open={Boolean(anchorElZip)}
                onClose={handleZipMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                className="mt-2"
                PaperProps={{
                  className: "shadow-lg rounded-md",
                }}
              >
                <div className="flex flex-col p-4">
                  <input
                    type="text"
                    placeholder="Enter new zip code"
                    value={newZipCode}
                    onChange={handleZipCodeInputChange}
                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 
                bg-white focus:ring-orange-300
                ${zipCodeError ? "border-red-500" : ""}
                `}
                    onBlur={() => setZipTouched(true)}
                  />
                  {zipTouched && zipCodeError && (
                    <span className="text-red-500 text-sm mt-1">
                      {zipCodeError}
                    </span>
                  )}
                </div>
                <Divider />
                <div className="px-4 py-2 flex justify-center mt-2">
                  <Button
                    icon={ChangeCircle}
                    text="Change Zip Code"
                    bgColor={COLORS.GREY_500}
                    onClick={handleZipCodeChange}
                  />
                </div>
              </Menu>
            </>
          )}
          <Link to="/prohibited-items">
            <Button
              text="Prohibited Items"
              icon={Security}
              bgColor={COLORS.RED_600}
            />
          </Link>
          <Avatar
            alt={user.firstName}
            src={user.photo}
            className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
            onClick={handleAvatarClick}
          />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            className="mt-2"
            PaperProps={{
              className: "shadow-lg rounded-md",
            }}
          >
            <div className="flex items-center p-4">
              <Avatar alt={user.firstName} src={user.photo} className="mr-2" />
              <div>
                <p className="text-sm font-medium">{`${user.firstName} ${user.lastName}`}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <Divider />
            <div className="px-4 py-2 flex justify-center mt-2">
              <Button
                icon={Logout}
                text="Log Out"
                bgColor={COLORS.GREY_500}
                onClick={handleLogout}
              />
            </div>
          </Menu>
        </div>
      </header>
    </div>
  );
}
