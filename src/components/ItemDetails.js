import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import Button from "./Helpers/Button";
import { COLORS } from "./Constants/Constants";
import {
  CheckCircle,
  Close,
  AddShoppingCart,
  Edit,
} from "@mui/icons-material";

function ItemDetails({
  isOpen,
  selectedItems,
  setIsOpen,
  title,
  enableUpdate,
}) {
  const [editItems, setEditItems] = useState({});
  const [updatedItems, setUpdatedItems] = useState(selectedItems);

  useEffect(() => {
    if (selectedItems && selectedItems.length) {
      setUpdatedItems(selectedItems);
    }
  }, [selectedItems]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleConfirm = () => {
    if (
      updatedItems.every((item) => item.cost > 0) &&
      Object.values(editItems).every((isEditing) => !isEditing)
    ) {
      handleClose();
    }
  };

  const handleEditClick = (index) => {
    setEditItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleCostChange = (index, value) => {
    setUpdatedItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, cost: value } : item
      )
    );
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby={title}
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
        <span
          className="text-2xl font-bold text-orange-800 mb-4 mt-4"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          {title} Items
        </span>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          style={{ position: "absolute", right: 16, top: 10 }}
        >
          <Close />
        </IconButton>
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
                <th className="p-3 text-left">Cost</th>
                {enableUpdate && <th className="p-3 text-left"></th>}
              </tr>
            </thead>
            <tbody>
              {updatedItems.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-orange-100" : ""}
                >
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.description}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">{item.storeName}</td>
                  <td className="p-3">
                    {editItems[index] ? (
                      <div className="relative max-w-28">
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                          ₹
                        </span>
                        <input
                          type="number"
                          name="cost"
                          placeholder="Cost"
                          className={`w-full pl-6 pr-2 py-2 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300`}
                          value={item.cost}
                          onChange={(e) =>
                            handleCostChange(index, e.target.value)
                          }
                        />
                      </div>
                    ) : (
                      `₹ ${item.cost}`
                    )}
                  </td>
                  {enableUpdate && (
                    <td className="p-3">
                      <Button
                        icon={editItems[index] ? CheckCircle : Edit}
                        bgColor={COLORS.GREY_500}
                        onClick={() => handleEditClick(index)}
                        text={editItems[index] ? "Confirm" : "Edit"}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
      <DialogActions>
        {enableUpdate && (
          <Button
            bgColor={COLORS.GREEN_600}
            customStyles="mr-4 mb-4"
            onClick={handleConfirm}
            icon={AddShoppingCart}
            text="Confirm Order"
          />
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ItemDetails;
