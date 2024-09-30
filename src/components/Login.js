import React, { useState, useEffect } from "react";
import Button from "./Helpers/Button";
import { COLORS, ROLES } from "./Constants/Constants";
import bgImage from "../images/bg-image.jpg";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../auth/firebase";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ userRole, setUserRole }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";

    if (!isLogin) {
      if (!formData.confirmPassword.trim())
        newErrors.confirmPassword = "Confirm password is required";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        if (isLogin) {
          await signInWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          );
          navigate("/dashboard");
        } else {
          await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          );
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Auth error:", error);
        setErrors({ email: error.message });
      }
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };

  return (
    <div className="flex h-screen">
      {/* Left side */}
      <div className="hidden lg:flex lg:w-1/2  items-center justify-center relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${bgImage})`,
            filter: "brightness(0.5)",
          }}
        ></div>
        <div className="text-white text-center relative p-8 z-10">
          <h1 className="text-4xl font-bold mb-4 text-orange-100">
            Welcome to CrossConnect
          </h1>
          <p className="text-lg text-gray-100 mx-auto leading-relaxed">
            Streamline your customs process with our innovative platform. <br />
            Connect agents and customers seamlessly for efficient border
            crossings.
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="flex justify-end p-4">
          <Button
            bgColor={
              userRole === ROLES.AGENT ? COLORS.ORANGE_500 : COLORS.ORANGE_200
            }
            customStyles="mr-2 rounded-l-full"
            onClick={() => setUserRole(ROLES.AGENT)}
            text={ROLES.AGENT}
          />
          <Button
            bgColor={
              userRole === ROLES.CUSTOMER
                ? COLORS.ORANGE_500
                : COLORS.ORANGE_200
            }
            customStyles="rounded-r-full"
            onClick={() => setUserRole(ROLES.CUSTOMER)}
            text={ROLES.CUSTOMER}
          />
        </div>
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md border border-orange-200 p-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-orange-800 font-rajdhani">
              {isLogin ? `Sign In as ${userRole}` : `Sign Up as ${userRole}`}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 font-poppins"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.firstName
                          ? "border-red-500"
                          : "border-orange-200"
                      } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 font-poppins"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.lastName ? "border-red-500" : "border-orange-200"
                      } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm">{errors.lastName}</p>
                    )}
                  </div>
                </div>
              )}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 font-poppins"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.email ? "border-red-500" : "border-orange-200"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 font-poppins"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`mt-1 block w-full px-3 py-2 pr-10 border ${
                      errors.password ? "border-red-500" : "border-orange-200"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                  >
                    {showPassword ? (
                      <VisibilityOff className="h-5 w-5" />
                    ) : (
                      <Visibility className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
              {!isLogin && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 font-poppins"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className={`mt-1 block w-full px-3 py-2 pr-10 border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-orange-200"
                      } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff className="h-5 w-5" />
                      ) : (
                        <Visibility className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-300"
                >
                  {isLogin ? "Sign In" : "Sign Up"}
                </button>
              </div>
            </form>
            <p className="mt-4 text-center text-sm">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={toggleAuthMode}
                className="text-orange-600 hover:underline"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
