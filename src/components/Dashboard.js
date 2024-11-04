import React, { useEffect, useState } from "react";
import {
  Chat,
  ContentCopy,
  Inventory,
  Search,
  TrackChanges,
} from "@mui/icons-material";
import Button from "./Helpers/Button";
import {
  ALERTS,
  COLORS,
  CUSTOMER_STATUS,
  ORDER_STATUS,
  ROLES,
} from "./Constants/Constants";
import AgentDashboard from "./AgentDashboard";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "./Helpers/SnackbarContext";
import { getOrder } from "../services/Api";
import Loading from "./Loading";
import ItemDetails from "./ItemDetails";
import CurrencyToggle from "./Helpers/CurrencyToggle";
import { convertCurrency, getCurrencySymbol } from "./Helpers/staticFunctions";
import ChatModal from "./ChatModel";

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(CUSTOMER_STATUS.DELIVERED);
  const [localDate, setLocalDate] = useState(new Date());
  const [orders, setOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currency, setCurrency] = useState("INR");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

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
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const order = await getOrder({
          customer: user._id,
          orderStatus: ORDER_STATUS.ACTIVE,
        });
        setOrders(order.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
      setIsLoading(false);
    };

    fetchOrders();

    const intervalId = setInterval(() => {
      setLocalDate((prevTime) => {
        const newTime = new Date(prevTime);
        newTime.setMinutes(newTime.getMinutes() + 1);
        return newTime;
      });
    }, 60000);

    return () => clearInterval(intervalId);
  }, [user]);

  const getLength = (tab) => {
    return orders.filter((order) => {
      if (order.customerStatus === CUSTOMER_STATUS.IN_PROGRESS) {
        return order.inProgressStatus === tab;
      }
      return order.customerStatus === tab;
    }).length;
  };

  const handleCopyClick = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      showSnackbar(`${field} copied to clipboard`, ALERTS.SUCCESS);
    });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderTableHeaders = () => {
    switch (activeTab) {
      case CUSTOMER_STATUS.DELIVERED:
        return [
          "Order Id",
          "Zip Code",
          "Agent Name",
          "Delivered Date",
          "Items Cost",
          "Shipping Cost",
          "Package Weight",
          "",
        ];
      case CUSTOMER_STATUS.SHIPPED:
        return [
          "Order Id",
          "Zip Code",
          "Agent Name",
          "Items Cost",
          "Shipping Cost",
          "Package Weight",
          "",
        ];
      default:
        return [];
    }
  };

  const renderTableRow = (item) => {
    switch (activeTab) {
      case CUSTOMER_STATUS.DELIVERED:
        return (
          <>
            <td className="p-3">{item._id}</td>
            <td className="p-3">{item.agent.address.zipCode}</td>
            <td className="p-3">{`${item.agent.firstName} ${item.agent.lastName}`}</td>
            <td className="p-3">{item.deliveredDate}</td>
            <td className="p-3">{`${getCurrencySymbol(
              currency
            )} ${convertCurrency(currency, item.itemsCost)}`}</td>
            <td className="p-3">{`${getCurrencySymbol(
              currency
            )} ${convertCurrency(currency, item.shippingCost)}`}</td>
            <td className="p-3">{item.packageWeight} KG(s)</td>
          </>
        );
      case CUSTOMER_STATUS.SHIPPED:
        return (
          <>
            <td className="p-3">{item._id}</td>
            <td className="p-3">{item.agent.address.zipCode}</td>
            <td className="p-3">{`${item.agent.firstName} ${item.agent.lastName}`}</td>
            <td className="p-3">{`${getCurrencySymbol(
              currency
            )} ${convertCurrency(currency, item.itemsCost)}`}</td>
            <td className="p-3">{`${getCurrencySymbol(
              currency
            )} ${convertCurrency(currency, item.shippingCost)}`}</td>
            <td className="p-3">{item.packageWeight} KG(s)</td>
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

  const openDialog = (order) => {
    setSelectedOrder(order);
    setIsOpen(true);
  };

  const onTrackingHandle = (trackingId) => {
    window.open(`https://www.fedex.com/fedextrack?trknbr=${trackingId}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex-1 overflow-auto p-6 bg-orange-50">
      <h1
        className="text-2xl font-bold mb-4 text-orange-800"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        Dashboard
      </h1>

      {user.role === ROLES.AGENT ? (
        <AgentDashboard user={user} />
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
                    onClick={() => setIsChatOpen(true)}
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
                          handleCopyClick(agentData[toCamelCase(field)], field)
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
                          handleCopyClick(agentData[toCamelCase(field)], field)
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
                          handleCopyClick(agentData[toCamelCase(field)], field)
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
                  Find an agent at zip code:{" "}
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
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-4">
                {[CUSTOMER_STATUS.DELIVERED, CUSTOMER_STATUS.SHIPPED].map(
                  (tab) => (
                    <Button
                      key={tab}
                      customStyles={`${
                        activeTab === tab
                          ? COLORS.ORANGE_500
                          : COLORS.ORANGE_100
                      }`}
                      onClick={() => handleTabClick(tab)}
                      text={`${tab} (${getLength(tab)})`}
                    />
                  )
                )}
              </div>
              <CurrencyToggle currency={currency} setCurrency={setCurrency} />
            </div>

            <div className="overflow-x-auto">
              {orders.filter((order) => {
                if (order.customerStatus === CUSTOMER_STATUS.IN_PROGRESS) {
                  return order.inProgressStatus === activeTab;
                }
                return order.customerStatus === activeTab;
              }).length > 0 ? (
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
                    {orders
                      .filter((order) => {
                        if (
                          order.customerStatus === CUSTOMER_STATUS.IN_PROGRESS
                        ) {
                          return order.inProgressStatus === activeTab;
                        }
                        return order.customerStatus === activeTab;
                      })
                      .map((item, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? "bg-orange-100" : ""}
                        >
                          {renderTableRow(item)}
                          <td className="p-3">
                            <div className="flex justify-center items-center space-x-5">
                              {(activeTab === CUSTOMER_STATUS.DELIVERED ||
                                activeTab === CUSTOMER_STATUS.SHIPPED) && (
                                <Button
                                  icon={Inventory}
                                  bgColor={COLORS.ORANGE_500}
                                  onClick={() => openDialog(item)}
                                  text="Items"
                                />
                              )}

                              {activeTab === CUSTOMER_STATUS.SHIPPED && (
                                <Button
                                  icon={TrackChanges}
                                  bgColor={COLORS.GREEN_600}
                                  onClick={() =>
                                    onTrackingHandle(item.trackingId)
                                  }
                                  text="Track Order"
                                />
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <div className="mb-6 p-6 bg-white rounded-lg shadow-md border border-orange-200">
                  <div className="flex flex-col justify-center items-center">
                    <h2 className="text-xl">
                      Your {activeTab} section is empty
                    </h2>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <ItemDetails
        isOpen={isOpen}
        selectedOrder={selectedOrder}
        setIsOpen={setIsOpen}
      />
      {isChatOpen && (
        <ChatModal
          receiverDetails={user.selectedAgent}
          senderId={user._id}
          isAgent={false}
          isOpen={isChatOpen}
          setIsOpen={setIsChatOpen}
        />
      )}
    </div>
  );
}
