import React, { useState } from "react";
import Button from "./Helpers/Button";
import { Inventory } from "@mui/icons-material";
import { COLORS } from "./Constants/Constants";
import ItemDetails from "./ItemDetails";

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
  const [selectedOrder, setSelectedOrder] = useState(null);

  const openDialog = (order) => {
    setSelectedOrder(order);
    setIsOpen(true);
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
              <th className="p-3 text-left">Weight</th>
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
                <td className="p-3">$ {item.amount.toFixed(2)}</td>
                <td className="p-3">{item.weight.toFixed(2)} KG</td>
                <td className="p-3">
                  <Button
                    icon={Inventory}
                    bgColor={COLORS.ORANGE_500}
                    onClick={() => openDialog(item)}
                    text="Items"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ItemDetails
        isOpen={isOpen}
        selectedOrder={selectedOrder}
        setIsOpen={setIsOpen}
        title="In Progress"
      />
    </div>
  );
}
