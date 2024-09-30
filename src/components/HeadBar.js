import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Divider, Menu } from "@mui/material";
import { Logout, Security } from "@mui/icons-material";
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase";
import Button from "./Helpers/Button";
import { COLORS } from "./Constants/Constants";
import logo from "../images/logo.jpg";

export default function HeadBar() {
  const [greeting, setGreeting] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const user = {
    name: "User1",
    email: "user1@example.com",
  };

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed: ", error);
    }
    handleMenuClose();
  };

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
          {greeting} {user.name}
        </h1>
        <div className="flex items-center space-x-4">
          <span className="bg-orange-500 font-bold text-white px-3 py-1 rounded-full text-sm mr-2 cursor-pointer">
            534275
          </span>
          <Link to="/prohibited-items">
            <Button
              text="Prohibited Items"
              icon={Security}
              bgColor={COLORS.RED_600}
            />
          </Link>
          <Avatar
            alt={user.name}
            src="/static/images/avatar/1.jpg"
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
            className="mt-2" // Small margin-top for better placement
            PaperProps={{
              className: "shadow-lg rounded-md", // Add shadow for better UI
            }}
          >
            <div className="flex items-center p-4">
              <Avatar
                alt={user.name}
                src="/static/images/avatar/1.jpg"
                className="mr-2"
              />
              <div>
                <p className="text-sm font-medium">{user.name}</p>
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
