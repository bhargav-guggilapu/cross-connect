import React, { useState } from "react";
import {
  Edit,
  Lock,
  Save,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

const initialUserData = {
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "(555) 123-4567",
  },
  address: {
    addressLine1: "123 Main St",
    addressLine2: "Apt 4B",
    city: "Anytown",
    state: "CA",
    country: "USA",
    zip: "12345",
  },
};

export default function AccountPage() {
  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (section, field, value) => {
    setUserData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    if (value.trim() || field === "addressLine2") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`${section}.${field}`]: "",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`${section}.${field}`]: "This field is required",
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));

    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }

    if (name === "new" || name === "confirm") {
      setErrorMessage("");
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.entries(userData.personalInfo).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[`personalInfo.${key}`] = "This field is required";
      }
    });

    Object.entries(userData.address).forEach(([key, value]) => {
      if (!value.trim() && key !== "addressLine2") {
        newErrors[`address.${key}`] = "This field is required";
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsEditing(false);
      console.log("Updated user data:", userData);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (!passwords.current.trim()) {
      setErrors((prev) => ({
        ...prev,
        current: "Current password is required.",
      }));
      return;
    }
    if (!passwords.new.trim()) {
      setErrors((prev) => ({ ...prev, new: "New password is required." }));
      return;
    }
    if (!passwords.confirm.trim()) {
      setErrors((prev) => ({
        ...prev,
        confirm: "Confirm password is required.",
      }));
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }

    console.log("Password change requested:", passwords);
    setShowPasswordChange(false);
    setPasswords({ current: "", new: "", confirm: "" });
    setErrorMessage("");
  };

  const toggleEditing = () => {
    if (isEditing) {
      handleSubmit({ preventDefault: () => {} });
    } else {
      setIsEditing(true);
    }
  };

  const renderSection = (title, data, section) => (
    <div className="mb-6 p-6 bg-white rounded-lg shadow-md border border-orange-200">
      <h3
        className="text-xl font-bold mb-6 text-orange-800"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <label
              className="text-sm text-gray-600 mb-1"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {key.charAt(0).toUpperCase() +
                key
                  .slice(1)
                  .replace(/([A-Z])/g, " $1")
                  .trim()}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(section, key, e.target.value)}
              readOnly={
                !isEditing || ["firstName", "lastName", "email"].includes(key)
              }
              className={`w-full p-2 border ${
                errors[`${section}.${key}`]
                  ? "border-red-500"
                  : "border-orange-200"
              } rounded focus:outline-none focus:ring-2 ${
                !isEditing || ["firstName", "lastName", "email"].includes(key)
                  ? "bg-gray-100"
                  : "bg-white focus:ring-orange-300"
              }`}
            />
            {errors[`${section}.${key}`] && (
              <p className="text-red-500 text-sm">
                {errors[`${section}.${key}`]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-orange-50">
      <h1
        className="text-2xl font-bold mb-4 text-orange-800"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        Account Details
      </h1>
      <form onSubmit={handleSubmit}>
        {renderSection(
          "Personal Information",
          userData.personalInfo,
          "personalInfo"
        )}
        {renderSection("Address", userData.address, "address")}
        <div className="flex justify-between items-center mb-6">
          <button
            type="button"
            onClick={toggleEditing}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300 flex items-center"
          >
            {isEditing ? <Save className="mr-2" /> : <Edit className="mr-2" />}
            {isEditing ? "Save Changes" : "Edit Information"}
          </button>
          <button
            type="button"
            onClick={() => setShowPasswordChange(!showPasswordChange)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 flex items-center"
          >
            <Lock className="mr-2" />
            Change Password
          </button>
        </div>
      </form>

      {showPasswordChange && (
        <div className="p-6 bg-white rounded-lg shadow-md border border-orange-200">
          <h3
            className="text-xl font-bold mb-4 text-orange-800"
            style={{ fontFamily: "Rajdhani, sans-serif" }}
          >
            Change Password
          </h3>
          <form onSubmit={handlePasswordSubmit}>
            {["current", "new", "confirm"].map((field) => (
              <div key={field} className="mb-4">
                <label
                  className="text-sm text-gray-600 mb-1"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)} Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords[field] ? "text" : "password"}
                    name={field}
                    value={passwords[field]}
                    onChange={handlePasswordChange}
                    className={`w-full p-2 pr-10 border ${
                      errors[field] ? "border-red-500" : "border-orange-200"
                    } rounded focus:outline-none focus:ring-2 focus:ring-orange-300`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(field)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                  >
                    {showPasswords[field] ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
                {errors[field] && (
                  <p className="text-red-500 text-sm">{errors[field]}</p>
                )}
              </div>
            ))}
            {errorMessage && (
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300  flex items-center"
            >
              <Lock className="mr-2" /> Update Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
}