import React, { useState } from "react";
import Button from "./Helpers/Button";
import { Inventory, Payment } from "@mui/icons-material";
import { COLORS } from "./Constants/Constants";
import ItemDetails from "./ItemDetails";
import ProgressIndicator from "./ProgressIndicator";

const inProgressItems = [
  {
    id: 2123,
    orderId: "2123",
    description: "Waiting for Agent to confirm on your order.",
    currentStep: 1,
    items: [
      {
        name: "Laptop",
        description: "15-inch display, Intel i7, 16GB RAM",
        quantity: 1,
        storeName: "Best Buy",
      },
      {
        name: "Mouse",
        description: "Wireless, ergonomic design",
        quantity: 2,
        storeName: "Amazon",
      },
    ],
    orderDetails: {},
  },
  {
    id: 343543,
    orderId: "343543",
    description: "",
    currentStep: 2,
    items: [
      {
        name: "Laptop",
        description: "15-inch display, Intel i7, 16GB RAM",
        quantity: 1,
        storeName: "Best Buy",
      },
      {
        name: "Mouse",
        description: "Wireless, ergonomic design",
        quantity: 2,
        storeName: "Amazon",
      },
    ],
    orderDetails: { itemsCost: 50 },
  },
  {
    id: 343543,
    orderId: "343543",
    description:
      "Agent gathering items, will let you know the shipping cost estimate in short period.",
    currentStep: 3,
    items: [
      {
        name: "Laptop",
        description: "15-inch display, Intel i7, 16GB RAM",
        quantity: 1,
        storeName: "Best Buy",
      },
      {
        name: "Mouse",
        description: "Wireless, ergonomic design",
        quantity: 2,
        storeName: "Amazon",
      },
    ],
    orderDetails: {},
  },
  {
    id: 4545,
    orderId: "4545",
    description: "Waiting for Agent to confirm on your order.",
    currentStep: 4,
    items: [
      {
        name: "Laptop",
        description: "15-inch display, Intel i7, 16GB RAM",
        quantity: 1,
        storeName: "Best Buy",
      },
      {
        name: "Mouse",
        description: "Wireless, ergonomic design",
        quantity: 2,
        storeName: "Amazon",
      },
    ],
    orderDetails: { packageWeight: "2.5", shippingCost: "70" },
  },
  {
    id: 984374,
    orderId: "984374",
    description: "",
    currentStep: 5,
    items: [
      {
        name: "Laptop",
        description: "15-inch display, Intel i7, 16GB RAM",
        quantity: 1,
        storeName: "Best Buy",
      },
      {
        name: "Mouse",
        description: "Wireless, ergonomic design",
        quantity: 2,
        storeName: "Amazon",
      },
    ],
    orderDetails: { trackingId: "3473567347836436" },
  },
];

export default function InProgress() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const openDialog = (items) => {
    setSelectedItems(items);
    setIsOpen(true);
  };

  return (
    <div className="p-6 bg-orange-50">
      <h1
        className="text-2xl font-bold mb-4 text-orange-800"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        In Progress
      </h1>
      {inProgressItems.map((item) => (
        <div
          key={item.id}
          className="mb-6 p-6 bg-white rounded-lg shadow-md border border-orange-200"
        >
          <div className="flex flex-row items-center justify-between mb-4">
            <h3
              className="text-xl font-bold text-orange-800"
              style={{ fontFamily: "Rajdhani, sans-serif" }}
            >
              Order ID:{" "}
              <span className="text-center text-gray-600 font-semibold">
                {item.orderId}
              </span>
            </h3>
            <div className="space-x-4 flex items-center">
              <Button
                icon={Inventory}
                bgColor={COLORS.ORANGE_500}
                onClick={() => openDialog(item.items)}
                text="Items"
              />
              {[2, 4].includes(item.currentStep) && (
                <Button
                  icon={Payment}
                  bgColor={COLORS.GREEN_600}
                  // onClick={handleChangeAgent}
                  text="Pay Now"
                />
              )}
            </div>
          </div>
          <div className="my-6">
            {![2, 4, 5].includes(item.currentStep) && (
              <p className="text-lg text-gray-700 mb-10 text-center">
                {item.description}
              </p>
            )}
            {item.currentStep === 2 && (
              <div className="text-lg text-gray-700 mb-10 text-center">
                <p>
                  Your total items cost is{" "}
                  <span className="text-orange-500">
                    ${item.orderDetails.itemsCost}
                  </span>
                </p>
                <p className="text-gray-500 text-sm mt-5">
                  Pay now to get items
                </p>
              </div>
            )}
            {item.currentStep === 4 && (
              <div className="text-lg text-gray-700 mb-10 text-center">
                <p>
                  Your package weight is{" "}
                  <span className="text-orange-500">
                    {item.orderDetails.packageWeight} KG
                  </span>
                </p>
                <p>
                  Your shipping cost is{" "}
                  <span className="text-orange-500">
                    ${item.orderDetails.shippingCost}
                  </span>
                </p>
                <p className="text-gray-500 text-sm mt-5">
                  Pay now to ship items
                </p>
              </div>
            )}
            {item.currentStep === 5 && (
              <div className="text-lg text-gray-700 mb-10 text-center">
                <p>
                  Your package has been shipped, your tracking id is{" "}
                  <span className="bg-orange-500 font-bold text-white px-3 py-1 rounded-full text-sm mr-2 cursor-pointer">
                    {item.orderDetails.trackingId}
                  </span>
                </p>
              </div>
            )}
            <ProgressIndicator activeStep={item.currentStep} />
          </div>
        </div>
      ))}
      <ItemDetails
        isOpen={isOpen}
        selectedItems={selectedItems}
        setIsOpen={setIsOpen}
        title="In Progress"
      />
    </div>
  );
}
