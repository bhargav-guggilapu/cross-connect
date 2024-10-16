import React from "react";

function CurrencyToggle({ currency, setCurrency }) {
  return (
    <div className="relative w-24 h-8 bg-green-600 rounded-full cursor-pointer">
      <div
        className={`absolute top-0.5 bottom-0.5 w-1/2 bg-white rounded-full shadow-md transition-all duration-300 ease-in-out ${
          currency === "USD" ? "right-0.5" : "left-0.5"
        }`}
      ></div>
      <div className="absolute inset-0 flex items-center justify-between px-3">
        <span
          className={`z-10 font-medium transition-colors duration-300 ${
            currency === "INR" ? "text-orange-800" : "text-white"
          }`}
          style={{ fontSize: "0.85rem" }}
          onClick={() => setCurrency("INR")}
        >
          INR
        </span>
        <span
          className={`z-10 font-medium transition-colors duration-300 ${
            currency === "USD" ? "text-orange-800" : "text-white"
          }`}
          style={{ fontSize: "0.85rem" }}
          onClick={() => setCurrency("USD")}
        >
          USD
        </span>
      </div>
    </div>
  );
}

export default CurrencyToggle;
