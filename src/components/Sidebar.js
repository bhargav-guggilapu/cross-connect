import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Person,
  Description,
  AccessTime,
  LocalShipping,
  Security,
  AccountCircle,
} from "@mui/icons-material";

const menuItems = [
  { name: "Dashboard", icon: Home, path: "/dashboard" },
  { name: "Agent", icon: Person, path: "/agent" },
  { name: "Draft", icon: Description, path: "/draft" },
  { name: "In Progress", icon: AccessTime, path: "/in-progress" },
  { name: "Delivered", icon: LocalShipping, path: "/delivered" },
  { name: "Prohibited Items", icon: Security, path: "/prohibited-items" },
  { name: "Account", icon: AccountCircle, path: "/account" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white shadow-md overflow-y-auto">
      <nav>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center w-full px-4 py-3 text-left transition duration-300 ${
                location.pathname === item.path
                  ? "bg-orange-100 text-orange-800"
                  : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span style={{ fontFamily: "Poppins, sans-serif" }}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
