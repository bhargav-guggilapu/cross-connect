import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { getProhibitedItems } from "../services/Api";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

export default function ProhibitedItems() {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [prohibitedItems, setProhibitedItems] = useState([]);

  useEffect(() => {
    const populateProhibitedItems = async () => {
      try {
        const items = await getProhibitedItems();
        setProhibitedItems(items.data);
      } catch (error) {
        console.error("Error fetching prohibited items:", error);
      }
      setLoading(false);
    };

    populateProhibitedItems();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 bg-orange-50">
      <h1
        className="text-2xl font-bold mb-4 text-orange-800"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        Prohibited Items
      </h1>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {prohibitedItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-center bg-white p-4 rounded-lg shadow-md border border-orange-200 h-24 transform transition duration-300 hover:scale-105 hover:shadow-lg hover:border-orange-400 cursor-pointer"
              onClick={() => {
                setSelectedItem(item);
                setIsOpen(true);
              }}
            >
              <p
                className="text-center text-gray-600 font-semibold"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="prohibitedItems"
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
        <DialogTitle id="prohibitedItems_id">
          <span
            className="text-2xl font-bold text-orange-800 mb-4 mt-4"
            style={{ fontFamily: "Rajdhani, sans-serif" }}
          >
            Item Description
          </span>
        </DialogTitle>
        <DialogContent>
          <p
            className="text-center text-gray-600 font-semibold"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {selectedItem.description}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
