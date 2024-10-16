import React, { useEffect, useState } from "react";
import Button from "./Helpers/Button";
import { AGENT_STATUS, COLORS } from "./Constants/Constants";
import { Chat, CheckCircle, Inventory } from "@mui/icons-material";
import ItemDetails from "./ItemDetails";
import { getOrdersByAgent } from "../services/Api";
import Loading from "./Loading";

function AgentDashboard({ user }) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(AGENT_STATUS.ORDERED);
  const [tableData, setTableData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);

      try {
        const ordersData = await getOrdersByAgent(user._id);
        setOrders(ordersData.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
      setIsLoading(false);
    };

    fetchUserDetails();
  }, [user]);

  const openDialog = (items) => {
    setSelectedItems(items);
    setIsOpen(true);
  };

  const handleInputChange = (customerId, field, value) => {
    setTableData((prevData) => ({
      ...prevData,
      [activeTab]: prevData[activeTab].map((item) =>
        item.customerId === customerId ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleConfirm = (customerId) => {
    setTableData((prevData) => ({
      ...prevData,
      [activeTab]: prevData[activeTab].map((item) =>
        item.customerId === customerId ? { ...item, confirmed: true } : item
      ),
    }));
  };

  const renderTableHeadersAgent = () => {
    switch (activeTab) {
      case AGENT_STATUS.ORDERED:
        return ["Customer ID", "Name", "Email", ""];
      case AGENT_STATUS.CONFIRMED:
        return [
          "Customer ID",
          "Name",
          "Email",
          "Items Cost",
          "Weight",
          "Shipping Cost",
          "",
        ];
      case AGENT_STATUS.SHIPPED:
      case AGENT_STATUS.COMPLETED:
        return [
          "Customer ID",
          "Name",
          "Email",
          "Items Cost",
          "Weight",
          "Shipping Cost",
          "Tracking ID",
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
            <td className="p-3">{item.customer._id}</td>
            <td className="p-3">{`${item.customer.firstName} ${item.customer.lastName}`}</td>
            <td className="p-3">{item.customer.email}</td>
          </>
        );
      case AGENT_STATUS.CONFIRMED:
        return (
          <>
            <td className="p-3">{item.customer._id}</td>
            <td className="p-3">{`${item.customer.firstName} ${item.customer.lastName}`}</td>
            <td className="p-3">{item.customer.email}</td>
            <td className="p-3">₹ {item.itemsCost}</td>
            <td className="p-3">
              <div className="relative max-w-28">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <input
                  type="number"
                  name="shippingCost"
                  placeholder="Shipping Cost"
                  className={`w-full pr-6 pl-2 py-2 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                    item.confirmed && "cursor-not-allowed"
                  }`}
                  value={item?.shippingCost}
                  onChange={(e) =>
                    handleInputChange(
                      item.customerId,
                      "shippingCost",
                      e.target.value
                    )
                  }
                  aria-label="Shipping Cost in Rupees"
                  disabled={item.confirmed}
                />
              </div>
            </td>
            <td className="p-3">
              <div className="relative max-w-28">
                <input
                  type="number"
                  name="weight"
                  placeholder="Weight"
                  className={`w-full pl-6 pr-2 py-2 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                    item.confirmed && "cursor-not-allowed"
                  }`}
                  value={item.packageWeight}
                  onChange={(e) =>
                    handleInputChange(item.customerId, "weight", e.target.value)
                  }
                  disabled={item.confirmed}
                  aria-label="Weight in KGs"
                />

                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                  KG
                </span>
              </div>
            </td>
          </>
        );
      case AGENT_STATUS.SHIPPED:
        return (
          <>
            <td className="p-3">{item.customer._id}</td>
            <td className="p-3">{`${item.customer.firstName} ${item.customer.lastName}`}</td>
            <td className="p-3">{item.customer.email}</td>
            <td className="p-3">₹ {item.itemsCost}</td>
            <td className="p-3">{item.packageWeight} KG</td>
            <td className="p-3">₹ {item.shippingCost}</td>
            <td className="p-3">
              <input
                type="text"
                name="tr"
                placeholder="Tracking ID"
                className={`w-full p-2 pr-8 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                  item.confirmed && "cursor-not-allowed"
                }`}
                value={item.trackingId}
                onChange={(e) =>
                  handleInputChange(
                    item.customerId,
                    "trackingId",
                    e.target.value
                  )
                }
                disabled={item.confirmed}
                aria-label="Tracking ID"
              />
            </td>
          </>
        );
      case AGENT_STATUS.COMPLETED:
        return (
          <>
            <td className="p-3">{item.customer._id}</td>
            <td className="p-3">{`${item.customer.firstName} ${item.customer.lastName}`}</td>
            <td className="p-3">{item.customer.email}</td>
            <td className="p-3">₹ {item.itemsCost}</td>
            <td className="p-3">{item.packageWeight} KG</td>
            <td className="p-3">₹ {item.shippingCost}</td>
            <td className="p-3">{item.trackingId}</td>
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
      <div className="flex space-x-4 mb-4">
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
      <div className="overflow-x-auto">
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
                        activeTab === AGENT_STATUS.CONFIRMED) && (
                        <Button
                          icon={CheckCircle}
                          bgColor={COLORS.GREY_500}
                          onClick={() => handleConfirm(item.customerId)}
                          disabled={item.confirmed}
                          text="Add"
                        />
                      )}
                      <Button
                        icon={Inventory}
                        bgColor={COLORS.ORANGE_500}
                        onClick={() => openDialog(item.items)}
                        text="Items"
                      />
                      <Button
                        icon={Chat}
                        bgColor={COLORS.GREEN_600}
                        // onClick={handleChangeAgent}
                        text="Chat"
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <ItemDetails
        isOpen={isOpen}
        selectedItems={selectedItems}
        setIsOpen={setIsOpen}
        enableUpdate={activeTab === AGENT_STATUS.ORDERED}
      />
    </div>
  );
}

export default AgentDashboard;
