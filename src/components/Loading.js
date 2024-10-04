import React from "react";
import { CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-orange-50 z-50">
      <div className="flex flex-col items-center">
        <CircularProgress
          size={60}
          thickness={5}
          style={{ color: "#F97316" }}
        />
        <h2 className="mt-4 text-xl font-semibold text-orange-600">
          Loading...
        </h2>
        <p className="text-sm text-gray-500">
          Please wait while we load the app for you.
        </p>
      </div>
    </div>
  );
}
