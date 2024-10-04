import { Chat, ConnectWithoutContact, SwapHoriz } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import Button from "./Helpers/Button";
import { COLORS } from "./Constants/Constants";
import { getAgentsByZipCode, updateUser } from "../services/Api";
import Loading from "./Loading";

const formatAgentDetails = (givenUser) => {
  return {
    id: givenUser._id,
    name: givenUser.firstName + " " + givenUser.lastName,
    email: givenUser.email,
    phone: givenUser.phoneNumber,
    address: `${givenUser.address?.addressLine1} ${
      givenUser.address?.addressLine2
        ? ", " + givenUser.address?.addressLine2
        : ""
    }`,
    city: givenUser.address?.city,
    state: givenUser.address?.state,
    zip: givenUser.address?.zipCode,
    ordersDelivered: givenUser.ordersDelivered || "XXX",
    rating: givenUser.rating || "XXX",
    photo: givenUser.photo,
  };
};

export default function Agent({ user, setUser }) {
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(
    user.selectedAgent ? formatAgentDetails(user.selectedAgent) : null
  );
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const populateAgents = async () => {
      try {
        const userDetails = await getAgentsByZipCode(user.zipCode);
        setAgents(
          userDetails.data.map((user) => {
            return formatAgentDetails(user);
          })
        );
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
      setLoading(false);
    };

    if (!selectedAgent) {
      populateAgents();
    } else {
      setLoading(false);
    }
  }, [user, selectedAgent]);

  const handleConnect = async (agent) => {
    setLoading(true);
    const updatedUser = await updateUser({
      ...user,
      selectedAgent: agent.id,
    });
    setUser(updatedUser.data);
    setSelectedAgent(formatAgentDetails(updatedUser.data.selectedAgent));
    setLoading(false);
  };

  const handleChangeAgent = async () => {
    setLoading(true);
    const updatedUser = await updateUser({
      ...user,
      selectedAgent: null,
    });
    setUser(updatedUser.data);
    setSelectedAgent(null);
    setLoading(false);
  };

  if (loading) {
    return <Loading />;
  }

  if (selectedAgent) {
    return (
      <div className="container mx-auto py-8 px-4 ">
        <div className="p-6 bg-white  rounded-lg shadow-md border border-orange-200">
          <div className="flex justify-between items-center mb-6">
            <h1
              className="text-2xl font-bold text-orange-800"
              style={{ fontFamily: "Rajdhani, sans-serif" }}
            >
              Agent Details
            </h1>
            <div className="space-x-4 flex items-center">
              <Button
                icon={Chat}
                bgColor={COLORS.GREEN_600}
                // onClick={handleChangeAgent}
                text="Chat"
              />
              <Button
                icon={SwapHoriz}
                bgColor={COLORS.ORANGE_500}
                onClick={handleChangeAgent}
                text="Change Agent"
              />
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
        {agents.length > 0 ? (
          agents.map((agent) => (
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
              <Button
                icon={ConnectWithoutContact}
                bgColor={COLORS.ORANGE_500}
                onClick={() => handleConnect(agent)}
                text="Connect"
              />
            </div>
          ))
        ) : (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-md border border-orange-200">
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-xl mb-4">
                No agents found near zip code:{" "}
                <span className="text-orange-800">{user.zipCode}</span>
              </h2>
              <h2 className="text-gray-500">Please try different zip code</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
