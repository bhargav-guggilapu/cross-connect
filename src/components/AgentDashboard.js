import React, { useState } from "react";
import Button from "./Helpers/Button";
import { COLORS } from "./Constants/Constants";
import { Chat, CheckCircle, Inventory } from "@mui/icons-material";
import ItemDetails from "./ItemDetails";

const tableDataAgent = {
  Orders: [
    {
      customerId: 101,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      items: [
        {
          name: "Smartphone",
          description: "Latest model with 128GB storage",
          quantity: 1,
          storeName: "Apple Store",
          cost: 40,
        },
        {
          name: "Charger",
          description: "Fast charging USB-C charger",
          quantity: 1,
          storeName: "Best Buy",
          cost: 20.43,
        },
      ],
      status: "Orders",
    },
    {
      customerId: 102,
      name: "Bob Smith",
      email: "bob.smith@example.com",
      items: [
        {
          name: "Headphones",
          description: "Noise-cancelling over-ear headphones",
          quantity: 1,
          storeName: "Amazon",
          cost: 54.43,
        },
        {
          name: "Laptop Stand",
          description: "Adjustable aluminum laptop stand",
          quantity: 1,
          storeName: "eBay",
          cost: 45.45,
        },
      ],
      status: "Orders",
    },
    {
      customerId: 103,
      name: "Charlie Brown",
      email: "charlie.brown@example.com",
      items: [
        {
          name: "Tablet",
          description: "10-inch display, 64GB storage",
          quantity: 1,
          storeName: "Walmart",
          cost: 98.34,
        },
        {
          name: "Bluetooth Keyboard",
          description: "Compact wireless keyboard",
          quantity: 1,
          storeName: "Target",
          cost: 4,
        },
      ],
      status: "Orders",
    },
  ],
  Shippings: [
    {
      customerId: 101,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      itemsCost: "30",
      weight: "2.5",
      shippingCost: "55",
      items: [
        {
          name: "Smartphone",
          description: "Latest model with 128GB storage",
          quantity: 1,
          storeName: "Apple Store",
        },
        {
          name: "Charger",
          description: "Fast charging USB-C charger",
          quantity: 1,
          storeName: "Best Buy",
        },
      ],
      status: "Shippings",
      confirmed: false,
    },
    {
      customerId: 102,
      name: "Bob Smith",
      email: "bob.smith@example.com",
      itemsCost: "45",
      weight: "3.0",
      shippingCost: "70",
      items: [
        {
          name: "Headphones",
          description: "Noise-cancelling over-ear headphones",
          quantity: 1,
          storeName: "Amazon",
        },
        {
          name: "Laptop Stand",
          description: "Adjustable aluminum laptop stand",
          quantity: 1,
          storeName: "eBay",
        },
      ],
      status: "Shippings",
      confirmed: false,
    },
    {
      customerId: 103,
      name: "Charlie Brown",
      email: "charlie.brown@example.com",
      itemsCost: "34",
      weight: "1.0",
      shippingCost: "40",
      items: [
        {
          name: "Tablet",
          description: "10-inch display, 64GB storage",
          quantity: 1,
          storeName: "Walmart",
          cost: 98.34,
        },
        {
          name: "Bluetooth Keyboard",
          description: "Compact wireless keyboard",
          quantity: 1,
          storeName: "Target",
          cost: 4,
        },
      ],
      status: "Shippings",
      confirmed: false,
    },
  ],
  Confirm: [
    {
      customerId: 101,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      itemsCost: "30",
      weight: "2.5",
      shippingCost: "55",
      trackingId: "343434334",
      items: [
        {
          name: "Smartphone",
          description: "Latest model with 128GB storage",
          quantity: 1,
          storeName: "Apple Store",
        },
        {
          name: "Charger",
          description: "Fast charging USB-C charger",
          quantity: 1,
          storeName: "Best Buy",
        },
      ],
      status: "Shippings",
      confirmed: false,
    },
    {
      customerId: 102,
      name: "Bob Smith",
      email: "bob.smith@example.com",
      itemsCost: "45",
      weight: "3.0",
      shippingCost: "70",
      trackingId: "74637864783648368",
      items: [
        {
          name: "Headphones",
          description: "Noise-cancelling over-ear headphones",
          quantity: 1,
          storeName: "Amazon",
        },
        {
          name: "Laptop Stand",
          description: "Adjustable aluminum laptop stand",
          quantity: 1,
          storeName: "eBay",
        },
      ],
      status: "Shippings",
      confirmed: false,
    },
    {
      customerId: 103,
      name: "Charlie Brown",
      email: "charlie.brown@example.com",
      itemsCost: "34",
      weight: "1.0",
      shippingCost: "40",
      trackingId: "74637864783648368",
      items: [
        {
          name: "Tablet",
          description: "10-inch display, 64GB storage",
          quantity: 1,
          storeName: "Walmart",
          cost: 98.34,
        },
        {
          name: "Bluetooth Keyboard",
          description: "Compact wireless keyboard",
          quantity: 1,
          storeName: "Target",
          cost: 4,
        },
      ],
      status: "Shippings",
      confirmed: false,
    },
  ],
  Completed: [
    {
      customerId: 101,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      itemsCost: "30",
      weight: "2.5",
      shippingCost: "55",
      trackingId: "343434334",
      items: [
        {
          name: "Smartphone",
          description: "Latest model with 128GB storage",
          quantity: 1,
          storeName: "Apple Store",
        },
        {
          name: "Charger",
          description: "Fast charging USB-C charger",
          quantity: 1,
          storeName: "Best Buy",
        },
      ],
      status: "Shippings",
      confirmed: false,
    },
    {
      customerId: 102,
      name: "Bob Smith",
      email: "bob.smith@example.com",
      itemsCost: "45",
      weight: "3.0",
      shippingCost: "70",
      trackingId: "74637864783648368",
      items: [
        {
          name: "Headphones",
          description: "Noise-cancelling over-ear headphones",
          quantity: 1,
          storeName: "Amazon",
        },
        {
          name: "Laptop Stand",
          description: "Adjustable aluminum laptop stand",
          quantity: 1,
          storeName: "eBay",
        },
      ],
      status: "Shippings",
      confirmed: false,
    },
    {
      customerId: 103,
      name: "Charlie Brown",
      email: "charlie.brown@example.com",
      itemsCost: "34",
      weight: "1.0",
      shippingCost: "40",
      trackingId: "74637864783648368",
      items: [
        {
          name: "Tablet",
          description: "10-inch display, 64GB storage",
          quantity: 1,
          storeName: "Walmart",
        },
        {
          name: "Bluetooth Keyboard",
          description: "Compact wireless keyboard",
          quantity: 1,
          storeName: "Target",
        },
      ],
      status: "Shippings",
      confirmed: false,
    },
  ],
};

