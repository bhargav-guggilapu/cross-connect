import React, { useState } from "react";
import Button from "./Helpers/Button";
import { COLORS } from "./Constants/Constants";

export default function LoginPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [activeTab, setActiveTab] = useState("customer");

  const toggleForm = () => setIsSignIn(!isSignIn);

  return (
    <div className="flex h-screen">
      {/* Left side */}
      <div
        className="w-1/2 bg-cover bg-center relative"
        style={{
        //   backgroundImage: `url(${bgImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="w-2/3">
            <div className="grid w-full grid-cols-2">
              <Button
                customStyles={`${
                  activeTab === "agent" ? COLORS.ORANGE_500 : COLORS.ORANGE_100
                }`}
                onClick={() => setActiveTab("agent")}
                text="Agent"
              />
              <Button
                customStyles={`${
                  activeTab === "customer"
                    ? COLORS.ORANGE_500
                    : COLORS.ORANGE_100
                }`}
                onClick={() => setActiveTab("customer")}
                text="Customer"
              />
            </div>

            {activeTab === "agent" && (
              <div className="text-white text-center mt-4">
                <h2 className="text-2xl font-bold mb-4">Agent Portal</h2>
                <p>
                  Access agent-specific features and manage customer requests.
                </p>
              </div>
            )}

            {activeTab === "customer" && (
              <div className="text-white text-center mt-4">
                <h2 className="text-2xl font-bold mb-4">Customer Portal</h2>
                <p>Manage your account, track orders, and get support.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="w-1/2 bg-orange-50 flex items-center justify-center">
        <div className="w-2/3 max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center text-orange-800">
            {isSignIn ? "Sign In" : "Sign Up"}
          </h1>
          <form className="space-y-4">
            {!isSignIn && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="firstName"
                      className="text-sm text-gray-600"
                    >
                      First Name
                    </label>
                    <div className="relative">
                      <input
                        id="firstName"
                        placeholder="John"
                        className="w-full p-2 pr-8 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm text-gray-600">
                      Last Name
                    </label>
                    <div className="relative">
                      <input
                        id="lastName"
                        placeholder="Doe"
                        className="w-full p-2 pr-8 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-gray-600">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="w-full p-2 pr-8 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-gray-600">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full p-2 pr-8 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
            {!isSignIn && (
              <>
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm text-gray-600"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="w-full p-2 pr-8 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="pinCode" className="text-sm text-gray-600">
                    Pin Code
                  </label>
                  <input
                    id="pinCode"
                    placeholder="123456"
                    className="w-full p-2 pr-8 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
              </>
            )}
            <Button
              bgColor={COLORS.ORANGE_500}
              text={isSignIn ? "Sign In" : "Sign Up"}
            />
          </form>
          <p className="mt-4 text-center text-sm">
            {isSignIn ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={toggleForm}
              className="text-orange-600 hover:underline"
            >
              {isSignIn ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
