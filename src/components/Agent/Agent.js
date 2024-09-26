import { Avatar } from "@mui/material";
import React, { useState } from "react";

// Mock data for agents
const agents = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St",
    city: "Anytown",
    state: "CA",
    zip: "12345",
    ordersDelivered: 150,
    rating: 4.8,
    photo: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 987-6543",
    address: "456 Elm St",
    city: "Somewhere",
    state: "NY",
    zip: "67890",
    ordersDelivered: 120,
    rating: 4.7,
    photo: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    phone: "(555) 246-8135",
    address: "789 Oak St",
    city: "Elsewhere",
    state: "TX",
    zip: "54321",
    ordersDelivered: 200,
    rating: 4.9,
    photo: "/placeholder.svg?height=200&width=200",
  },
];

export default function Agent() {
  const [selectedAgent, setSelectedAgent] = useState(null);

  const handleConnect = (agent) => {
    setSelectedAgent(agent);
  };

  const handleChangeAgent = () => {
    setSelectedAgent(null);
  };

  if (selectedAgent) {
    return (
      <div className="container mx-auto py-8 px-4 ">
        <div className="p-6 bg-white  rounded-lg shadow-md border border-orange-200">
          <div className="flex justify-between items-center mb-6">
            <h1
              className="text-2xl font-bold mb-4 text-orange-800"
              style={{ fontFamily: "Rajdhani, sans-serif" }}
            >
              Agent Details
            </h1>
            <div className="space-x-4">
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300">
                Chat
              </button>
              <button
                onClick={handleChangeAgent}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300"
              >
                Change Agent
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              {[
                "Name",
                "Email",
                "Phone",
                "Address",
                "City",
                "State",
                "ZIP",
              ].map((field) => (
                <div key={field} className="mb-4">
                  <h3 className="text-lg font-semibold text-orange-700 font-rajdhani">
                    {field}
                  </h3>
                  <p className="text-gray-700 font-poppins">
                    {selectedAgent[field.toLowerCase()]}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center justify-center">
              <Avatar
                sx={{ height: "250px", width: "250px" }}
                src={selectedAgent.photo}
                alt={selectedAgent.name}
                className="w-64 h-64 mb-6 rounded-full border-2 border-orange-300"
              />
              <div>
                <div className="flex items-center justify-start mb-2">
                  <p className="text-lg font-semibold text-orange-700 font-rajdhani mr-2">
                    Orders Placed:
                  </p>
                  <span className="text-lg text-gray-700 font-poppins">
                    {selectedAgent.ordersDelivered}
                  </span>
                </div>
                <div className="flex items-center justify-start mb-2">
                  <p className="text-lg font-semibold text-orange-700 font-rajdhani mr-2">
                    Rating:
                  </p>
                  <span className="text-lg text-gray-700 font-poppins">
                    {selectedAgent.rating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-orange-50">
      <h1
        className="text-2xl font-bold mb-4 text-orange-800"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        Agents List
      </h1>
      <div className="space-y-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md border border-orange-200"
          >
            <div className="flex items-center space-x-4">
              <Avatar
                alt={agent.name}
                src={agent.photo}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <div>
                <h2
                  className="font-semibold text-lg text-orange-800"
                  style={{ fontFamily: "Rajdhani, sans-serif" }}
                >
                  {agent.name}
                </h2>
                <p
                  className="text-sm text-gray-600"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Orders Delivered: {agent.ordersDelivered} | Rating:{" "}
                  {agent.rating}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleConnect(agent)}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
            >
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
