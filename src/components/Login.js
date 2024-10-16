import React, { useState } from "react";
import { ROLES } from "./Constants/Constants";
import logo from "../images/logo.jpg";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../auth/firebase";
import { useNavigate } from "react-router-dom";
import { createUser, getUserByEmail } from "../services/Api";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoginPage({ setUser }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    zipCode: "",
    role: ROLES.CUSTOMER,
    photo: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "firstName":
        if (!value.trim()) error = "First Name is required";
        break;
      case "lastName":
        if (!value.trim()) error = "Last Name is required";
        break;
      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Email is invalid";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 8)
          error = "Password must be at least 8 characters";
        break;
      case "confirmPassword":
        if (!value) error = "Confirm password is required";
        else if (value !== formData.password) error = "Passwords do not match";
        break;
      case "zipCode":
        if (formData.role === ROLES.CUSTOMER) {
          if (!value.trim()) error = "Zip code is required";
          else if (!/^\d{6}(-\d{5})?$/.test(value)) error = "Invalid zip code";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, formData[name]),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (
        isLogin &&
        (key === "firstName" ||
          key === "lastName" ||
          key === "confirmPassword" ||
          key === "zipCode")
      ) {
        return;
      }

      if (key === "zipCode" && formData.role !== ROLES.CUSTOMER) {
        return;
      }

      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        if (isLogin) {
          await signInWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          );
          const userDetails = await getUserByEmail(formData.email);
          setUser(userDetails.data[0]);
        } else {
          await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          );
          const userCreated = await createUser(formData);
          setUser(userCreated.data);
        }
        navigate("/dashboard");
      } catch (error) {
        console.error("Auth error:", error);
        setErrors({ email: error.message });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setTouched({});
  };

  return (
    <div className="flex h-screen">
      <div className="hidden lg:flex lg:w-1/2  items-center justify-center relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${logo})`,
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

      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md border border-orange-200 p-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-orange-800 font-rajdhani">
              {isLogin ? "Sign In" : "Sign Up"}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
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
                        onBlur={handleBlur}
                        placeholder="Enter your first name"
                        className={`mt-1 block w-full px-3 py-2 border ${
                          touched.firstName && errors.firstName
                            ? "border-red-500"
                            : "border-orange-200"
                        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white`}
                      />
                      {touched.firstName && errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.firstName}
                        </p>
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
                        onBlur={handleBlur}
                        placeholder="Enter your last name"
                        className={`mt-1 block w-full px-3 py-2 border ${
                          touched.lastName && errors.lastName
                            ? "border-red-500"
                            : "border-orange-200"
                        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white`}
                      />
                      {touched.lastName && errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-poppins mb-2">
                      Role
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="role"
                          value={ROLES.CUSTOMER}
                          checked={formData.role === ROLES.CUSTOMER}
                          onChange={handleChange}
                          className="h-5 w-5 text-orange-600 border-gray-300 focus:ring-orange-500 focus:outline-none"
                        />
                        <span className="ml-2 text-sm text-gray-700 font-poppins">
                          {ROLES.CUSTOMER}
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="role"
                          value={ROLES.AGENT}
                          checked={formData.role === ROLES.AGENT}
                          onChange={handleChange}
                          className="h-5 w-5 text-orange-600 border-gray-300 focus:ring-orange-500 focus:outline-none"
                        />
                        <span className="ml-2 text-sm text-gray-700 font-poppins">
                          {ROLES.AGENT}
                        </span>
                      </label>
                    </div>
                  </div>
                  {formData.role === ROLES.CUSTOMER && (
                    <div>
                      <label
                        htmlFor="zipCode"
                        className="block text-sm font-medium text-gray-700 font-poppins"
                      >
                        Zip Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your zip code"
                        className={`mt-1 block w-full px-3 py-2 border ${
                          touched.zipCode && errors.zipCode
                            ? "border-red-500"
                            : "border-orange-200"
                        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white`}
                      />
                      {touched.zipCode && errors.zipCode && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.zipCode}
                        </p>
                      )}
                    </div>
                  )}
                </>
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
                  onBlur={handleBlur}
                  placeholder="Enter your email address"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    touched.email && errors.email
                      ? "border-red-500"
                      : "border-orange-200"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white`}
                />
                {touched.email && errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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
                    onBlur={handleBlur}
                    placeholder="Enter your password"
                    className={`mt-1 block w-full px-3 py-2 pr-10 border ${
                      touched.password && errors.password
                        ? "border-red-500"
                        : "border-orange-200"
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
                {touched.password && errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
              {!isLogin && (
                <>
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
                        onBlur={handleBlur}
                        placeholder="Confirm your password"
                        className={`mt-1 block w-full px-3 py-2 pr-10 border ${
                          touched.confirmPassword && errors.confirmPassword
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
                    {touched.confirmPassword && errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="photo"
                      className="block text-sm font-medium text-gray-700 font-poppins"
                    >
                      Photo URL
                    </label>
                    <input
                      type="text"
                      id="photo"
                      name="photo"
                      value={formData.photo}
                      onChange={handleChange}
                      placeholder="Enter your photo url"
                      className={`mt-1 block w-full px-3 py-2 border
                         border-orange-200 rounded-md shadow-sm focus:outline-none focus:ring-2
                          focus:ring-orange-300 bg-white`}
                    />
                  </div>
                </>
              )}
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : isLogin ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
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
                disabled={isLoading}
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
