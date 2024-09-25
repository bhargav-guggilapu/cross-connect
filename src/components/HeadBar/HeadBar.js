import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";

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
          <span className="text-yellow-300 font-bold">534275</span>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
            Track Order
          </button>
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
