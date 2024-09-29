import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Button from "./Helpers/Button";
import { Inventory, Payment, TrackChanges } from "@mui/icons-material";
import { COLORS } from "./Constants/Colors";

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
    id: 1432,
    orderId: "1432",
    description:
      "Agent confirmed your order, will let you know the items cost estimate in short period.",
    currentStep: 2,
    items: [
      {
        name: "T-shirt",
        description: "Cotton, size L, white",
        quantity: 3,
        storeName: "H&M",
      },
      {
        name: "Jeans",
        description: "Denim, size 32, slim fit",
        quantity: 1,
        storeName: "Levi's",
      },
    ],
    orderDetails: {},
  },
  {
    id: 343543,
    orderId: "343543",
    description: "",
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
    orderDetails: { itemsCost: 50 },
  },
  {
    id: 343543,
    orderId: "343543",
    description:
      "Agent gathering items, will let you know the shipping cost estimate in short period.",
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
    orderDetails: {},
  },
  {
    id: 4545,
    orderId: "4545",
    description: "Waiting for Agent to confirm on your order.",
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
    orderDetails: { packageWeight: "2.5", shippingCost: "70" },
  },
  {
    id: 984374,
    orderId: "984374",
    description: "",
    currentStep: 6,
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

const ProgressIndicator = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center space-x-4 mt-6">
      {[1, 2, 3, 4, 5, 6].map((step) => (
        <div
          key={step}
          className={`px-4 py-2 rounded-full text-sm font-medium
            ${
              step === currentStep
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
        >
          Step {step}
        </div>
      ))}
    </div>
  );
};

export default function InProgress() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const openDialog = (items) => {
    setSelectedItems(items);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="p-6 bg-orange-50">
      <h1
        className="text-2xl font-bold mb-4 text-orange-800"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        In progress
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
              {[3, 5].includes(item.currentStep) && (
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
            {![3, 5, 6].includes(item.currentStep) && (
              <p className="text-lg text-gray-700 mb-10 text-center">
                {item.description}
              </p>
            )}
            {item.currentStep === 3 && (
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
            {item.currentStep === 5 && (
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
            {item.currentStep === 6 && (
              <div className="text-lg text-gray-700 mb-10 text-center">
                <p>
                  Your package has been shipped, your tracking id is{" "}
                  <span className="bg-orange-500 font-bold text-white px-3 py-1 rounded-full text-sm mr-2 cursor-pointer">
                    {item.orderDetails.trackingId}
                  </span>
                </p>
              </div>
            )}
            <ProgressIndicator currentStep={item.currentStep} />
          </div>
        </div>
      ))}

      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="in-progress-items"
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
        <DialogTitle id="dialog-title">
          <h1
            className="text-2xl font-bold text-orange-800 mb-4 mt-4"
            style={{ fontFamily: "Rajdhani, sans-serif" }}
          >
            In Progress Items
          </h1>
        </DialogTitle>
        <DialogContent>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-orange-500 text-white">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Quantity</th>
                  <th className="p-3 text-left">Store Name</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-orange-100" : ""}
                  >
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.description}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3">{item.storeName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            bgColor={COLORS.GREY_500}
            customStyles="mr-4 mb-4"
            onClick={handleClose}
            text="Close"
          />
        </DialogActions>
      </Dialog>
    </div>
  );
}