function AgentDashboard() {
  const [activeTab, setActiveTab] = useState("Orders");
  const [tableData, setTableData] = useState(tableDataAgent);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

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
      case "Orders":
        return ["Customer ID", "Name", "Email", ""];
      case "Shippings":
        return [
          "Customer ID",
          "Name",
          "Email",
          "Items Cost",
          "Weight",
          "Shipping Cost",
          "",
        ];
      case "Confirm":
      case "Completed":
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
      case "Orders":
        return (
          <>
            <td className="p-3">{item.customerId}</td>
            <td className="p-3">{item.name}</td>
            <td className="p-3">{item.email}</td>
          </>
        );
      case "Shippings":
        return (
          <>
            <td className="p-3">{item.customerId}</td>
            <td className="p-3">{item.name}</td>
            <td className="p-3">{item.email}</td>
            <td className="p-3">₹ {item.itemsCost}</td>
            <td className="p-3">
              <div className="relative max-w-28">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <input
                  type="number"
                  name="weight"
                  placeholder="Weight"
                  className={`w-full pl-6 pr-2 py-2 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                    item.confirmed && "cursor-not-allowed"
                  }`}
                  value={item.weight}
                  onChange={(e) =>
                    handleInputChange(item.customerId, "weight", e.target.value)
                  }
                  disabled={item.confirmed}
                  aria-label="Weight in KGs"
                />
              </div>
            </td>
            <td className="p-3">
              <div className="relative max-w-28">
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
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                  KG
                </span>
              </div>
            </td>
          </>
        );
      case "Confirm":
        return (
          <>
            <td className="p-3">{item.customerId}</td>
            <td className="p-3">{item.name}</td>
            <td className="p-3">{item.email}</td>
            <td className="p-3">₹ {item.itemsCost}</td>
            <td className="p-3">{item.weight} KG</td>
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
      case "Completed":
        return (
          <>
            <td className="p-3">{item.customerId}</td>
            <td className="p-3">{item.name}</td>
            <td className="p-3">{item.email}</td>
            <td className="p-3">₹ {item.itemsCost}</td>
            <td className="p-3">{item.weight} KG</td>
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

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-orange-200">
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
              {renderTableHeadersAgent().map((header, index) => (
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
                {renderTableRowAgent(item)}
                <td className="p-3">
                  <div className="flex justify-center align-middle space-x-4">
                    {(activeTab === "Shippings" || activeTab === "Confirm") && (
                      <Button
                        icon={CheckCircle}
                        bgColor={COLORS.GREY_500}
                        onClick={() => handleConfirm(item.customerId)}
                        disabled={item.confirmed}
                        text="Confirm"
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
        enableUpdate={activeTab === "Orders"}
      />
    </div>
  );
}

export default AgentDashboard;
