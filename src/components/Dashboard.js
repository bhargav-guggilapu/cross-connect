import React, { useEffect, useState } from "react";
import { Chat, ContentCopy, Edit, TrackChanges } from "@mui/icons-material";

// Random agent data
const agentData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phoneNumber: "(555) 123-4567",
  addressLine1: "123 Main St",
  city: "Anytown",
  state: "CA",
  zip: "12345",
};

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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Delivered");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

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

  const getIndianTime = (time) => {
    return time
      .toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: true,
        hour: "numeric",
        minute: "numeric",
      })
      .replace("am", "AM")
      .replace("pm", "PM");
  };

  return (
    <div className="flex-1 overflow-auto p-6 bg-orange-50">
      <h1
        className="text-2xl font-bold mb-4 text-orange-800"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        Dashboard
      </h1>

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
              Local time: {getIndianTime(time)}
            </span>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 flex items-center">
              <Chat className="mr-2" /> Chat
            </button>
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
                  onClick={() => handleCopyClick(agentData[toCamelCase(field)])}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {["Address Line 1", "City", "State", "Zip"].map((field) => (
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
                  onClick={() => handleCopyClick(agentData[toCamelCase(field)])}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Details Table */}
      <div className="p-6 bg-white rounded-lg shadow-md border border-orange-200">
        <h2
          className="text-xl font-bold mb-4 text-orange-800"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          Your Details
        </h2>
        <div className="flex space-x-4 mb-4">
          {Object.keys(tableData).map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded transition duration-300 ${
                activeTab === tab
                  ? "bg-orange-500 text-white"
                  : "bg-orange-100 text-orange-800 hover:bg-orange-200"
              }`}
              onClick={() => handleTabClick(tab)}
            >
              {tab} ({tableData[tab].length})
            </button>
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
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 flex items-center">
                      {activeTab === "Draft" ? (
                        <Edit className="mr-2" />
                      ) : (
                        <TrackChanges className="mr-2" />
                      )}{" "}
                      {activeTab === "Draft" ? "Edit" : "Track Order"}{" "}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
