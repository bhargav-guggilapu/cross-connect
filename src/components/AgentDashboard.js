import React, { useEffect, useState } from "react";
import Button from "./Helpers/Button";
import {
  AGENT_STATUS,
  ALERTS,
  COLORS,
  IN_PROGRESS_STATUS,
} from "./Constants/Constants";
import { Chat, CheckCircle, Close, Inventory } from "@mui/icons-material";
import ItemDetails from "./ItemDetails";
import { getOrdersByAgent, sendEmail, updateOrder } from "../services/Api";
import Loading from "./Loading";
import { useSnackbar } from "./Helpers/SnackbarContext";
import CurrencyToggle from "./Helpers/CurrencyToggle";
import { convertCurrency, getCurrencySymbol } from "./Helpers/staticFunctions";
import ChatModal from "./ChatModel";
import {
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";

function AgentDashboard({ user }) {
  const showSnackbar = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(AGENT_STATUS.ORDERED);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [currency, setCurrency] = useState("INR");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const fetchOrdersAsync = async () => {
      setIsLoading(true);

      try {
        const ordersData = await getOrdersByAgent(user._id);
        setOrders(ordersData.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
      setIsLoading(false);
    };

    fetchOrdersAsync();
  }, [user]);

  const fetchOrders = async () => {
    setIsLoading(true);

    try {
      const ordersData = await getOrdersByAgent(user._id);
      setOrders(ordersData.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
    setIsLoading(false);
  };

  const openDialog = (order) => {
    setSelectedOrder(order);
    setIsOpen(true);
  };

  const handleInputChange = (id, field, value) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === id ? { ...order, [field]: value } : order
      )
    );
  };

  const handleConfirm = async (order) => {
    if (activeTab === AGENT_STATUS.CONFIRMED) {
      if (!order.shippingCost || !order.packageWeight) {
        showSnackbar(
          "Please fill in the shipping cost and package weight.",
          ALERTS.ERROR
        );
        return;
      }

      if (order.shippingCost < 0 || order.packageWeight < 0) {
        showSnackbar(
          "Shipping cost and Package weight should be greater than 0",
          ALERTS.ERROR
        );
        return;
      }
    }

    if (activeTab === AGENT_STATUS.SHIPPED) {
      if (!order.trackingId) {
        showSnackbar("Please fill in the tracking ID.", ALERTS.ERROR);
        return;
      }
    }

    setIsLoading(true);

    await updateOrder(
      {
        ...order,
        inProgressStatus:
          order.inProgressStatus === IN_PROGRESS_STATUS.ORDER_SHIPPED
            ? IN_PROGRESS_STATUS.SHIPPED
            : IN_PROGRESS_STATUS.SHIPPING_ESTIMATE,
      },
      { _id: order._id }
    );

    fetchOrders();

    await sendEmail(
      order.customer.email,
      "Order Status Update",
      `
        <h3>Dear ${order.customer.firstName},</h3>
        <p>We wanted to update you on your order's status:</p>
        <p>Order Status: <strong>${
          order.inProgressStatus === IN_PROGRESS_STATUS.ORDER_SHIPPED
            ? "SHIPPED ORDER"
            : "ESTIMATING SHIPPING COST"
        }</strong></p>
        <p>Order Details:</p>
        <ul>
            ${order.items
              .map(
                (item) => `
                <li><strong>${item.name}</strong>: ${item.quantity} ${item.unit}</li>
            `
              )
              .join("")}
        </ul>
        
        ${
          order.inProgressStatus === IN_PROGRESS_STATUS.ORDER_SHIPPED
            ? "<p>Thank you for your patience. We'll keep you updated as your order progresses.</p>"
            : "<p>Please login to your account and pay now to proceed to next steps.</p>"
        }
        <p>Thank you,<br>Cross Connect</p>
    `
    );

    setIsLoading(false);
  };

  const formatAndUpdateCustomerDetails = (item) => {
    setSelectedCustomer({
      id: item.customer._id,
      name: item.customer.firstName + " " + item.customer.lastName,
      email: item.customer.email,
      phone: item.customer.phoneNumber,
      address: `${item.customer.address?.addressLine1} ${
        item.customer.address?.addressLine2
          ? ", " + item.customer.address?.addressLine2
          : ""
      }`,
      city: item.customer.address?.city,
      state: item.customer.address?.state,
      zip: item.customer.address?.zipCode,
      photo: item.customer.photo,
    });
  };

  const renderTableHeadersAgent = () => {
    switch (activeTab) {
      case AGENT_STATUS.ORDERED:
        return ["Order ID", "Customer Name", "Customer Email", ""];
      case AGENT_STATUS.CONFIRMED:
        return [
          "Order ID",
          "Customer Name",
          "Items Cost",
          "Shipping Cost",
          "Weight",
          "",
        ];
      case AGENT_STATUS.SHIPPED:
        return [
          "Order ID",
          "Customer Name",
          "Items Cost",
          "Shipping Cost",
          "Weight",
          "Tracking ID",
          "",
        ];
      case AGENT_STATUS.COMPLETED:
        return [
          "Order ID",
          "Customer Name",
          "Items Cost",
          "Shipping Cost",
          "Weight",
          "Tracking ID",
          "Revenue",
          "",
        ];
      default:
        return [];
    }
  };

  const renderTableRowAgent = (item) => {
    switch (activeTab) {
      case AGENT_STATUS.ORDERED:
        return (
          <>
            <td className="p-3">{item._id}</td>
            <td
              className="p-3 cursor-pointer underline"
              onClick={() => formatAndUpdateCustomerDetails(item)}
            >{`${item.customer.firstName} ${item.customer.lastName}`}</td>
            <td className="p-3">{item.customer.email}</td>
          </>
        );
      case AGENT_STATUS.CONFIRMED:
        return (
          <>
            <td className="p-3">{item._id}</td>
            <td
              className="p-3 cursor-pointer underline"
              onClick={() => formatAndUpdateCustomerDetails(item)}
            >{`${item.customer.firstName} ${item.customer.lastName}`}</td>
            <td className="p-3">
              {`${getCurrencySymbol(currency)} ${convertCurrency(
                currency,
                item.itemsCost
              )}`}
            </td>
            <td className="p-3">
              {item.inProgressStatus !==
              IN_PROGRESS_STATUS.SHIPPING_ESTIMATE ? (
                <div className="relative max-w-28">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="shippingCost"
                    className={`w-full pr-2 pl-5 py-2 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300`}
                    value={item?.shippingCost || 0}
                    onChange={(e) =>
                      handleInputChange(
                        item._id,
                        "shippingCost",
                        e.target.value
                      )
                    }
                    aria-label="Shipping Cost in Rupees"
                  />
                </div>
              ) : (
                `${getCurrencySymbol(currency)} ${convertCurrency(
                  currency,
                  item.shippingCost
                )}`
              )}
            </td>
            <td className="p-3">
              {item.inProgressStatus !==
              IN_PROGRESS_STATUS.SHIPPING_ESTIMATE ? (
                <div className="relative max-w-28">
                  <input
                    type="number"
                    name="packageWeight"
                    className={`w-full pl-2 pr-8 py-2 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300`}
                    value={item?.packageWeight || 0}
                    onChange={(e) =>
                      handleInputChange(
                        item._id,
                        "packageWeight",
                        e.target.value
                      )
                    }
                    aria-label="Weight in KGs"
                  />

                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                    KG
                  </span>
                </div>
              ) : (
                `${item.packageWeight} KG(s)`
              )}
            </td>
          </>
        );
      case AGENT_STATUS.SHIPPED:
        return (
          <>
            <td className="p-3">{item._id}</td>
            <td
              className="p-3 cursor-pointer underline"
              onClick={() => formatAndUpdateCustomerDetails(item)}
            >{`${item.customer.firstName} ${item.customer.lastName}`}</td>
            <td className="p-3">
              {`${getCurrencySymbol(currency)} ${convertCurrency(
                currency,
                item.itemsCost
              )}`}
            </td>
            <td className="p-3">
              {`${getCurrencySymbol(currency)} ${convertCurrency(
                currency,
                item.shippingCost
              )}`}
            </td>
            <td className="p-3">{item.packageWeight} KG(s)</td>
            <td className="p-3">
              {item.inProgressStatus !== IN_PROGRESS_STATUS.SHIPPED ? (
                <input
                  type="text"
                  name="trackingId"
                  className={`w-full p-2 pr-8 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300`}
                  value={item.trackingId || ""}
                  onChange={(e) =>
                    handleInputChange(item._id, "trackingId", e.target.value)
                  }
                  aria-label="Tracking ID"
                />
              ) : (
                item.trackingId
              )}
            </td>
          </>
        );
      case AGENT_STATUS.COMPLETED:
        return (
          <>
            <td className="p-3">{item._id}</td>
            <td
              className="p-3 cursor-pointer underline"
              onClick={() => formatAndUpdateCustomerDetails(item)}
            >{`${item.customer.firstName} ${item.customer.lastName}`}</td>
            <td className="p-3">{`${getCurrencySymbol(
              currency
            )} ${convertCurrency(currency, item.itemsCost)}`}</td>
            <td className="p-3">{`${getCurrencySymbol(
              currency
            )} ${convertCurrency(currency, item.shippingCost)}`}</td>
            <td className="p-3">{item.packageWeight} KG(s)</td>
            <td className="p-3">{item.trackingId}</td>
            <td className="p-3">
              {`${getCurrencySymbol(currency)} ${convertCurrency(
                currency,
                item.itemsCost * 0.05 + (item.tipAmount || 0)
              )}`}
            </td>
          </>
        );
      default:
        return null;
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getLength = (tab) => {
    return orders.filter((order) => order.agentStatus === tab).length;
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-orange-200">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          {[
            AGENT_STATUS.ORDERED,
            AGENT_STATUS.CONFIRMED,
            AGENT_STATUS.SHIPPED,
            AGENT_STATUS.COMPLETED,
          ].map((tab) => (
            <Button
              key={tab}
              customStyles={`${
                activeTab === tab ? COLORS.ORANGE_500 : COLORS.ORANGE_100
              }`}
              onClick={() => handleTabClick(tab)}
              text={`${tab} (${getLength(tab)})`}
            />
          ))}
        </div>
        <CurrencyToggle currency={currency} setCurrency={setCurrency} />
      </div>

      <div className="overflow-x-auto">
        {orders.filter((order) => order.agentStatus === activeTab).length >
        0 ? (
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-orange-500 text-white">
              <tr>
                {renderTableHeadersAgent().map((header, index) => (
                  <th key={index} className="p-3 text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders
                .filter((order) => order.agentStatus === activeTab)
                .map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-orange-100" : ""}
                  >
                    {renderTableRowAgent(item)}
                    <td className="p-3">
                      <div className="flex justify-center items-center space-x-4">
                        {(activeTab === AGENT_STATUS.SHIPPED ||
                          activeTab === AGENT_STATUS.CONFIRMED) &&
                          item.inProgressStatus !==
                            IN_PROGRESS_STATUS.SHIPPING_ESTIMATE &&
                          item.inProgressStatus !==
                            IN_PROGRESS_STATUS.SHIPPED && (
                            <Button
                              icon={CheckCircle}
                              bgColor={COLORS.GREY_500}
                              onClick={() => handleConfirm(item)}
                              text="Add"
                            />
                          )}
                        <Button
                          icon={Inventory}
                          bgColor={COLORS.ORANGE_500}
                          onClick={() => openDialog(item)}
                          text="Items"
                        />
                        {item.agentStatus !== AGENT_STATUS.COMPLETED && (
                          <Button
                            icon={Chat}
                            bgColor={COLORS.GREEN_600}
                            onClick={() => {
                              setSelectedOrder(item);
                              setIsChatOpen(true);
                            }}
                            text="Chat"
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
              <h2 className="text-xl">Your {activeTab} section is empty</h2>
            </div>
          </div>
        )}
      </div>
      <ItemDetails
        isOpen={isOpen}
        selectedOrder={selectedOrder}
        setIsOpen={setIsOpen}
        enableUpdate={activeTab === AGENT_STATUS.ORDERED}
        fetchOrders={fetchOrders}
      />
      {isChatOpen && (
        <ChatModal
          receiverDetails={selectedOrder.customer}
          isAgent={true}
          senderId={user._id}
          isOpen={isChatOpen}
          setIsOpen={setIsChatOpen}
        />
      )}
      {selectedCustomer && (
        <Dialog
          open={!!selectedCustomer}
          onClose={() => {
            setSelectedCustomer(null);
          }}
          aria-labelledby={"customer-details"}
          PaperProps={{
            style: {
              backgroundColor: "#fff8e1",
              borderRadius: "1rem",
              boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)",
              maxWidth: "1000px",
              width: "90%",
            },
          }}
        >
          <DialogTitle id={"customer_details_id"}>
            <span
              className="text-2xl font-bold text-orange-800 mb-4 mt-4"
              style={{ fontFamily: "Rajdhani, sans-serif" }}
            >
              Customer Details
            </span>
            <IconButton
              aria-label="close"
              onClick={() => {
                setSelectedCustomer(null);
              }}
              style={{ position: "absolute", right: 16, top: 10 }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <div className="container mx-auto p-6 ">
              <div className="p-6 bg-white  rounded-lg shadow-md border border-orange-200">
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
                          {selectedCustomer[field.toLowerCase()]}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <Avatar
                      sx={{ height: "250px", width: "250px" }}
                      src={selectedCustomer.photo || "NO IMAGE"}
                      alt={selectedCustomer.name}
                      className="w-64 h-64 mb-6 rounded-full border-2 border-orange-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default AgentDashboard;
