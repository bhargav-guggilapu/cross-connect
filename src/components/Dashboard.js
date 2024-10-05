import React, { useEffect, useState } from "react";
import {
  Chat,
  ContentCopy,
  Edit,
  Search,
  TrackChanges,
} from "@mui/icons-material";
import Button from "./Helpers/Button";
import { COLORS, ROLES } from "./Constants/Constants";
import AgentDashboard from "./AgentDashboard";
import { useNavigate } from "react-router-dom";

const tableData = {
  Delivered: [
    { id: 123, agent: "TEST 1", zipCode: "78412", status: "Delivered" },
    { id: 124, agent: "TEST 4", zipCode: "90001", status: "Delivered" },
    { id: 125, agent: "TEST 5", zipCode: "60601", status: "Delivered" },
  ],
  "In Progress": [
    {
      orderId: "IP001",
      customer: "John Doe",
      product: "Widget A",
      estimatedDelivery: "2023-06-15",
    },
    {
      orderId: "IP002",
      customer: "Jane Smith",
      product: "Gadget B",
      estimatedDelivery: "2023-06-18",
    },
    {
      orderId: "IP003",
      customer: "Bob Johnson",
      product: "Tool C",
      estimatedDelivery: "2023-06-20",
    },
  ],
  Draft: [
    {
      draftId: "D001",
      title: "New Product Launch",
      lastEdited: "2023-06-01",
      author: "Marketing Team",
    },
    {
      draftId: "D002",
      title: "Customer Survey",
      lastEdited: "2023-06-03",
      author: "Research Dept",
    },
  ],
};

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Delivered");
  const [localDate, setLocalDate] = useState();

  const agentData = user.selectedAgent
    ? {
        name: user.selectedAgent.firstName + " " + user.selectedAgent.lastName,
        email: user.selectedAgent.email,
        phoneNumber: user.selectedAgent.phoneNumber,
        addressLine1: user.selectedAgent.address.addressLine1,
        addressLine2: user.selectedAgent.address.addressLine2,
        city: user.selectedAgent.address.city,
        state: user.selectedAgent.address.state,
        zip: user.selectedAgent.address.zipCode,
      }
    : null;

  useEffect(() => {
    if (!user.addressDetails && !user.phoneNumber) {
      navigate("/account");
    }

    getTime();

    const intervalId = setInterval(() => {
      setLocalDate((prevTime) => {
        const newTime = new Date(prevTime);
        newTime.setMinutes(newTime.getMinutes() + 1);
        return newTime;
      });
    }, 60000);

    return () => clearInterval(intervalId);
  }, [user, navigate]);

  const handleCopyClick = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      //   alert("Copied to clipboard!");
    });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderTableHeaders = () => {
    switch (activeTab) {
      case "Delivered":
        return ["Order Id", "Agent", "Zip Code", ""];
      case "In Progress":
        return ["Order Id", "Customer", "Product", "Estimated Delivery", ""];
      case "Draft":
        return ["Draft Id", "Title", "Last Edited", "Author", ""];
      default:
        return [];
    }
  };

  const renderTableRow = (item) => {
    switch (activeTab) {
      case "Delivered":
        return (
          <>
            <td className="p-3">{item.id}</td>
            <td className="p-3">{item.agent}</td>
            <td className="p-3">{item.zipCode}</td>
          </>
        );
      case "In Progress":
        return (
          <>
            <td className="p-3">{item.orderId}</td>
            <td className="p-3">{item.customer}</td>
            <td className="p-3">{item.product}</td>
            <td className="p-3">{item.estimatedDelivery}</td>
          </>
        );
      case "Draft":
        return (
          <>
            <td className="p-3">{item.draftId}</td>
            <td className="p-3">{item.title}</td>
            <td className="p-3">{item.lastEdited}</td>
            <td className="p-3">{item.author}</td>
          </>
        );
      default:
        return null;
    }
  };

  const toCamelCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word, index) =>
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join("");
  };

  const getTime = async (city, country) => {
    // const response = await fetch(
    //   `https://api.ipgeolocation.io/timezone?apiKey=${process.env.REACT_APP_TIME_ZONE_API_KEY}&location=${city}, ${country}`
    // );
    // const data = await response.json();
    // const initialTime = new Date(data.date_time_txt);
    // setLocalDate(initialTime);

    setLocalDate(new Date());
  };

  return (
    <div className="flex-1 overflow-auto p-6 bg-orange-50">
      <h1
        className="text-2xl font-bold mb-4 text-orange-800"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        Dashboard
      </h1>

      {user.role === ROLES.AGENT ? (
        <AgentDashboard />
      ) : (
        <div>
          {agentData ? (
            <div className="mb-6 p-6 bg-white rounded-lg shadow-md border border-orange-200">
              <div className="flex justify-between items-center mb-4">
                <h2
                  className="text-xl font-bold text-orange-800"
                  style={{ fontFamily: "Rajdhani, sans-serif" }}
                >
                  Agent Details
                </h2>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Local time:{" "}
                    {localDate
                      ? localDate.toLocaleTimeString("en-US", {
                          timeZone: "Asia/Kolkata",
                          hour12: true,
                          hour: "numeric",
                          minute: "numeric",
                        })
                      : "Fetching..."}
                  </span>
                  <Button
                    icon={Chat}
                    bgColor={COLORS.GREEN_600}
                    // onClick={handleChangeAgent}
                    text="Chat"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {["Name", "Email", "Phone Number"].map((field) => (
                  <div key={field} className="flex flex-col">
                    <label
                      className="text-sm text-gray-600 mb-1"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {field}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full p-2 pr-8 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-100"
                        value={agentData[toCamelCase(field)]}
                        readOnly
                      />
                      <ContentCopy
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400 cursor-pointer hover:text-orange-600"
                        onClick={() =>
                          handleCopyClick(agentData[toCamelCase(field)])
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {["Address Line 1", "Address Line 2"].map((field) => (
                  <div key={field} className="flex flex-col">
                    <label
                      className="text-sm text-gray-600 mb-1"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {field}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full p-2 pr-8 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-100"
                        value={agentData[toCamelCase(field)]}
                        readOnly
                      />
                      <ContentCopy
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400 cursor-pointer hover:text-orange-600"
                        onClick={() =>
                          handleCopyClick(agentData[toCamelCase(field)])
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["City", "State", "Zip"].map((field) => (
                  <div key={field} className="flex flex-col">
                    <label
                      className="text-sm text-gray-600 mb-1"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {field}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full p-2 pr-8 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-100"
                        value={agentData[toCamelCase(field)]}
                        readOnly
                      />
                      <ContentCopy
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400 cursor-pointer hover:text-orange-600"
                        onClick={() =>
                          handleCopyClick(agentData[toCamelCase(field)])
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-6 p-6 bg-white rounded-lg shadow-md border border-orange-200">
              <div className="flex flex-col justify-center items-center">
                <h2 className="text-xl mb-4">
                  Find an Agent at zip code:{" "}
                  <span className="text-orange-800">{user.zipCode}</span>
                </h2>
                <Button
                  icon={Search}
                  bgColor={COLORS.GREEN_600}
                  onClick={() => navigate("/agent")}
                  text="Show Agents"
                />
              </div>
            </div>
          )}

          <div className="p-6 bg-white rounded-lg shadow-md border border-orange-200">
            <h2
              className="text-xl font-bold mb-4 text-orange-800"
              style={{ fontFamily: "Rajdhani, sans-serif" }}
            >
              Your Details
            </h2>
            <div className="flex space-x-4 mb-4">
              {Object.keys(tableData).map((tab) => (
                <Button
                  key={tab}
                  customStyles={`${
                    activeTab === tab ? COLORS.ORANGE_500 : COLORS.ORANGE_100
                  }`}
                  onClick={() => handleTabClick(tab)}
                  text={`${tab} (${tableData[tab].length})`}
                />
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-orange-500 text-white">
                  <tr>
                    {renderTableHeaders().map((header, index) => (
                      <th key={index} className="p-3 text-left">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData[activeTab].map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-orange-100" : ""}
                    >
                      {renderTableRow(item)}
                      <td className="p-3">
                        <Button
                          icon={activeTab === "Draft" ? Edit : TrackChanges}
                          bgColor={COLORS.ORANGE_500}
                          // onClick={handleChangeAgent}
                          text={activeTab === "Draft" ? "Edit" : "Track Order"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
