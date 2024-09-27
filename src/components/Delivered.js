import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Inventory } from "@mui/icons-material";

const deliveries = [
  {
    id: 1,
    trackingId: "TRK001",
    deliveredDate: "2024-09-25",
    amount: 150.0,
    weight: 30,
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
  },
  {
    id: 2,
    trackingId: "TRK002",
    deliveredDate: "2024-09-26",
    amount: 75.5,
    weight: 32.342,
    items: [
      {
        name: "Apples",
        description: "Fresh Red Apples, 1kg",
        quantity: 5,
        storeName: "Whole Foods",
      },
      {
        name: "Milk",
        description: "Organic Whole Milk, 1 gallon",
        quantity: 2,
        storeName: "Trader Joe's",
      },
    ],
  },
  {
    id: 3,
    trackingId: "TRK003",
    deliveredDate: "2024-09-27",
    amount: 200.0,
    weight: 23.4,
    items: [
      {
        name: "Laptop",
        description: "15-inch display, Intel i7, 16GB RAM",
        quantity: 1,
        storeName: "Best Buy",
      },
      {
        name: "Smartphone",
        description: "5G, 128GB storage, OLED display",
        quantity: 2,
        storeName: "Apple Store",
      },
    ],
  },
];

export default function Delivered() {
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
        className="text-2xl font-bold text-orange-800 mb-8"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        Orders Delivered
      </h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="p-3 text-left">Tracking ID</th>
              <th className="p-3 text-left">Delivered date</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Weight (KG)</th>
              <th className="p-3 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((item, index) => (
              <tr
                key={item.id}
                className={index % 2 === 0 ? "bg-orange-100" : ""}
              >
                <td className="p-3">{item.trackingId}</td>
                <td className="p-3">{item.deliveredDate}</td>
                <td className="p-3">{item.amount.toFixed(2)}</td>
                <td className="p-3">{item.weight.toFixed(2)}</td>
                <td className="p-3">
                  <button
                    onClick={() => openDialog(item.items)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 flex items-center"
                  >
                    <Inventory className="mr-2" /> Items
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="delivered-items"
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
            Delivered Items
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
                    key={item.id}
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
            onClick={handleClose}
            style={{
              backgroundColor: "#f39c12",
              marginRight: "15px",
              marginBottom: "16px",
              color: "white",
              "&:hover": {
                backgroundColor: "#e67e22",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
