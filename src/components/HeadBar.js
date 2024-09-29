import { Security } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "./Helpers/Button";
import { COLORS } from "./Constants/Colors";

export default function HeadBar() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good Morning");
    else if (hour >= 12 && hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <div className="flex bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-md">
      <div
        className="w-64 p-4 text-2xl font-bold border-r border-white/20"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        CrossConnect
      </div>
      <header className="flex-1 flex justify-between items-center px-4">
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          {greeting} User1
        </h1>
        <div className="flex items-center space-x-4">
          <span className="bg-orange-500 font-bold text-white px-3 py-1 rounded-full text-sm mr-2 cursor-pointer">
            534275
          </span>

          <Link key="Prohibited Items" to="/prohibited-items">
            <Button
              text="Prohibited Items"
              icon={Security}
              bgColor={COLORS.RED_600}
            />
          </Link>
          <Avatar
            alt="User1"
            src="/static/images/avatar/1.jpg"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
        </div>
      </header>
    </div>
  );
}
