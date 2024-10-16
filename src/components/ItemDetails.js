import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import Button from "./Helpers/Button";
import {
  ALERTS,
  COLORS,
  CURSOR_NOT_ALLOWED,
  CUSTOMER_STATUS,
  IN_PROGRESS_STATUS,
} from "./Constants/Constants";
import { CheckCircle, Close, AddShoppingCart, Edit } from "@mui/icons-material";
import CurrencyToggle from "./Helpers/CurrencyToggle";
import { convertCurrency, getCurrencySymbol } from "./Helpers/staticFunctions";
import { useSnackbar } from "./Helpers/SnackbarContext";
import { updateOrder } from "../services/Api";

function ItemDetails({
  isOpen,
  selectedOrder,
  setIsOpen,
  title,
  enableUpdate,
  fetchOrders,
}) {
  const showSnackbar = useSnackbar();

  const [isLoading, setIsLoading] = useState(false);
  const [editItems, setEditItems] = useState({});
  const [order, setOrder] = useState(selectedOrder);
  const [currency, setCurrency] = useState("INR");

  useEffect(() => {
    if (selectedOrder) {
      setOrder(selectedOrder);
    }
  }, [selectedOrder]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleConfirm = async () => {
    if (!Object.values(editItems).every((isEditing) => !isEditing)) {
      showSnackbar("Please save all items", ALERTS.ERROR);
      return;
    }

    if (!order.items.every((item) => item.cost > 0)) {
      showSnackbar("Please enter costs for all items", ALERTS.ERROR);
      return;
    }

    setIsLoading(true);

    await updateOrder(
      {
        inProgressStatus: IN_PROGRESS_STATUS.COST_ESTIMATE,
        itemsCost: order.items.reduce((sum, item) => sum + item.cost, 0),
      },
      { _id: order._id }
    );

    setIsLoading(false);
    fetchOrders();
    handleClose();
  };

  const handleEditClick = async (index) => {
    if (editItems[index]) {
      const itemToUpdate = order.items[index];

      if (itemToUpdate.cost <= 0) {
        showSnackbar("Cost must be greater than 0", ALERTS.ERROR);
        return;
      }

      setIsLoading(true);

      await updateOrder({ items: order.items }, { _id: order._id });

      setIsLoading(false);
    }

    setEditItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleCostChange = (index, value) => {
    setOrder((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, cost: value } : item
      ),
    }));
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
      <DialogTitle id={title + "_id"}>
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
        {order?.items.length > 0 ? (
          <>
            <div className="mb-4 flex items-center justify-end">
              <CurrencyToggle currency={currency} setCurrency={setCurrency} />
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-orange-500 text-white">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Quantity</th>
                    <th className="p-3 text-left">Store Name</th>
                    <th className="p-3 text-left">Cost</th>
                    {enableUpdate &&
                      order.inProgressStatus !==
                        IN_PROGRESS_STATUS.COST_ESTIMATE && (
                        <th className="p-3 text-left"></th>
                      )}
                  </tr>
                </thead>
                <tbody>
                  {order?.items.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-orange-100" : ""}
                    >
                      <td className="p-3">{item.name || `-`}</td>
                      <td className="p-3">{item.description || `-`}</td>
                      <td className="p-3">{item.quantity || `-`}</td>
                      <td className="p-3">{item.storeName || `-`}</td>
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
                        ) : item.cost ? (
                          `${getCurrencySymbol(currency)} ${convertCurrency(
                            currency,
                            item.cost
                          )}`
                        ) : (
                          `-`
                        )}
                      </td>
                      {enableUpdate &&
                        order.inProgressStatus !==
                          IN_PROGRESS_STATUS.COST_ESTIMATE && (
                          <td className="p-3">
                            <Button
                              icon={editItems[index] ? CheckCircle : Edit}
                              customStyles={isLoading && CURSOR_NOT_ALLOWED}
                              bgColor={COLORS.GREY_500}
                              onClick={() => handleEditClick(index)}
                              text={editItems[index] ? "Confirm" : "Edit"}
                              isDisabled={isLoading}
                            />
                          </td>
                        )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-md border border-orange-200">
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-xl">Customer didn't added any item yet.</h2>
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        {enableUpdate &&
          order?.items.length > 0 &&
          order.customerStatus === CUSTOMER_STATUS.IN_PROGRESS &&
          order.inProgressStatus !== IN_PROGRESS_STATUS.COST_ESTIMATE && (
            <Button
              bgColor={COLORS.GREEN_600}
              customStyles={`mr-4 mb-4 ${isLoading && CURSOR_NOT_ALLOWED}`}
              onClick={handleConfirm}
              icon={AddShoppingCart}
              text={"Confirm Order"}
              isDisabled={isLoading}
            />
          )}
      </DialogActions>
    </Dialog>
  );
}

export default ItemDetails;
